# Polish Drills — ready-to-build Codex handoff

**Next user action:** extract this ZIP into a new project folder, open Codex in that folder, and tell it: **"Read CODEX_PROMPT.md and implement the project fully. Run tests and build before finishing."**

This package includes all content necessary to build the scoped app **without additional uploads**. It does not claim native-speaker-certified content. The 100 words are ranked within the supplied NKJP CSV; all case questions are authored; 10 verb dictionaries are extracted and organized. The app should present raw forms as reference, and practice only authored unambiguous answers.

Run `python3 validate_data.py` to verify structural invariants. The build must not depend on the original 46 MB dictionary archive.

## Source attribution
- NKJP frequency list: `nkjp-frekwencja.csv` from `KubaCiolo/leksjo-dane`, supplied by user.
- PoliMorf dictionary: `polimorf-20261018.tab.gz`, supplied by user; consult its licence before redistribution.

## Known limitations (not blockers for a personal app)
- No independent native-speaker review.
- Dictionary tags are not proof that a form is natural in every sentence.
- Compound future and context-sensitive pronoun forms require careful treatment.
- English glosses are draft educational glosses, not an authoritative bilingual lexicon.

**No further action from the user is required before starting Codex.**
