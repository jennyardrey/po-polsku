# Codex task: build Polish Drills from this package

Implement the complete **personal, offline-first Polish learning web app** using React + TypeScript + Vite. Work independently to completion, run tests, fix errors, and report actual results. This package contains the dataset and the implementation contract; do not stop for a planning approval unless you encounter a genuine blocker.

## Product
Two top-level sections: **Cases** and **Vocabulary**. Each has **Learn** and **Practice**. A third **Weak Spots** view lists overdue/incorrect forms and questions. Responsive and accessible, clean practical UI. No accounts, backend, LLM, audio, API, or paid dependencies. Persist progress in localStorage, with JSON export/import and schema versioning.

## Supplied data
- `core-vocabulary-100.json`: exactly 100 ranked NKJP lemmas; rank, frequency, English gloss and raw dictionary paradigms.
- `cases.json`: introductions to seven cases.
- `practice-questions.json`: 112 sentence-level fill-form questions, with exact target spans, accepted answers and two explanations per question.
- `verb-teaching-tables.json`: 10 verb dictionary tables, grouped by tense/mood/person/gender.
- `special-forms.json`: explicit reflexive-pronoun treatment for *siebie*.
- `supplementary-curated-100.json`: **supplementary**, NOT the corpus top 100.

## Implementation requirements
1. **Cases > Learn:** list all 7 cases; show their purpose, recognition cues, examples, and explanation. Include practical governance/ending notes where supported; don't invent grammatical rules.
2. **Cases > Practice:** 112 authored questions. Use `targetSpan` to blank the correct word. Answer against `acceptedAnswers`, ignoring case and surrounding whitespace. After submission show Polish sentence, English translation, base lemma, the reason for the case and the reason for the form. Offer next, retry and per-case filters. Add a case-identification mode using the same questions; ask which case the highlighted target uses, with seven possible cases and explanation.
3. **Vocabulary > Learn:** rank-ordered 100 words, English gloss, POS, frequency, search/filter, detailed word view. Show inflection forms grouped by morphological labels. Render only meaningful/valid groups; **do not display dictionary tags as unexplained learner-facing jargon**. For verbs show person/number and past-gender labels, imperative, conditional and future where supported. For indeclinables explain invariability. For prepositions show governance when explicitly available. For reflexive *siebie* use `special-forms.json`.
4. **Vocabulary > Practice:** lemma↔meaning flashcards for all 100; and form recognition for **explicitly unambiguous dictionary-tagged pairs only**. Avoid inferring sentence-specific correctness from raw dictionary variants; no automatic cloze generation from dictionary forms. Provide an explicit curated `vocabulary-practice.json` for additional form exercises if you can validate each answer, otherwise restrict vocabulary practice to lemma/meaning and label the advanced mode not available. This is a safety constraint, not a request to invent content.
5. **Weak Spots:** track attempts, correct/incorrect, last seen, due time and streak per stable question ID or vocabulary lemma. Simple spaced repetition (e.g. wrong due immediately, correct after 1/3/7/14 days). Prioritize overdue/incorrect. Allow reset, JSON backup/restore with validation.
6. **UX:** keyboard entry, accessible labels, focus management, progress indicator, mobile-friendly layouts, no noisy gamification. Provide clear distinction between 'dictionary-attested' and 'usage-reviewed' forms; avoid implying expert review.
7. **Tests:** unit tests for data validation, target-span blanking, accepted-answer normalization, progress scheduling, export/import and a React Testing Library flow for each section. Run lint, typecheck, tests and production build.

## Source and accuracy constraints
- The list is **top 100 from the supplied NKJP frequency CSV**, not a universal ranking across all corpora.
- Raw dictionary forms may be archaic, uncommon, stylistically marked, or context-dependent. Do not generate random quizzes from them.
- `verb-teaching-tables.json` is a **dictionary-derived reference**, not a guarantee that every variant is beginner-appropriate. Polish imperfective future can be compound; do not claim these tables cover every periphrastic construction.
- The 112 exercises have dictionary case-tag matches but have **not** had independent native-speaker review.
- Source attribution and limitations must appear in an About/Data Sources view, not clutter every practice card.

## Deliverables
Working Vite app, README with commands and architecture, tests, source attribution, sample screenshot if practical. Finish by running all checks and give a concise summary of what passes and any actual blockers. Don't ask for approval between implementation stages.
