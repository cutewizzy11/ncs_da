# NCS CBT Practice Prototype

A minimal web prototype for a Nigeria Customs Service-style CBT practice test with onboarding, a basic facial verification flow, motion monitoring, and a 60-minute test UI. Questions are loaded from JSON files in the `questions/` folder.

## Features
- Onboarding screen to collect Candidate Number
- Facial Verification screen with action prompts (blink, head left/right, open mouth)
- Motion sensor (frame-difference) with auto-submit on excessive movement
- Test screen with webcam monitoring, navigation, timer, and submission
- Loads questions from JSON files in `questions/`

## Important Limitations
- No heat sensing: browsers do not expose thermal/heat sensors. Motion is estimated via visual frame differences.
- Face verification is currently a guided prompt with manual confirmation (placeholder). Next step is automated detection using MediaPipe FaceMesh or TensorFlow.js Face Landmarks.
- For webcam and `fetch()` to work, serve the site from `localhost` (HTTP) or HTTPS. Opening index.html via file:// will not work.

## Run Locally
From this directory:

Option A: Python (if installed)
```
python -m http.server 5500
```
Then open: http://localhost:5500/

Option B: Node.js (if installed)
```
npx serve -l 5500
```
Then open: http://localhost:5500/

Grant webcam permission when prompted.

## Folder Structure
- `index.html` – app shell and screens
- `assets/css/style.css` – styling
- `assets/js/main.js` – app flow, state, timer, UI
- `assets/js/face_motion.js` – webcam init, motion detection, FR placeholder
- `assets/js/questions.js` – questions schema and loader
- `questions/` – question sets as JSON (see `questions/README.txt`)

## Questions: PDFs vs JSON
This prototype expects JSON. If you have PDFs, we can:
- Build a small converter (Node/Python) to parse PDFs into the JSON schema.
- Or add a backend API that ingests PDFs and serves JSON to the frontend.

JSON Schema example:
```
{
  "meta": { "set": 1, "title": "Set 1", "durationMinutes": 60 },
  "questions": [
    { "id": 1, "subject": "MATHEMATICS", "text": "...", "options": ["A","B","C","D"], "answer": 0 }
  ]
}
```

Target format per set: 60 total questions (20 Mathematics, 20 English, 20 Current Affairs). English may include comprehension and fill-in-the-gap.

## Next Steps (Proposed)
1. Integrate automated face action detection (blink, mouth open, head turns) using MediaPipe FaceMesh.
2. PDF ingestion utility to convert your PDFs into JSON sets.
3. Expand UI for 4 practice sets and per-section navigation if desired.
4. Optional: basic proctoring logs (timestamps for motion spikes, tab visibility changes).
