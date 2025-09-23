// Main app flow

const Screens = {
  onboarding: document.getElementById('screen-onboarding'),
  review: document.getElementById('screen-review'),
  fr: document.getElementById('screen-fr'),
  test: document.getElementById('screen-test'),
  result: document.getElementById('screen-result'),
};

function showScreen(name) {
  Object.values(Screens).forEach(s => s.classList.remove('active'));
  Screens[name].classList.add('active');
}

// State
const AppState = {
  candidateId: '',
  questionData: null,
  currentIndex: 0,
  answers: {},
  timerSecs: 60 * 60,
  autoSubmitTriggered: false,
  setId: 'set1',
};

function saveState() { localStorage.setItem('ncs_state', JSON.stringify(AppState)); }
function loadState() {
  const s = localStorage.getItem('ncs_state');
  if (!s) return;
  try { Object.assign(AppState, JSON.parse(s)); } catch {}
}

function formatTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// Onboarding
(function initOnboarding(){
  const form = document.getElementById('onboarding-form');
  const input = document.getElementById('candidate-id');
  loadState();
  if (AppState.candidateId) input.value = AppState.candidateId;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = input.value.trim();
    if (!id) return;
    AppState.candidateId = id; saveState();

    showScreen('fr');
    document.getElementById('btn-begin-test').disabled = true;

    // Init camera and motion meter
    await NCSCam.initCamera('video', 'overlay');

    const motionBar = document.getElementById('motion-bar');
    const motionStat = document.getElementById('motion-status');
    const debugEl = document.getElementById('debug-readout');
    // Right-panel recalibrate button
    const btnRecalSidebar = document.getElementById('btn-recalibrate');
    if (btnRecalSidebar) btnRecalSidebar.addEventListener('click', () => NCSCam.anchorBaseline());
    NCSCam.onMotionUpdate(score => {
      const pct = Math.min(100, Math.floor((score / 300) * 100));
      motionBar.style.width = `${pct}%`;
      if (score < 50) { motionStat.textContent = 'Movement: OK'; motionStat.className = 'status ok'; }
      else if (score < 150) { motionStat.textContent = 'Movement: Moderate'; motionStat.className = 'status warn'; }
      else { motionStat.textContent = 'Movement: High'; motionStat.className = 'status danger'; }

      // Debug readout (FR)
      if (debugEl) {
        const cs = NCSCam.CameraState;
        const bs = cs.baseline;
        const p = cs.pose || {};
        const dyaw = bs ? (p.yaw - bs.yaw) : 0;
        const dpitch = bs ? (p.pitch - bs.pitch) : 0;
        const droll = bs ? (p.roll - bs.roll) : 0;
        const dnose = bs ? Math.hypot((p.noseX - bs.noseX) || 0, (p.noseY - bs.noseY) || 0) : 0;
        debugEl.textContent = `faces:${cs.faceCount} score:${score.toFixed(1)}\n` +
          `yaw:${(p.yaw||0).toFixed(3)} dyaw:${dyaw.toFixed(3)}\n` +
          `pitch:${(p.pitch||0).toFixed(3)} dpitch:${dpitch.toFixed(3)}\n` +
          `roll:${(p.roll||0).toFixed(3)} droll:${droll.toFixed(3)}\n` +
          `noseShift:${dnose.toFixed(3)} base:${bs? 'yes':'no'}`;
      }
    });

    // Start FR placeholder flow
    NCSCam.startFRFlow().then(() => {
      document.getElementById('btn-begin-test').disabled = false;
    });

    // Allow skipping FR if user's device has trouble
    const btnSkip = document.getElementById('btn-skip-fr');
    if (btnSkip) {
      btnSkip.onclick = async () => { await goToReview(); };
    }

    // Re-Calibrate (primary control near prompt)
    const btnRecalFR = document.getElementById('btn-recalibrate-fr');
    if (btnRecalFR) btnRecalFR.onclick = async () => { await NCSCam.anchorBaseline(); };

    // Manual Verify
    const btnManual = document.getElementById('btn-manual-verify');
    if (btnManual) btnManual.onclick = async () => {
      // mark all steps done and proceed
      document.querySelectorAll('#fr-steps li').forEach(li => li.classList.add('done'));
      const prompt = document.getElementById('prompt');
      if (prompt) prompt.textContent = 'Verification complete (manual)';
      await NCSCam.anchorBaseline();
      document.getElementById('btn-begin-test').disabled = false;
    };

    // Diagnostics toggle
    const btnDiag = document.getElementById('btn-toggle-diag');
    const diagPanel = document.getElementById('diag-panel');
    if (btnDiag && diagPanel) {
      btnDiag.onclick = () => { diagPanel.style.display = (diagPanel.style.display === 'none' ? 'block' : 'none'); };
    }

    // Bind live metrics and sliders
    const diag = {
      faces: document.getElementById('diag-faces'),
      motion: document.getElementById('diag-motion'),
      ear: document.getElementById('diag-ear'),
      mar: document.getElementById('diag-mar'),
      yaw: document.getElementById('diag-yaw'),
      pitch: document.getElementById('diag-pitch'),
      roll: document.getElementById('diag-roll'),
    };
    const sliders = {
      blink: document.getElementById('th-blink'),
      mouth: document.getElementById('th-mouth'),
      yaw: document.getElementById('th-yaw'),
      frames: document.getElementById('th-frames'),
    };
    const labels = {
      blink: document.getElementById('th-blink-val'),
      mouth: document.getElementById('th-mouth-val'),
      yaw: document.getElementById('th-yaw-val'),
      frames: document.getElementById('th-frames-val'),
    };

    // Init from localStorage
    const cfg = JSON.parse(localStorage.getItem('ncs_fr_thresholds') || '{}');
    sliders.blink && (sliders.blink.value = (cfg.blink ?? 0.22));
    sliders.mouth && (sliders.mouth.value = (cfg.mouth ?? 0.30));
    sliders.yaw && (sliders.yaw.value = (cfg.yaw ?? 0.06));
    sliders.frames && (sliders.frames.value = (cfg.frames ?? 3));
    const syncLabels = () => {
      if (labels.blink && sliders.blink) labels.blink.textContent = Number(sliders.blink.value).toFixed(2);
      if (labels.mouth && sliders.mouth) labels.mouth.textContent = Number(sliders.mouth.value).toFixed(2);
      if (labels.yaw && sliders.yaw) labels.yaw.textContent = Number(sliders.yaw.value).toFixed(2);
      if (labels.frames && sliders.frames) labels.frames.textContent = String(sliders.frames.value);
    };
    syncLabels();
    const saveCfg = () => {
      const newCfg = {
        blink: Number(sliders.blink?.value || 0.22),
        mouth: Number(sliders.mouth?.value || 0.30),
        yaw: Number(sliders.yaw?.value || 0.06),
        frames: Number(sliders.frames?.value || 3),
      };
      localStorage.setItem('ncs_fr_thresholds', JSON.stringify(newCfg));
      // Signal face_motion to pick updated thresholds on next frame
      window.NCS_FR_THRESH = newCfg;
      syncLabels();
    };
    sliders.blink && (sliders.blink.oninput = saveCfg);
    sliders.mouth && (sliders.mouth.oninput = saveCfg);
    sliders.yaw && (sliders.yaw.oninput = saveCfg);
    sliders.frames && (sliders.frames.oninput = saveCfg);

    // Live metrics updates
    if (NCSCam && NCSCam.onMotionUpdate) {
      NCSCam.onMotionUpdate(score => {
        if (diag.motion) diag.motion.textContent = score.toFixed(0);
      });
    }
  });
})();

// Begin test button
(function initBeginBtn(){
  const btn = document.getElementById('btn-begin-test');
  btn.addEventListener('click', async () => {
    await goToReview();
  });
})();

async function goToReview() {
  // load questions for selected set and open review screen
  const data = await NCSQuestions.loadBySubjects();
  if (!data.questions || data.questions.length === 0) {
    alert('No questions found in the selected set. Please choose another set or re-run the PDF converter.');
    return;
  }
  AppState.questionData = data;
  AppState.answers = {}; // clear candidate answers for timed test
  AppState.currentIndex = 0;
  AppState.timerSecs = (data.meta?.durationMinutes || 60) * 60;
  saveState();

  showScreen('review');
  document.getElementById('candidate-display-review').textContent = `Candidate: ${AppState.candidateId}`;

  // header set selector (review)
  const sel = document.getElementById('set-select-header-review');
  if (sel) {
    sel.value = AppState.setId || 'set1';
    sel.onchange = async () => { AppState.setId = sel.value; saveState(); await goToReview(); };
  }

  buildNavigationReview();
  renderQuestionReview();
}

async function startTest() {
  // Use already reviewed data if present; otherwise load
  let data = AppState.questionData;
  if (!data || !data.questions || data.questions.length === 0) {
    data = await NCSQuestions.loadBySubjects();
    AppState.questionData = data;
  }
  AppState.answers = AppState.answers || {};
  AppState.currentIndex = AppState.currentIndex || 0;
  AppState.timerSecs = (data.meta?.durationMinutes || 60) * 60;
  saveState();

  if (!data.questions || data.questions.length === 0) {
    alert('No questions found in the selected set. Please choose another set or re-run the PDF converter.');
    showScreen('fr');
    return;
  }

  // Switch screen
  showScreen('test');
  document.getElementById('candidate-display').textContent = `Candidate: ${AppState.candidateId}`;

  // header set selector (test) – disabled during timing
  const selHead = document.getElementById('set-select-header');
  if (selHead) {
    selHead.value = AppState.setId || 'set1';
    selHead.disabled = true;
  }

  // Keep webcam in mini view
  const mini = document.getElementById('video-mini');
  mini.srcObject = NCSCam.CameraState.stream;

  // Motion monitoring in test
  const motionStat = document.getElementById('motion-status-test');
  const debugTest = document.getElementById('debug-readout-test');
  let highMoveCount = 0;
  NCSCam.onMotionUpdate(score => {
    if (score < 50) { motionStat.textContent = 'Movement: OK'; motionStat.className = 'status ok tiny'; highMoveCount = 0; }
    else if (score < 150) { motionStat.textContent = 'Movement: Moderate'; motionStat.className = 'status warn tiny'; highMoveCount = 0; }
    else { motionStat.textContent = 'Movement: High – Auto submit if continues'; motionStat.className = 'status danger tiny'; highMoveCount++; }

    if (!AppState.autoSubmitTriggered && highMoveCount > 120) { // ~2s at 60fps
      AppState.autoSubmitTriggered = true; saveState();
      submitTest(true);
    }

    // Debug readout (Test)
    if (debugTest) {
      const cs = NCSCam.CameraState;
      const bs = cs.baseline;
      const p = cs.pose || {};
      const dyaw = bs ? (p.yaw - bs.yaw) : 0;
      const dpitch = bs ? (p.pitch - bs.pitch) : 0;
      const droll = bs ? (p.roll - bs.roll) : 0;
      const dnose = bs ? Math.hypot((p.noseX - bs.noseX) || 0, (p.noseY - bs.noseY) || 0) : 0;
      debugTest.textContent = `faces:${cs.faceCount} score:${score.toFixed(1)}\n` +
        `yaw:${(p.yaw||0).toFixed(3)} dyaw:${dyaw.toFixed(3)}\n` +
        `pitch:${(p.pitch||0).toFixed(3)} dpitch:${dpitch.toFixed(3)}\n` +
        `roll:${(p.roll||0).toFixed(3)} droll:${droll.toFixed(3)}\n` +
        `noseShift:${dnose.toFixed(3)} base:${bs? 'yes':'no'}`;
    }
  });

  buildNavigation();
  renderQuestion();
  startTimer();
}

function buildNavigation() {
  const grid = document.getElementById('nav-grid');
  grid.innerHTML = '';
  const total = AppState.questionData.questions.length;
  for (let i = 0; i < total; i++) {
    const btn = document.createElement('button');
    btn.textContent = String(i+1);
    btn.className = i === AppState.currentIndex ? 'active' : '';
    if (AppState.answers[i] !== undefined) btn.classList.add('answered');
    btn.addEventListener('click', () => { AppState.currentIndex = i; saveState(); renderQuestion(); buildNavigation(); });
    grid.appendChild(btn);
  }
}

function renderQuestion() {
  const q = AppState.questionData.questions[AppState.currentIndex];
  document.getElementById('question-meta').textContent = `${q.subject} • Q${AppState.currentIndex+1} of ${AppState.questionData.questions.length}`;
  document.getElementById('question-text').textContent = q.text;

  const opts = document.getElementById('options');
  opts.innerHTML = '';
  q.options.forEach((opt, idx) => {
    const label = document.createElement('label');
    label.className = 'option';
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'opt';
    input.value = idx;
    if (AppState.answers[AppState.currentIndex] === idx) input.checked = true;
    input.addEventListener('change', () => { AppState.answers[AppState.currentIndex] = idx; saveState(); buildNavigation(); });
    const span = document.createElement('span');
    span.textContent = opt;
    label.appendChild(input); label.appendChild(span);
    opts.appendChild(label);
  });

  document.getElementById('prev').onclick = () => {
    if (AppState.currentIndex > 0) { AppState.currentIndex--; saveState(); renderQuestion(); buildNavigation(); }
  };
  document.getElementById('next').onclick = () => {
    if (AppState.currentIndex < AppState.questionData.questions.length - 1) { AppState.currentIndex++; saveState(); renderQuestion(); buildNavigation(); }
  };
  document.getElementById('submit').onclick = () => submitTest(false);
}

let timerInterval = null;
function startTimer() {
  const timerEl = document.getElementById('timer');
  clearInterval(timerInterval);
  timerEl.textContent = formatTime(AppState.timerSecs);
  timerInterval = setInterval(() => {
    AppState.timerSecs--; if (AppState.timerSecs < 0) AppState.timerSecs = 0;
    saveState();
    timerEl.textContent = formatTime(AppState.timerSecs);
    if (AppState.timerSecs <= 0) { clearInterval(timerInterval); submitTest(false, true); }
  }, 1000);
}

function submitTest(autoByMotion = false, timeExpired = false) {
  // stop timer and camera
  clearInterval(timerInterval);

  const total = AppState.questionData.questions.length;
  let score = 0;
  const details = [];
  AppState.questionData.questions.forEach((q, i) => {
    const chosen = AppState.answers[i];
    const correct = q.answer;
    const ok = Number(chosen) === Number(correct);
    if (ok) score++;
    details.push({ i: i+1, subject: q.subject, ok, chosen, correct });
  });

  showScreen('result');
  const meta = [];
  if (autoByMotion) meta.push('Auto-submitted due to excessive movement');
  if (timeExpired) meta.push('Time expired');
  document.getElementById('result-summary').textContent = `${meta.join(' • ')}${meta.length? ' • ' : ''}Score: ${score}/${total}`;

  const container = document.getElementById('result-detail');
  container.innerHTML = '';
  details.forEach(d => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `<div class="tiny muted">Q${d.i} • ${d.subject}</div><div>${d.ok ? 'Correct' : 'Incorrect'}</div>`;
    container.appendChild(div);
  });

  document.getElementById('restart').onclick = () => {
    localStorage.removeItem('ncs_state');
    location.reload();
  };
}

// Review Mode logic
function buildNavigationReview() {
  const grid = document.getElementById('nav-grid-review');
  grid.innerHTML = '';
  const total = AppState.questionData.questions.length;
  for (let i = 0; i < total; i++) {
    const btn = document.createElement('button');
    btn.textContent = String(i+1);
    btn.className = i === AppState.currentIndex ? 'active' : '';
    const q = AppState.questionData.questions[i];
    if (q.answer !== null && q.answer !== undefined) btn.classList.add('answered');
    btn.addEventListener('click', () => { AppState.currentIndex = i; saveState(); renderQuestionReview(); buildNavigationReview(); });
    grid.appendChild(btn);
  }
}

function renderQuestionReview() {
  const q = AppState.questionData.questions[AppState.currentIndex];
  document.getElementById('question-meta-review').textContent = `${q.subject} • Q${AppState.currentIndex+1} of ${AppState.questionData.questions.length}`;
  document.getElementById('question-text-review').textContent = q.text;
  const opts = document.getElementById('options-review');
  opts.innerHTML = '';
  q.options.forEach((opt, idx) => {
    const label = document.createElement('label');
    label.className = 'option';
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'opt-review';
    input.value = idx;
    if (q.answer === idx) input.checked = true;
    input.addEventListener('change', () => { q.answer = idx; saveState(); buildNavigationReview(); });
    const span = document.createElement('span');
    span.textContent = opt;
    label.appendChild(input); label.appendChild(span);
    opts.appendChild(label);
  });

  document.getElementById('prev-review').onclick = () => {
    if (AppState.currentIndex > 0) { AppState.currentIndex--; saveState(); renderQuestionReview(); buildNavigationReview(); }
  };
  document.getElementById('next-review').onclick = () => {
    if (AppState.currentIndex < AppState.questionData.questions.length - 1) { AppState.currentIndex++; saveState(); renderQuestionReview(); buildNavigationReview(); }
  };

  const startBtn = document.getElementById('start-timed');
  startBtn.onclick = async () => {
    await startTest();
  };

  const exportBtn = document.getElementById('export-set');
  exportBtn.onclick = () => {
    // Build export JSON matching loader schema
    const data = AppState.questionData;
    const out = {
      meta: {
        set: data.meta?.set || AppState.setId || 'setX',
        title: data.meta?.title || 'Reviewed Set',
        durationMinutes: data.meta?.durationMinutes || 60,
      },
      questions: data.questions.map((q, i) => ({
        id: i + 1,
        subject: q.subject,
        text: q.text,
        options: q.options,
        answer: q.answer ?? null,
      })),
    };
    const blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    const ts = new Date().toISOString().slice(0,10);
    const fname = `${out.meta.set || 'setX'}_reviewed_${ts}.json`;
    a.href = URL.createObjectURL(blob);
    a.download = fname;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
  };
}
