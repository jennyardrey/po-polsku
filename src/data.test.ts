import { describe, expect, it } from 'vitest';
import { acceptsAnswer, blankTarget, caseContrasts, caseExplanation, cases, endingDrills, endingExplanation, lemmaMeaning, normalizeAnswer, nounEndings, practiceMeaning, questions, referenceGroups, validateData, words } from './data';
describe('supplied data', () => {
  it('preserves all structural invariants', () => { expect(validateData()).toEqual([]); expect(cases).toHaveLength(7); expect(words).toHaveLength(100); expect(questions).toHaveLength(112); });
  it('blanks exactly the authored target in every question', () => { for (const q of questions) { const {before,after}=blankTarget(q); expect(before+q.polish.slice(q.targetSpan.start,q.targetSpan.end)+after).toBe(q.polish); expect(normalizeAnswer(q.target)).toBe(normalizeAnswer(q.polish.slice(q.targetSpan.start,q.targetSpan.end))); } });
  it('accepts listed answers with case and surrounding whitespace normalized', () => { expect(normalizeAnswer('  KOT  ')).toBe('kot'); for(const q of questions) expect(acceptsAnswer(` ${q.acceptedAnswers[0].toLocaleUpperCase('pl-PL')} `,q.acceptedAnswers)).toBe(true); expect(acceptsAnswer('not an answer',['kot'])).toBe(false); });
  it('shows reflexive forms without invented nominative', () => { const word=words.find(w=>w.lemma==='siebie')!; const rows=referenceGroups(word)[0].rows; expect(rows.some(r=>r.label==='nominative')).toBe(false); expect(rows.find(r=>r.label==='dative')?.forms).toEqual(['sobie']); });
  it('has a usable lemma gloss, translation, case and two explanations for all 112 exercises', () => {
    for (const q of questions) {
      expect(lemmaMeaning(q.lemma),q.id).toBeTruthy();
      expect(q.english.trim(),q.id).not.toBe('');
      expect(cases.some(c=>c.id===q.case),q.id).toBe(true);
      expect(q.whyCase.trim(),q.id).not.toBe('');
      expect(q.whyForm.trim(),q.id).not.toBe('');
      expect(q.acceptedAnswers.length,q.id).toBeGreaterThan(0);
      const clues=`${q.english} ${q.lemma} ${lemmaMeaning(q.lemma)} ${q.case}`;
      if (normalizeAnswer(q.lemma)!==normalizeAnswer(q.target)) {
        const clueWords=clues.toLocaleLowerCase('pl-PL').split(/[^\p{L}]+/u);
        expect(clueWords,q.id).not.toContain(normalizeAnswer(q.target));
      }
    }
  });
  it('keeps reverse vocabulary clues distinct and removes the Polish answer from the Poland gloss',()=>{
    expect(new Set(words.map(w=>w.rank)).size).toBe(100);
    expect(practiceMeaning(words.find(w=>w.lemma==='polska')!)).toBe('Poland');
  });
  it('provides structured singular, plural, stem, exception and comparison teaching for each case',()=>{
    for(const c of cases){const lesson=nounEndings[c.id];expect(lesson.summary).toBeTruthy();expect(lesson.singular.length).toBeGreaterThan(0);expect(lesson.plural.length).toBeGreaterThan(0);expect(lesson.stem).toBeTruthy();expect(lesson.remember).toBeTruthy();expect(lesson.comparisons.some(x=>x.number==='singular')).toBe(true);expect(lesson.comparisons.some(x=>x.number==='plural')).toBe(true);}
    expect(nounEndings.genitive.comparisons.filter(x=>x.number==='singular').map(x=>x.form)).toEqual(expect.arrayContaining(['kota','szkoły','książki','czasu']));
    expect(caseContrasts('genitive','singular','kot').map(x=>x.form)).toEqual(['szkoły','książki','czasu']);
  });
  it('has four distinct options and one curated explanation for every ending drill',()=>{
    expect(endingDrills).toHaveLength(28);
    for(const drill of endingDrills){expect(drill.options).toHaveLength(4);expect(new Set(drill.options).size).toBe(4);expect(drill.options).toContain(drill.answer);expect(drill.explanation.length).toBeGreaterThan(60);expect(lemmaMeaning(drill.lemma)).toBeTruthy();}
    expect(new Set(endingDrills.map(x=>x.case)).size).toBe(7);
  });
  it('replaces vague authored explanations with specific case and ending guidance',()=>{
    const negated=questions.find(x=>x.id==='genitive-11')!;
    expect(caseExplanation(negated)).toContain('accusative');
    expect(caseExplanation(negated)).toContain('Nie');
    expect(endingExplanation(negated)).toContain('movable vowel');
    const chleb=questions.find(x=>x.id==='genitive-15')!;
    expect(endingExplanation(chleb)).toContain('lexically');
  });
});
