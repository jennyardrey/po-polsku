# Polish Drills

Personal, offline-first Polish learning app built with React, TypeScript, and Vite. No account, backend, generated quiz content, or API is used. The production service worker caches the app shell and bundled assets after the first online visit. Progress is saved in browser localStorage.

Requires Node.js 20.19+ or 22.12+ (Node 24 also works).

## Commands

```sh
npm ci
npm run dev
npm run lint
npm run typecheck
npm test
python3 validate_data.py
npm run build
npm run preview
```

`dist/` is the deployable static build. `python3 verify_noun_content.py` is an optional source audit when the original `polimorf-20261018.tab.gz` archive is available locally; it checks new noun examples and distractors against dictionary tags. The archive is excluded from the repository, and the app, tests and build do not need it.

## Deployment

Deploy this as a **static Vite site**. Use `npm ci` to install, `npm run build` to build, and `dist` as the publish directory. The app has no backend or runtime environment variables. The committed `package-lock.json` gives the host the same dependency versions used locally. Use HTTPS for the offline service worker; local development also works on localhost.

`npm run preview` serves the built site locally so you can inspect the production files before deployment. It does not start the development server.

For a site at the domain root, the default build works. For a site under a path such as `/polish-learning/`, set `VITE_BASE_PATH=/polish-learning/` during the build. The path must begin and end with `/`. The app and its offline worker then use that path for their assets and cache. Set the build-time variable in your hosting provider's settings, or run `VITE_BASE_PATH=/polish-learning/ npm run build` locally.

`node_modules`, `dist`, local environment files, the large source archives, the original frequency CSV, and the handoff ZIP are ignored. The derived JSON needed by the app is included. See [THIRD_PARTY_NOTICES.md](public/THIRD_PARTY_NOTICES.md) for data attribution; the notice is included in the deployed site. This project does not declare a licence for its own application code.

## Structure

- `src/data.ts`: typed dataset access, source validation, target blanking, and dictionary label formatting.
- `src/progress.ts`: versioned local records, scheduling, and validated JSON backup and restore.
- `src/App.tsx`: Cases, Vocabulary, Weak Spots, and About views.
- `src/CaseEndingLesson.tsx` and `src/EndingPractice.tsx`: case ending lessons and multiple choice ending drills.
- `noun-endings.json`, `ending-drills.json`, `case-feedback.json`: structured noun patterns, curated exercises, and case-specific feedback improvements.
- Root JSON files: supplied learning data. The app consumes the ranked core 100, seven case intros, 112 authored exercises, 10 verb tables, and special reflexive forms. The supplementary curated 100 is intentionally separate.

Case form cards show the full English translation, base lemma and gloss, and the target case before entry. `case-lemma-glosses.json` contains 42 glosses derived from authored translations for lemmas absent from both vocabulary lists, plus seven glosses copied from the supplied supplementary list. This avoids bundling that entire supplementary file. Answers use the authored accepted answer list with case and surrounding whitespace normalized. Case identification reuses the authored sentences. Vocabulary practice uses lemma ↔ meaning flashcards; learners grade their own recall. Reverse cards show the core rank and part of speech to identify an entry when English glosses overlap. The reverse prompt for `polska` omits a source gloss note that spells out the Polish lemma. Raw dictionary variants are reference only and never automatically turned into context drills.

Cases Learn now covers singular and plural patterns, stem changes, exceptions and side-by-side noun comparisons in each case. Cases Practice adds 28 curated ending drills, four per case, with four dictionary-attested options and explicit answer feedback. The original 112 sentence questions retain their authored case explanations, with targeted overrides where the case trigger or noun ending needed clearer detail. Due ending drills also appear in Weak Spots.

In 19 authored fill exercises (13 nominative and six accusative), the required base lemma is itself the correct surface form. Showing the required lemma therefore makes those items recognition checks rather than inflection recall. The app keeps all 112 authored questions and does not invent alternative sentences or forms. The exercise explanations have no independent native speaker review.

## Sources and limits

The ranked list uses the first 100 alphabetic lemmas in the supplied NKJP frequency CSV from KubaCiolo/leksjo-dane; ranks and counts apply to that file. Forms come from the user supplied PoliMorf dictionary. The verb tables are dictionary derived, and compound future is not fully enumerated. English glosses are educational drafts. The 112 authored case questions have dictionary case tag matches but no independent native speaker review. Dictionary attestation does not establish natural usage in a sentence. See About / Data Sources in the app for user facing details. Consult the PoliMorf licence before redistributing the dictionary source.

The noun pattern notes were cross-checked with [Polski.info's noun grammar](https://polski.info/grammar/nouns?hl=en); the specific new forms and options were validated against the supplied PoliMorf tags. These notes are beginner-focused descriptions of common patterns, not universal rules or native-speaker-certified usage.
