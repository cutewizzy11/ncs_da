#!/usr/bin/env python3
"""
PDF → JSON converter for NCS Practice Test sets.

Usage examples (PowerShell on Windows):
  # Create venv and install deps
  # python -m venv .venv
  # .venv\Scripts\Activate.ps1
  # pip install -r tools/pdf_to_json/requirements.txt

  # Convert a single PDF to questions/set2.json
  # python tools/pdf_to_json/convert.py --input "path/to/your.pdf" --out "questions/set2.json" --set-id set2 --title "Set 2" --duration 60

  # Convert multiple PDFs and merge
  # python tools/pdf_to_json/convert.py --input "a.pdf" "b.pdf" --out "questions/set3.json" --set-id set3 --title "Set 3"

  # Convert all PDFs in a folder (e.g., questions/Q_A)
  # python tools/pdf_to_json/convert.py --input-dir "questions/Q_A" --out "questions/set4.json" --set-id set4 --title "Set 4"

Notes:
- This is a heuristic parser. Please provide 1–2 sample PDFs so we can tune the regex rules to your exact layout (e.g., how options and answer keys are formatted).
- Expected output schema matches assets/js/questions.js loader.
"""

import argparse
import json
import re
from pathlib import Path
from typing import List, Dict, Any

try:
    import pdfplumber  # type: ignore
except Exception as e:
    raise SystemExit("pdfplumber is required. Install with: pip install -r tools/pdf_to_json/requirements.txt")

QUESTION_RE = re.compile(r"^\s*(\d{1,3})[\).\-]\s*(.+)")
OPTION_RE = re.compile(r"^\s*([A-Da-d])[\).]\s*(.+)")
ANSWER_INLINE_RE = re.compile(r"\b(?:ANS(?:WER)?)[\s:\-]*([A-Da-d])\b", re.IGNORECASE)
# Stricter section header detection: line must be just the subject text (optionally surrounded by punctuation/whitespace)
SECTION_HEADER_RE = re.compile(r"^\s*[\-–—]*\s*(MATHEMATICS|ENGLISH|CURRENT\s*AFFAIRS)\s*[\-–—]*\s*$", re.IGNORECASE)
ANSWER_KEY_LINE_RE = re.compile(r"^\s*(\d{1,3})\s*[:\-\.]\s*([A-Da-d])\s*$")

SUBJECT_NORMALIZE = {
    'MATHEMATICS': 'MATHEMATICS',
    'ENGLISH': 'ENGLISH',
    'CURRENT AFFAIRS': 'CURRENT AFFAIRS',
}


def extract_text_from_pdfs(paths: List[Path]) -> str:
    texts = []
    for p in paths:
        with pdfplumber.open(str(p)) as pdf:
            for page in pdf.pages:
                try:
                    texts.append(page.extract_text() or "")
                except Exception:
                    pass
    return "\n".join(texts)


def split_sections(lines: List[str]) -> List[Dict[str, Any]]:
    sections = []
    current = {"title": None, "lines": []}
    for ln in lines:
        m = SECTION_HEADER_RE.match(ln)
        if m:
            # start new section
            if current["lines"]:
                sections.append(current)
            title = m.group(1).upper().replace("  ", " ")
            title = title.replace("CURRENT AFFAIRS", "CURRENT AFFAIRS")
            current = {"title": SUBJECT_NORMALIZE.get(title, title), "lines": []}
        current["lines"].append(ln)
    if current["lines"]:
        sections.append(current)
    # If no explicit sections, return single
    return sections or [{"title": None, "lines": lines}]


def parse_questions_from_lines(lines: List[str]) -> List[Dict[str, Any]]:
    questions: List[Dict[str, Any]] = []
    q = None
    for ln in lines:
        # New question
        qm = QUESTION_RE.match(ln)
        if qm:
            # commit previous
            if q:
                questions.append(q)
            q = {"num": int(qm.group(1)), "text": qm.group(2).strip(), "options": {}, "answer_inline": None}
            continue

        # Option line
        if q:
            om = OPTION_RE.match(ln)
            if om:
                key = om.group(1).upper()
                val = om.group(2).strip()
                # If the option text contains an inline answer marker like 'ANS: C', capture and strip it
                am_opt = ANSWER_INLINE_RE.search(val)
                if am_opt:
                    q["answer_inline"] = am_opt.group(1).upper()
                    # strip the marker from the displayed option text
                    val = ANSWER_INLINE_RE.sub("", val).strip().rstrip('-:').strip()
                q["options"][key] = val
                # Also check the full line (some PDFs place ANS at end of line beyond captured text)
                am_line = ANSWER_INLINE_RE.search(ln)
                if am_line:
                    q["answer_inline"] = am_line.group(1).upper()
                continue

            # Answer inline on question text line continuation
            am2 = ANSWER_INLINE_RE.search(ln)
            if am2:
                q["answer_inline"] = am2.group(1).upper()
                continue

            # Otherwise, accumulate text continuation
            if ln.strip():
                # Append extra text to question if options not started yet
                if not q["options"]:
                    q["text"] += " " + ln.strip()

    if q:
        questions.append(q)
    return questions


def parse_answer_key(lines: List[str]) -> Dict[int, str]:
    """Parse a trailing Answer Key like: '1: C' on separate lines."""
    key: Dict[int, str] = {}
    for ln in lines:
        m = ANSWER_KEY_LINE_RE.match(ln)
        if m:
            key[int(m.group(1))] = m.group(2).upper()
    return key


def assemble_set(sections: List[Dict[str, Any]]):
    all_questions: List[Dict[str, Any]] = []
    issues: List[str] = []

    # Try to extract a global answer key (works if keys appear at end)
    global_key = parse_answer_key([ln for s in sections for ln in s["lines"]])

    for sec in sections:
        items = parse_questions_from_lines(sec["lines"])
        # Attach answers if present in inline or from global key. Note conflicts.
        for it in items:
            inline = it.get("answer_inline")
            key_ans = global_key.get(it.get("num")) if it.get("num") in global_key else None
            final_ans = inline or key_ans
            if inline and key_ans and inline != key_ans:
                issues.append(f"Conflict on Q{it['num']}: inline={inline} vs key={key_ans}")
        subject = sec["title"] or None
        for it in items:
            all_questions.append({
                "num": it["num"],
                "subject": subject,  # may be None for now
                "text": it["text"],
                "options": [
                    it["options"].get("A"),
                    it["options"].get("B"),
                    it["options"].get("C"),
                    it["options"].get("D"),
                ],
                "answer": final_ans,
            })

    # If no explicit subjects detected, assign by index ranges (1-20 Math, 21-40 English, 41-60 CA)
    if not any(q["subject"] for q in all_questions):
        for i, q in enumerate(sorted(all_questions, key=lambda x: x["num"])):
            if i < 20:
                q["subject"] = "MATHEMATICS"
            elif i < 40:
                q["subject"] = "ENGLISH"
            else:
                q["subject"] = "CURRENT AFFAIRS"

    # Convert letter answers to index 0..3 and default missing answers to None
    for q in all_questions:
        ans = q.get("answer")
        idx = None
        if isinstance(ans, str):
            map_idx = {"A": 0, "B": 1, "C": 2, "D": 3}
            idx = map_idx.get(ans)
        q["answer"] = idx

    # Filter out malformed questions (need text and 4 options)
    clean = []
    for q in all_questions:
        opts = [o for o in q["options"] if isinstance(o, str) and o.strip()]
        if q["text"] and len(opts) == 4:
            clean.append(q)
    clean_sorted = sorted(clean, key=lambda x: x["num"])  # keep numeric order

    # Extra validations
    nums = [q["num"] for q in clean_sorted]
    dups = {n for n in nums if nums.count(n) > 1}
    if dups:
      issues.append(f"Duplicate question numbers detected: {sorted(list(dups))}")
    missing_ans = [q["num"] for q in clean_sorted if q.get("answer") is None]
    if missing_ans:
      issues.append(f"Questions missing answers: {missing_ans[:10]}{'...' if len(missing_ans)>10 else ''}")

    return clean_sorted, issues


def main():
    ap = argparse.ArgumentParser(description="Convert NCS question PDFs to JSON.")
    ap.add_argument("--input", "-i", nargs="+", help="Input PDF file(s)")
    ap.add_argument("--input-dir", "-I", help="Folder containing PDF files (e.g., questions/Q_A)")
    ap.add_argument("--out", "-o", required=True, help="Output JSON path (e.g., questions/set2.json)")
    ap.add_argument("--set-id", default="setX", help="Set id, e.g., set2")
    ap.add_argument("--title", default="Set X", help="Set title")
    ap.add_argument("--duration", type=int, default=60, help="Duration in minutes")
    ap.add_argument("--report", help="Validation report path (defaults to <out>.report.txt)")
    args = ap.parse_args()

    in_paths: List[Path] = []
    if args.input:
        in_paths.extend(Path(p) for p in args.input)
    if args.input_dir:
        in_dir = Path(args.input_dir)
        if not in_dir.exists():
            raise SystemExit(f"Input directory does not exist: {in_dir}")
        in_paths.extend(sorted(in_dir.rglob("*.pdf")))
    if not in_paths:
        raise SystemExit("No input PDFs provided. Use --input files or --input-dir folder.")
    out_path = Path(args.out)

    text = extract_text_from_pdfs(in_paths)
    # Normalize whitespace and split into lines
    text = re.sub(r"\r\n?", "\n", text)
    lines = [ln.strip() for ln in text.split("\n") if ln.strip()]

    sections = split_sections(lines)
    questions, issues = assemble_set(sections)

    # Warn if not 60 questions found
    if len(questions) != 60:
        print(f"[warn] Extracted {len(questions)} questions (expected 60). This may be normal until rules are tuned for your PDF format.")

    data = {
        "meta": {
            "set": args.set_id,
            "title": args.title,
            "durationMinutes": args.duration,
        },
        "questions": [
            {
                "id": i + 1,
                "subject": q["subject"],
                "text": q["text"],
                "options": q["options"],
                "answer": q["answer"],
            }
            for i, q in enumerate(questions)
        ],
    }

    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Wrote {out_path} with {len(data['questions'])} questions.")

    # Write validation report
    report_path = Path(args.report) if args.report else Path(str(out_path) + ".report.txt")
    with report_path.open("w", encoding="utf-8") as rf:
        rf.write(f"Source PDFs: {[str(p) for p in in_paths]}\n")
        rf.write(f"Output JSON: {out_path}\n")
        rf.write(f"Total questions: {len(data['questions'])}\n")
        rf.write("Issues:\n")
        if issues:
            for it in issues:
                rf.write(f" - {it}\n")
        else:
            rf.write(" - None found\n")
    print(f"Report written to {report_path}")


if __name__ == "__main__":
    main()
