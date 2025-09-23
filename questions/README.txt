Place your question sets here. For each set, create a JSON file with the following structure:

{
  "meta": { "set": 1, "title": "Set 1", "durationMinutes": 60 },
  "questions": [
    { "id": 1, "subject": "MATHEMATICS", "text": "...", "options": ["A","B","C","D"], "answer": 0 },
    ...
  ]
}

Notes:
- This prototype expects JSON. If your questions are in PDFs, we will add a converter later to produce these JSON files.
- Target format: 60 total questions per set: 20 Mathematics, 20 English (including comprehension and fill-in-the-gap), 20 Current Affairs.
- You can add more sets like set2.json, set3.json. Update assets/js/questions.js QUESTION_SETS if you want to pick a different default.
