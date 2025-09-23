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
