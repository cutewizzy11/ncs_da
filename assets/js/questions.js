// Question schema and loader with normalization and subject partitioning
// Schema:
// {
//   "meta": { "set": 1, "title": "Set 1", "durationMinutes": 60 },
//   "questions": [
//     { "id": 1, "subject": "MATHEMATICS", "text": "...", "options": ["A","B","C","D"], "answer": 0 },
//     ... up to 60 per set
//   ]
// }

const QUESTION_SETS = ['set1','set2','set3','set4','set5'].map(id => ({ id, file: `questions/${id}.json`, title: id.replace('set','Set ') }));

function normalizeSubject(subj) {
  if (!subj) return 'UNASSIGNED';
  const s = String(subj).toUpperCase().replace(/\s+/g, ' ').trim();
  if (s.includes('MATH')) return 'MATHEMATICS';
  if (s.includes('ENGLISH')) return 'ENGLISH';
  if (s.includes('CURRENT')) return 'CURRENT AFFAIRS';
  return 'UNASSIGNED';
}

function sanitizeOptionText(opt) {
  if (!opt) return opt;
  // remove any lingering ANS markers just in case
  return String(opt).replace(/\bANS(?:WER)?\s*[:\-]*\s*[A-D]\b/gi, '').trim().replace(/[\-:]+\s*$/, '').trim();
}

function classifyHeuristic(q) {
  const t = `${q.text} ${q.options.join(' ')}`.toLowerCase();
  const hasMath = /\b(percent|ratio|probability|simplify|evaluate|triangle|angle|sum|product|difference|lcm|hcf|prime|equation|speed|distance|time|area|volume|perimeter|mean|median|mode|variance|probability|graph|algebra|solve)\b/.test(t) || /[0-9][0-9\/%+\-*x×÷=()]+/.test(t);
  const hasCA = /\b(nigeria|president|constitution|senate|governor|minister|capital|currency|independence|ecowas|au|united nations|who|imf|cbn|202[0-9]|201[0-9]|state|federal)\b/.test(t);
  const hasEng = /\b(passage|synonym|antonym|comprehension|grammar|pronoun|adjective|verb|adverb|preposition|clause|phrase|idiom|punctuation|vowel|consonant|essay)\b/.test(t);
  if (hasMath && !hasCA) return 'MATHEMATICS';
  if (hasCA && !hasMath) return 'CURRENT AFFAIRS';
  if (hasEng) return 'ENGLISH';
  return 'UNASSIGNED';
}

function partitionQuestions(rawQuestions) {
  const qn = (Array.isArray(rawQuestions) ? rawQuestions : []).map((q, i) => ({
    id: q.id ?? i+1,
    subject: normalizeSubject(q.subject),
    text: String(q.text || '').trim(),
    options: (q.options || []).map(sanitizeOptionText),
    answer: (q.answer ?? null),
  })).filter(q => q.text && q.options && q.options.length >= 4);

  const buckets = {
    'MATHEMATICS': [], 'ENGLISH': [], 'CURRENT AFFAIRS': [], 'UNASSIGNED': []
  };
  qn.forEach(q => { (buckets[q.subject] || buckets['UNASSIGNED']).push(q); });

  // Auto-classify UNASSIGNED heuristically into buckets
  const reassigned = [];
  for (const q of buckets['UNASSIGNED']) {
    const cls = classifyHeuristic(q);
    if (cls !== 'UNASSIGNED') {
      q.subject = cls;
      buckets[cls].push(q);
    } else {
      reassigned.push(q);
    }
  }
  buckets['UNASSIGNED'] = reassigned; // keep the rest aside (not used to pad other subjects)

  // Strict target sizes: do NOT borrow across subjects
  const target = { 'MATHEMATICS': 20, 'ENGLISH': 20, 'CURRENT AFFAIRS': 20 };
  const picked = { 'MATHEMATICS': [], 'ENGLISH': [], 'CURRENT AFFAIRS': [] };
  for (const k of Object.keys(picked)) {
    picked[k] = buckets[k].slice(0, target[k]);
  }

  // Combine strictly by subject order; length may be < 60 if a subject is short
  let combined = [...picked['MATHEMATICS'], ...picked['ENGLISH'], ...picked['CURRENT AFFAIRS']];
  combined = combined.map((q, idx) => ({ ...q, id: idx + 1 }));
  
  return combined;
}

async function loadQuestionSet(setId = 'set1') {
  const set = QUESTION_SETS.find(s => s.id === setId) || QUESTION_SETS[0];
  const res = await fetch(set.file, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load questions: ${res.status}`);
  const data = await res.json();
  const normalized = { meta: data.meta || {}, questions: partitionQuestions(data.questions) };
  // Ensure meta duration
  if (!normalized.meta.durationMinutes) normalized.meta.durationMinutes = 60;
  normalized.meta.set = setId;
  normalized.meta.title = normalized.meta.title || set.title;
  return normalized;
}

window.NCSQuestions = { loadQuestionSet };

// SUBJECT MODE: aggregate from all available sets and build exactly 20 per subject (if available)
async function safeFetch(url) {
  try {
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}

async function loadBySubjects() {
  const raws = [];
  for (const s of QUESTION_SETS) {
    const data = await safeFetch(s.file);
    if (data && Array.isArray(data.questions)) raws.push(...data.questions);
  }
  // Normalize
  const qn = (raws || []).map((q, i) => ({
    id: q.id ?? i+1,
    subject: normalizeSubject(q.subject),
    text: String(q.text || '').trim(),
    options: (q.options || []).map(sanitizeOptionText),
    answer: (q.answer ?? null),
  })).filter(q => q.text && q.options && q.options.length >= 4);

  // Buckets
  const buckets = { 'MATHEMATICS': [], 'ENGLISH': [], 'CURRENT AFFAIRS': [] };
  // Try heuristic on unassigned
  qn.forEach(q => {
    let s = q.subject;
    if (s === 'UNASSIGNED') s = classifyHeuristic(q);
    if (buckets[s]) buckets[s].push({ ...q, subject: s });
  });

  // Pick up to 20 per subject (no borrowing) in desired order: ENGLISH, MATHEMATICS, CURRENT AFFAIRS
  const order = ['ENGLISH', 'MATHEMATICS', 'CURRENT AFFAIRS'];
  let combined = [];
  for (const k of order) combined.push(...buckets[k].slice(0, 20));
  combined = combined.map((q, idx) => ({ ...q, id: idx + 1 }));

  return {
    meta: { set: 'subjects', title: 'By Subjects (20 Eng / 20 Math / 20 CA)', durationMinutes: 60 },
    questions: combined,
  };
}

window.NCSQuestions.loadBySubjects = loadBySubjects;

// Single-subject loader: returns up to 20 for a chosen subject across all available sets
async function loadBySubject(subjectKey = 'ENGLISH') {
  const key = normalizeSubject(subjectKey);
  const raws = [];
  for (const s of QUESTION_SETS) {
    const data = await safeFetch(s.file);
    if (data && Array.isArray(data.questions)) raws.push(...data.questions);
  }
  const qn = (raws || []).map((q, i) => ({
    id: q.id ?? i+1,
    subject: normalizeSubject(q.subject),
    text: String(q.text || '').trim(),
    options: (q.options || []).map(sanitizeOptionText),
    answer: (q.answer ?? null),
  })).filter(q => q.text && q.options && q.options.length >= 4);
  const picked = [];
  // Pass 1: take questions explicitly tagged with the subject
  for (const q of qn) {
    if (q.subject === key) picked.push({ ...q });
    if (picked.length >= 20) break;
  }
  // Pass 2: fill from UNASSIGNED where heuristic agrees
  if (picked.length < 20) {
    for (const q of qn) {
      if (q.subject !== 'UNASSIGNED') continue;
      const cls = classifyHeuristic(q);
      if (cls === key) picked.push({ ...q, subject: key });
      if (picked.length >= 20) break;
    }
  }
  // We intentionally do NOT include items where original subject contradicts the requested subject,
  // even if heuristic suggests otherwise, to avoid cross-subject mixing.
  const questions = picked.map((q, idx) => ({ ...q, id: idx + 1 }));
  return { meta: { set: key.toLowerCase(), title: `${key} (20)`, durationMinutes: 60 }, questions };
}

window.NCSQuestions.loadBySubject = loadBySubject;

// Mixed mode: aggregate all available sets and return up to 60 randomized questions
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function loadMixed60() {
  const raws = [];
  for (const s of QUESTION_SETS) {
    const data = await safeFetch(s.file);
    if (data && Array.isArray(data.questions)) raws.push(...data.questions);
  }
  const qn = (raws || []).map((q, i) => ({
    id: q.id ?? i+1,
    subject: normalizeSubject(q.subject),
    text: String(q.text || '').trim(),
    options: (q.options || []).map(sanitizeOptionText),
    answer: (q.answer ?? null),
  })).filter(q => q.text && q.options && q.options.length >= 4);

  const picked = shuffle(qn.slice()).slice(0, 60).map((q, idx) => ({ ...q, id: idx + 1 }));
  return { meta: { set: 'mixed60', title: 'Mixed 60 (Randomized)', durationMinutes: 60 }, questions: picked };
}

window.NCSQuestions.loadMixed60 = loadMixed60;
