# Frequency-ranked Polish core vocabulary — audit

- Source: `nkjp-frekwencja.csv`, supplied by user; header `lemat,frekwencja`; 51,753 ranked rows.
- Ranking: preserve file order; exclude numeric/nonalphabetic lemmas (e.g. `1` at corpus rank 93); select first 100 alphabetic lemmas. Therefore item 100 is `stać`, at original corpus rank 101.
- Frequency means count in this specific corpus list, **not** universal modern Polish frequency.
- Previous curated list overlap: 52/100.
- New ranked lemmas with dictionary attestations: **99/100**.
- Unmatched lemma lookups: ['siebie'].
- All available dictionary forms and their raw morphological tags extracted directly from uploaded `polimorf-20261018.tab.gz`.
- These are raw morphological variants; they are **not automatically safe drill options**. Some words have several senses, grammatical roles or restricted variants.
- Polish proper noun `Polska` occurs lowercased as `polska` in frequency CSV; standard display should be `Polska`.
- `stać` combines multiple senses/aspects; this is a corpus lemma and requires sense disambiguation.
- English glosses are hand-authored teaching drafts and need review.
- The 112 existing case exercises are retained but were authored against the **old curated vocabulary** and are not all guaranteed to use the new core lemmas.

## Work remaining before claiming complete verified teaching content
1. Curate 100 raw morphological dictionaries into sensible, grammatical and contextualised teaching paradigms, especially particles, pronouns, numerals and aspectual verbs.
2. Generate or adapt exercises covering the new 100 core lemmas; audit contextual form explanations.
3. Independent linguistic review for educational accuracy (not performed here).

## User input
**None required to proceed with internal data curation.** If independent native-speaker sign-off is a strict release requirement, a reviewer must be supplied or commissioned; it cannot be honestly claimed from automated dictionary checks.
