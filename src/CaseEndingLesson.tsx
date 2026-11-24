import { nounEndings } from './data';
import type { CaseId } from './data';

export default function CaseEndingLesson({ caseId }: { caseId: CaseId }) {
  const lesson = nounEndings[caseId];
  return <details className="case-endings">
    <summary>How noun forms change</summary>
    <div className="case-endings-body">
      <p>{lesson.summary}</p>
      <h3>Singular patterns</h3>
      {lesson.singular.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      <h3>Plural patterns</h3>
      {lesson.plural.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      <h3>Stem and spelling changes</h3><p>{lesson.stem}</p>
      <h3>Learn these forms</h3><p>{lesson.remember}</p>
      <h3>Compare nouns in this case</h3>
      <div className="ending-comparison" role="table" aria-label={`${caseId} noun comparisons`}>
        <div className="comparison-row comparison-head" role="row"><span role="columnheader">Base noun</span><span role="columnheader">Form</span><span role="columnheader">Pattern</span></div>
        {lesson.comparisons.map((example, index) => <div className="comparison-row" role="row" key={`${example.lemma}-${example.number}-${index}`}><span role="cell" lang="pl">{example.lemma}</span><strong role="cell" lang="pl">{example.form}</strong><span role="cell">{example.number} · {example.note}</span></div>)}
      </div>
      <p className="muted">Examples are dictionary attested. The pattern notes describe common forms, not rules for every noun.</p>
    </div>
  </details>;
}
