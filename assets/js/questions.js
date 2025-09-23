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

  // target sizes
  const target = { 'MATHEMATICS': 20, 'ENGLISH': 20, 'CURRENT AFFAIRS': 20 };

  // First, take up to target from each labeled bucket
  const picked = { 'MATHEMATICS': [], 'ENGLISH': [], 'CURRENT AFFAIRS': [] };
  for (const k of Object.keys(picked)) {
    picked[k] = buckets[k].slice(0, target[k]);
  }

  // Fill deficits from UNASSIGNED first
  for (const k of Object.keys(picked)) {
    const need = target[k] - picked[k].length;
    if (need > 0) {
      picked[k].push(...buckets['UNASSIGNED'].splice(0, need));
    }
  }

  // If still deficits, borrow from other subjects' overflow
  for (const k of Object.keys(picked)) {
    let need = target[k] - picked[k].length;
    if (need <= 0) continue;
    for (const donor of Object.keys(picked)) {
      if (donor === k) continue;
      const overflow = buckets[donor].slice(target[donor]);
      if (overflow.length) {
        const take = overflow.splice(0, need);
        picked[k].push(...take);
        need = target[k] - picked[k].length;
        if (need <= 0) break;
      }
    }
  }

  // Combine in subject order and ensure 60 length
  let combined = [...picked['MATHEMATICS'], ...picked['ENGLISH'], ...picked['CURRENT AFFAIRS']];
  if (combined.length > 60) combined = combined.slice(0, 60);
  if (combined.length < 60) {
    // pad from any remaining pools
    const rest = [
      ...buckets['MATHEMATICS'].slice(picked['MATHEMATICS'].length),
      ...buckets['ENGLISH'].slice(picked['ENGLISH'].length),
      ...buckets['CURRENT AFFAIRS'].slice(picked['CURRENT AFFAIRS'].length),
      ...buckets['UNASSIGNED']
    ];
    combined.push(...rest.slice(0, 60 - combined.length));
  }

  // Renumber ids sequentially
  combined = combined.slice(0, 60).map((q, idx) => ({ ...q, id: idx + 1 }));
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
