import casesJson from '../cases.json';
import questionsJson from '../practice-questions.json';
import wordsJson from '../core-vocabulary-100.json';
import verbsJson from '../verb-teaching-tables.json';
import specialJson from '../special-forms.json';
import caseGlossesJson from '../case-lemma-glosses.json';
import nounEndingsJson from '../noun-endings.json';
import endingDrillsJson from '../ending-drills.json';
import caseFeedbackJson from '../case-feedback.json';

export type CaseId = 'nominative' | 'genitive' | 'dative' | 'accusative' | 'instrumental' | 'locative' | 'vocative';
export type CaseInfo = { id: CaseId; namePl: string; plainEnglishQuestion: string; uses: string; example: { polish: string; english: string; target: string; why: string }; caution: string };
export type Question = { id: string; case: CaseId; polish: string; english: string; lemma: string; target: string; targetSpan: { start: number; end: number }; acceptedAnswers: string[]; whyCase: string; whyForm: string };
export type Word = { rank: number; corpusRank: number; lemma: string; frequency: number; partOfSpeech: string; meaning: string; partOfSpeechNote: string | null; dictionaryParadigm: Record<string, string[]>; dictionaryAttested: boolean };
export type Verb = { lemma: string; aspect: string[]; simpleFinite: Record<string,string[]>; futureByc: Record<string,string[]>; pastByGenderNumberPerson: Record<string,string[]>; conditionalByGenderNumberPerson: Record<string,string[]>; imperative: Record<string,string[]>; compoundFutureNote: string };
export type Special = { lemma: string; nominative: string[] | null; genitive: string[] | null; dative: string[] | null; accusative: string[] | null; instrumental: string[] | null; locative: string[] | null; vocative: string[] | null; note: string };
export type NounComparison = { lemma: string; form: string; number: 'singular' | 'plural'; note: string };
export type NounEndingLesson = { summary: string; singular: string[]; plural: string[]; stem: string; remember: string; comparisons: NounComparison[] };
export type EndingDrill = { id: string; case: CaseId; number: 'singular' | 'plural'; lemma: string; answer: string; options: string[]; explanation: string };
type FeedbackOverride = { whyCase?: string; whyEnding?: string };
export const cases = casesJson as CaseInfo[];
export const questions = questionsJson as Question[];
export const words = wordsJson as unknown as Word[];
export const verbs = verbsJson as Verb[];
export const special = specialJson as Record<string, Special>;
export const nounEndings = nounEndingsJson as Record<CaseId, NounEndingLesson>;
export const endingDrills = endingDrillsJson as EndingDrill[];
const caseFeedback = caseFeedbackJson as Record<string, FeedbackOverride>;
export const caseName = (id: CaseId) => cases.find(c => c.id === id)?.namePl ?? id;
export const caseExplanation = (question: Question) => caseFeedback[question.id]?.whyCase ?? question.whyCase;
export const endingExplanation = (question: Question) => caseFeedback[question.id]?.whyEnding ?? question.whyForm;
const pluralQuestionIds = new Set(['nominative-10','nominative-12','nominative-15','accusative-09','vocative-15']);
export const questionNumber = (question: Question): 'singular' | 'plural' => pluralQuestionIds.has(question.id) ? 'plural' : 'singular';
export function caseContrasts(caseId: CaseId, number: 'singular' | 'plural', excludeLemma: string, limit = 3): NounComparison[] {
  return nounEndings[caseId].comparisons.filter(example => example.number === number && example.lemma !== excludeLemma).slice(0, limit);
}
const caseGlosses = caseGlossesJson as Record<string, string>;
const suppliedGlosses = new Map<string,string>(words.map(word => [word.lemma, word.meaning]));
export const lemmaMeaning = (lemma: string): string | undefined => suppliedGlosses.get(lemma) ?? caseGlosses[lemma];
// The source gloss for polska includes the Polish headword as a note.
// Keep that note in Learn, but omit it from reverse flashcard prompts.
export const practiceMeaning = (word: Word): string => word.lemma === 'polska' ? 'Poland' : word.meaning;

export function validateData(): string[] {
  const errors: string[] = [];
  if (words.length !== 100 || words.some((w, i) => w.rank !== i + 1 || !w.lemma || !w.meaning || !Number.isFinite(w.frequency))) errors.push('Vocabulary ranks or entries invalid');
  if (new Set(words.map(w => w.lemma)).size !== 100) errors.push('Duplicate vocabulary lemma');
  if (cases.length !== 7 || new Set(cases.map(c => c.id)).size !== 7) errors.push('Cases invalid');
  if (questions.length !== 112 || new Set(questions.map(q => q.id)).size !== 112) errors.push('Question count or IDs invalid');
  for (const q of questions) {
    if (!cases.some(c => c.id === q.case) || normalizeAnswer(q.polish.slice(q.targetSpan.start, q.targetSpan.end)) !== normalizeAnswer(q.target) || !q.acceptedAnswers.length || !q.whyCase || !q.whyForm || !q.english.trim() || !lemmaMeaning(q.lemma)?.trim()) errors.push(`Invalid question ${q.id}`);
  }
  if (verbs.length !== 10) errors.push('Verb table count invalid');
  if (endingDrills.length !== 28 || new Set(endingDrills.map(d => d.id)).size !== endingDrills.length) errors.push('Ending drill count or IDs invalid');
  for (const c of cases) {
    const lesson = nounEndings[c.id];
    if (!lesson || !lesson.summary || !lesson.singular.length || !lesson.plural.length || !lesson.stem || !lesson.remember || lesson.comparisons.length < 4) errors.push(`Missing ending lesson ${c.id}`);
  }
  for (const drill of endingDrills) {
    if (!cases.some(c => c.id === drill.case) || !lemmaMeaning(drill.lemma) || drill.options.length !== 4 || new Set(drill.options).size !== 4 || !drill.options.includes(drill.answer) || !drill.explanation.trim()) errors.push(`Invalid ending drill ${drill.id}`);
  }
  for (const [id, feedback] of Object.entries(caseFeedback)) {
    if (!questions.some(q => q.id === id) || (feedback.whyCase !== undefined && !feedback.whyCase.trim()) || (feedback.whyEnding !== undefined && !feedback.whyEnding.trim())) errors.push(`Invalid feedback override ${id}`);
  }
  return errors;
}

export function blankTarget(q: Question): { before: string; after: string } {
  return { before: q.polish.slice(0, q.targetSpan.start), after: q.polish.slice(q.targetSpan.end) };
}
export const normalizeAnswer = (value: string) => value.trim().toLocaleLowerCase('pl-PL');
export const acceptsAnswer = (value: string, answers: string[]) => answers.some(answer => normalizeAnswer(value) === normalizeAnswer(answer));

const grammar: Record<string, string> = { nom:'nominative', gen:'genitive', dat:'dative', acc:'accusative', inst:'instrumental', loc:'locative', voc:'vocative', sg:'singular', pl:'plural', m1:'masculine personal', m2:'masculine animate', m3:'masculine inanimate', f:'feminine', n:'neuter', pri:'first person', sec:'second person', ter:'third person', nwok:'standard variant', wok:'alternate variant', imperf:'imperfective', perf:'perfective', aff:'affirmative', neg:'negative' };
const categories: Record<string,string> = { subst:'Noun', adj:'Adjective', ppron3:'Third-person pronoun', ppron12:'First/second-person pronoun', num:'Numeral', prep:'Preposition', adv:'Adverb', conj:'Conjunction', part:'Particle', interj:'Interjection', inf:'Infinitive', fin:'Finite verb', praet:'Past form', cond:'Conditional', impt:'Imperative', bedzie:'Future form', ger:'Verbal noun', pact:'Active participle', ppas:'Passive participle', pcon:'Simultaneous participle', pant:'Anterior participle', pred:'Predicative', comp:'Comparative', adja:'Adjective variant', adjp:'Adjective variant', brev:'Abbreviation', frag:'Fragment', depr:'Depreciative plural', imps:'Impersonal form', aglt:'Personal ending', numcomp:'Compound numeral', pacta:'Participle variant' };
export function readableTag(tag: string): string {
  const [category, ...labels] = tag.split(':');
  return [categories[category], ...labels.map(label => label.split('.').map(part => grammar[part] ?? '').filter(Boolean).join(' / ')).filter(Boolean)].filter(Boolean).join(' · ');
}
export function referenceGroups(word: Word): { label: string; rows: { label: string; forms: string[] }[] }[] {
  if (word.lemma === 'siebie') {
    const entry = special.siebie;
    return [{ label: 'Reflexive pronoun', rows: (['genitive','dative','accusative','instrumental','locative'] as const).map(key => ({ label: key, forms: entry[key] ?? [] })) }];
  }
  if (word.partOfSpeech === 'verb') return [];
  const grouped = new Map<string, { label:string; forms:string[] }[]>();
  for (const [tag, forms] of Object.entries(word.dictionaryParadigm)) {
    if (!forms.length || !forms.some(Boolean)) continue;
    const category = tag.split(':')[0];
    // Keep inflected reference groups relevant to the entry's ordinary role.
    const allowed = word.partOfSpeech === 'preposition' ? ['prep'] : word.partOfSpeech === 'noun' ? ['subst'] : word.partOfSpeech === 'pronoun' ? ['ppron3','ppron12'] : word.partOfSpeech === 'adjective/determiner/numeral' ? ['adj','num'] : [word.partOfSpeech === 'adverb' ? 'adv' : word.partOfSpeech === 'conjunction' ? 'conj' : 'part'];
    if (!allowed.includes(category)) continue;
    const label = categories[category] ?? 'Forms';
    grouped.set(label, [...(grouped.get(label) ?? []), { label: readableTag(tag).replace(`${label} · `,''), forms }]);
  }
  return [...grouped].map(([label,rows]) => ({label,rows}));
}
export function verbRows(group: Record<string,string[]>): { label: string; forms:string[] }[] {
  const personNumber: Record<string,string> = { '1sg':'first person singular', '2sg':'second person singular', '3sg':'third person singular', '1pl':'first person plural', '2pl':'second person plural', '3pl':'third person plural' };
  return Object.entries(group).filter(([, forms]) => forms.length > 0).map(([tag,forms]) => ({ label: tag.split(':').map(p => personNumber[p] ?? p.split('.').map(x => grammar[x] ?? x).join(' / ')).join(' · '), forms }));
}
