import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { caseContrasts, caseName, lemmaMeaning } from './data';
import type { EndingDrill } from './data';

export default function EndingPractice({drill,position,total,onAttempt,onNext}:{drill:EndingDrill;position:number;total:number;onAttempt:(correct:boolean)=>void;onNext:()=>void}) {
  const [answer,setAnswer]=useState('');
  const [result,setResult]=useState<boolean|null>(null);
  const feedbackRef=useRef<HTMLDivElement>(null);
  const optionRef=useRef<HTMLInputElement>(null);
  const offset=position%drill.options.length;
  const options=[...drill.options.slice(offset),...drill.options.slice(0,offset)];
  const contrasts=caseContrasts(drill.case,drill.number,drill.lemma);
  function submit(e:FormEvent) {
    e.preventDefault();
    if (!answer || result!==null) return;
    const correct=answer===drill.answer;
    setResult(correct);
    onAttempt(correct);
    window.setTimeout(()=>feedbackRef.current?.focus(),0);
  }
  function retry() { setAnswer('');setResult(null);window.setTimeout(()=>optionRef.current?.focus(),0); }
  return <>
    <div className="exercise-meta"><span className="tag">{caseName(drill.case)} · {drill.case}</span><span>{position} / {total}</span></div>
    <h2>{caseName(drill.case)} {drill.number}: choose the form</h2>
    <p className="ending-prompt">Which {drill.case} {drill.number} form of <strong lang="pl">{drill.lemma}</strong> <span>({lemmaMeaning(drill.lemma)})</span> fits?</p>
    <form onSubmit={submit}><fieldset className="ending-options"><legend>Choose one form</legend>{options.map((option,index)=><label key={option}><input ref={index===0?optionRef:undefined} type="radio" name="ending-option" value={option} checked={answer===option} onChange={()=>setAnswer(option)} disabled={result!==null}/><span lang="pl">{option}</span></label>)}</fieldset><button className="primary" disabled={!answer||result!==null}>Check answer</button></form>
    {result!==null&&<div className={`feedback ${result?'correct':'incorrect'}`} tabIndex={-1} ref={feedbackRef} aria-live="polite"><strong>{result?'Correct':'Review the ending'}</strong><p><b>Correct form:</b> <span lang="pl">{drill.answer}</span></p><p><b>Why this ending?</b> {drill.explanation}</p>{contrasts.length>0&&<div className="ending-contrasts"><strong>Compare in {drill.case} {drill.number}</strong><ul>{contrasts.map(example=><li key={`${example.lemma}-${example.form}`}><span lang="pl">{example.lemma} → {example.form}</span> <small>({example.note})</small></li>)}</ul></div>}<div className="actions"><button className="primary" onClick={onNext}>Next pattern</button><button className="secondary" onClick={retry}>Retry</button></div></div>}
  </>;
}
