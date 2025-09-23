// Webcam init, simple motion detection, and automated facial action verification flow (MediaPipe FaceMesh)

const CameraState = {
  stream: null,
  videoEl: null,
  canvasEl: null,
  ctx: null,
  lastFrameData: null,
  motionScore: 0,
  listeners: new Set(),
  running: false,
  faceMesh: null,
  fmReady: false,
  lastLandmarks: null,
  faceCount: 0,
  pose: { yaw: 0, pitch: 0, roll: 0, noseX: 0, noseY: 0, faceWidth: 0 },
  baseline: null,
  metrics: { ear: 0, mar: 0, yaw: 0, pitch: 0, roll: 0 },
};

function onMotionUpdate(cb) { CameraState.listeners.add(cb); return () => CameraState.listeners.delete(cb); }

async function initCamera(videoId = 'video', canvasId = 'overlay') {
  const video = document.getElementById(videoId);
  const canvas = document.getElementById(canvasId);
  CameraState.videoEl = video;
  CameraState.canvasEl = canvas;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
    CameraState.stream = stream;
    video.srcObject = stream;

    await new Promise(res => video.onloadedmetadata = res);

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Use willReadFrequently for better getImageData performance
    CameraState.ctx = canvas.getContext('2d', { willReadFrequently: true });
    CameraState.running = true;
    loopMotion();
    await initFaceMesh();
    loopFaceMesh();
  } catch (e) {
    console.error('Camera init failed', e);
    const prompt = document.getElementById('prompt');
    if (prompt) prompt.textContent = 'Camera access denied. Please allow webcam and reload.';
    throw e;
  }
}

function loopMotion() {
  if (!CameraState.running) return;
  const { videoEl: v, canvasEl: c, ctx } = CameraState;
  if (!v || !c || !ctx || v.readyState < 2) {
    requestAnimationFrame(loopMotion);
    return;
  }
  ctx.drawImage(v, 0, 0, c.width, c.height);
  const frame = ctx.getImageData(0, 0, c.width, c.height);

  // Luminance-based change detection with thresholding
  let changed = 0;
  let total = 0;
  if (CameraState.lastFrameData) {
    const a = frame.data;
    const b = CameraState.lastFrameData;
    const len = a.length;
    const STRIDE = 4 * 4; // denser sampling (every 4 pixels)
    const TH = 18; // luminance delta threshold (tune if needed)
    for (let i = 0; i < len; i += STRIDE) {
      const Ya = 0.2126 * a[i] + 0.7152 * a[i+1] + 0.0722 * a[i+2];
      const Yb = 0.2126 * b[i] + 0.7152 * b[i+1] + 0.0722 * b[i+2];
      const d = Math.abs(Ya - Yb);
      if (d > TH) changed++;
      total++;
    }
  }
  CameraState.lastFrameData = frame.data.slice(0);

  // Percentage of changed samples scaled to 0..300
  const ratio = total > 0 ? (changed / total) : 0; // 0..1
  const fallbackScaled = Math.min(300, Math.max(0, ratio * 300));

  // Face-based strict motion using pose deviation if available
  let faceScaled = 0;
  const bs = CameraState.baseline;
  if (CameraState.faceCount === 0) {
    faceScaled = 300; // face missing => high
  } else if (CameraState.faceCount > 1) {
    faceScaled = 300; // multiple faces => high
  } else if (bs) {
    const p = CameraState.pose;
    const dyaw = Math.abs(p.yaw - bs.yaw);
    const dpitch = Math.abs(p.pitch - bs.pitch);
    const droll = Math.abs(p.roll - bs.roll);
    // Nose shift normalized by face width
    const dnose = Math.hypot(p.noseX - bs.noseX, p.noseY - bs.noseY);

    // Thresholds (stricter by default)
    const TY = 0.08; // yaw
    const TP = 0.08; // pitch
    const TR = 0.08; // roll
    const TN = 0.12; // nose shift

    let score = 0;
    // Scale each component into 0..100 ranges beyond threshold
    const scalePart = (d, t, k = 100) => d <= t ? 0 : Math.min(100, ((d - t) / t) * k);
    score += scalePart(dyaw, TY);
    score += scalePart(dpitch, TP);
    score += scalePart(droll, TR);
    score += Math.min(100, (dnose / TN) * 100);

    faceScaled = Math.min(300, score); // 0..300
  } else {
    faceScaled = 0; // no baseline yet
  }

  const combined = Math.max(faceScaled, fallbackScaled);
  // Smoothing (still responsive)
  CameraState.motionScore = 0.5 * CameraState.motionScore + 0.5 * combined;

  // Notify listeners
  CameraState.listeners.forEach(cb => cb(CameraState.motionScore));

  requestAnimationFrame(loopMotion);
}

function stopCamera() {
  CameraState.running = false;
  if (CameraState.stream) {
    CameraState.stream.getTracks().forEach(t => t.stop());
  }
}

// FaceMesh init and loop
async function initFaceMesh() {
  // Handle both global patterns: FaceMesh or FaceMesh.FaceMesh
  const FaceMeshNamespace = window.FaceMesh;
  const FaceMeshCtor = FaceMeshNamespace && (FaceMeshNamespace.FaceMesh || FaceMeshNamespace);
  if (!FaceMeshCtor) {
    console.warn('FaceMesh script not loaded or constructor unavailable');
    return;
  }
  const fm = new FaceMeshCtor({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
  });
  fm.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });
  fm.onResults(onFaceResults);
  CameraState.faceMesh = fm;
  CameraState.fmReady = true;
}

async function loopFaceMesh() {
  if (!CameraState.running || !CameraState.fmReady || !CameraState.videoEl) {
    requestAnimationFrame(loopFaceMesh);
    return;
  }
  try {
    await CameraState.faceMesh.send({ image: CameraState.videoEl });
  } catch (e) {
    // ignore occasional send errors
  }
  requestAnimationFrame(loopFaceMesh);
}

// Facial action detection state
const FR_STEPS = [
  { key: 'blink', text: 'Please blink your eyes' },
  { key: 'left', text: 'Turn your head to the LEFT' },
  { key: 'right', text: 'Turn your head to the RIGHT' },
  { key: 'mouth', text: 'Open your mouth' },
];

const FRState = {
  currentIdx: 0,
  resolved: null,
  counters: { blink: 0, left: 0, right: 0, mouth: 0 },
};

function markStepDone(key) {
  const li = Array.from(document.querySelectorAll('#fr-steps li')).find(x => x.dataset.step === key);
  if (li) li.classList.add('done');
}

function setPrompt(text) {
  const promptEl = document.getElementById('prompt');
  if (promptEl) promptEl.textContent = text;
}

function onFaceResults(results) {
  CameraState.faceCount = (results.multiFaceLandmarks && results.multiFaceLandmarks.length) || 0;
  if (CameraState.faceCount === 0) return;
  const lm = results.multiFaceLandmarks[0];
  CameraState.lastLandmarks = lm;

  // Draw landmarks overlay for visual confirmation
  try {
    const { canvasEl: c, ctx } = CameraState;
    if (c && ctx) {
      // draw subtle overlay points
      ctx.save();
      ctx.fillStyle = 'rgba(16, 185, 129, 0.8)'; // emerald dots
      const w = c.width, h = c.height;
      for (let i = 0; i < lm.length; i += 5) { // sample every 5th point for performance
        const p = lm[i];
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  } catch {}

  // Compute helper distances
  const d = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const idx = (i) => lm[i];

  // Eye aspect ratios
  const leftEyeTop = idx(159), leftEyeBot = idx(145), leftEyeL = idx(33), leftEyeR = idx(133);
  const rightEyeTop = idx(386), rightEyeBot = idx(374), rightEyeL = idx(362), rightEyeR = idx(263);
  const lVert = d(leftEyeTop, leftEyeBot), lHorz = d(leftEyeL, leftEyeR);
  const rVert = d(rightEyeTop, rightEyeBot), rHorz = d(rightEyeL, rightEyeR);
  const ear = ((lVert / lHorz) + (rVert / rHorz)) / 2; // eye aspect ratio

  // Mouth open ratio
  const mouthTop = idx(13), mouthBot = idx(14), mouthL = idx(61), mouthR = idx(291);
  const mar = d(mouthTop, mouthBot) / d(mouthL, mouthR);

  // Head yaw estimate (nose vs cheeks)
  const nose = idx(1), cheekL = idx(234), cheekR = idx(454);
  const faceWidth = d(cheekL, cheekR);
  const yaw = ((nose.x - (cheekL.x + cheekR.x) / 2) / (faceWidth || 1)); // negative = left turn
  // Approximate pitch using eye-to-nose vertical relation
  const eyeMidY = (leftEyeTop.y + leftEyeBot.y + rightEyeTop.y + rightEyeBot.y) / 4;
  const pitch = ((nose.y - eyeMidY) / (faceWidth || 1));
  // Approximate roll from eyes
  const roll = Math.atan2((leftEyeR.y + rightEyeL.y) / 2 - (leftEyeL.y + rightEyeR.y) / 2, (leftEyeR.x + rightEyeL.x) / 2 - (leftEyeL.x + rightEyeR.x) / 2);

  CameraState.pose = {
    yaw,
    pitch,
    roll,
    noseX: nose.x,
    noseY: nose.y,
    faceWidth,
  };
  CameraState.metrics = { ear, mar, yaw, pitch, roll };

  // Thresholds and counters (read from UI if provided)
  const cfg = window.NCS_FR_THRESH || (function(){
    try { return JSON.parse(localStorage.getItem('ncs_fr_thresholds')||'{}'); } catch { return {}; }
  })();
  const BLINK_T = Number(cfg.blink ?? 0.22);
  const MOUTH_T = Number(cfg.mouth ?? 0.30);
  const YAW_T = Number(cfg.yaw ?? 0.06);
  const YAW_LEFT_T = -Math.abs(YAW_T);
  const YAW_RIGHT_T = Math.abs(YAW_T);

  const inc = (k, cond) => { FRState.counters[k] = cond ? Math.min(FRState.counters[k] + 1, 999) : 0; };
  inc('blink', ear < BLINK_T);
  inc('mouth', mar > MOUTH_T);
  inc('left', yaw < YAW_LEFT_T);
  inc('right', yaw > YAW_RIGHT_T);

  // Progress through steps in order
  const step = FR_STEPS[FRState.currentIdx];
  if (!step) return;

  setPrompt(step.text);

  const HIT_FRAMES = Number(cfg.frames ?? 3); // frames needed to register action
  if (FRState.counters[step.key] >= HIT_FRAMES) {
    markStepDone(step.key);
    FRState.currentIdx++;
    if (FRState.currentIdx >= FR_STEPS.length) {
      setPrompt('Verification complete');
      // Automatic calibration (average baseline over short window)
      autoCalibrateBaseline().finally(() => {
        if (FRState.resolved) { FRState.resolved(); FRState.resolved = null; }
      });
    }
  }
}

// Public FR flow: returns a Promise resolved when verification is complete.
async function startFRFlow() {
  // Reset state
  FRState.currentIdx = 0;
  FRState.counters = { blink: 0, left: 0, right: 0, mouth: 0 };
  document.querySelectorAll('#fr-steps li').forEach(li => li.classList.remove('done'));
  setPrompt('Initializing face detection…');

  // Wait briefly to ensure FaceMesh is ready
  for (let i = 0; i < 60 && !CameraState.fmReady; i++) {
    await new Promise(r => setTimeout(r, 50));
  }
  if (!CameraState.fmReady) setPrompt('Face detection unavailable. You may proceed, but actions will not be verified.');

  return new Promise(resolve => { FRState.resolved = resolve; });
}

// Expose to other scripts
function anchorBaseline() {
  if (CameraState.pose && CameraState.pose.faceWidth) {
    CameraState.baseline = { ...CameraState.pose };
  }
}

// Auto calibration: average pose over N frames within a timeout while user holds still
async function autoCalibrateBaseline(frames = 20, timeoutMs = 2000) {
  const promptPrev = document.getElementById('prompt')?.textContent;
  setPrompt('Calibrating baseline… Please face forward and hold still');
  const samples = [];
  const start = performance.now();
  while (samples.length < frames && (performance.now() - start) < timeoutMs) {
    if (CameraState.faceCount === 1 && CameraState.pose && CameraState.pose.faceWidth) {
      samples.push({ ...CameraState.pose });
    }
    await new Promise(r => setTimeout(r, 30));
  }
  if (samples.length) {
    const avg = samples.reduce((acc, p) => ({
      yaw: acc.yaw + p.yaw,
      pitch: acc.pitch + p.pitch,
      roll: acc.roll + p.roll,
      noseX: acc.noseX + p.noseX,
      noseY: acc.noseY + p.noseY,
      faceWidth: acc.faceWidth + p.faceWidth,
    }), { yaw:0, pitch:0, roll:0, noseX:0, noseY:0, faceWidth:0 });
    const n = samples.length;
    CameraState.baseline = {
      yaw: avg.yaw / n,
      pitch: avg.pitch / n,
      roll: avg.roll / n,
      noseX: avg.noseX / n,
      noseY: avg.noseY / n,
      faceWidth: avg.faceWidth / n,
    };
  } else {
    // fallback to single snapshot
    anchorBaseline();
  }
  if (promptPrev) setPrompt(promptPrev);
}

window.NCSCam = { initCamera, stopCamera, onMotionUpdate, startFRFlow, CameraState, anchorBaseline };
