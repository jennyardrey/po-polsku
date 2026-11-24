import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { caseExplanation, caseName, endingExplanation, lemmaMeaning, questions } from './data';
beforeEach(()=>{localStorage.clear();vi.stubGlobal('scrollTo',vi.fn());});
describe('app flows',()=>{
  it('learns cases and answers a form and identification question',async()=>{ const user=userEvent.setup();render(<App/>);expect(screen.getByText('Mianownik')).toBeInTheDocument();await user.click(screen.getByRole('button',{name:'Practice Mianownik →'}));await user.type(screen.getByLabelText('Polish form'),' KOT ');await user.click(screen.getByRole('button',{name:'Check answer'}));expect(screen.getByText('Correct')).toBeInTheDocument();expect(screen.getByText(/Base lemma:/)).toBeInTheDocument();await user.click(screen.getByLabelText('Identify the case'));await user.selectOptions(screen.getByLabelText('Choose a case'),'nominative');await user.click(screen.getByRole('button',{name:'Check answer'}));expect(screen.getByText('Correct')).toBeInTheDocument();});
  it('searches vocabulary, views forms, and grades a flashcard',async()=>{ const user=userEvent.setup();render(<App/>);await user.click(within(screen.getByRole('navigation',{name:'Main navigation'})).getByRole('button',{name:'Vocabulary'}));await user.type(screen.getByLabelText('Search words or meanings'),'siebie');await user.click(screen.getByRole('button',{name:/siebie/}));expect(screen.getByText('Reflexive pronoun')).toBeInTheDocument();await user.click(screen.getByRole('button',{name:'Practice'}));expect(screen.getByText('Meaning flashcard')).toBeInTheDocument();await user.click(screen.getByRole('button',{name:'Reveal answer'}));await user.click(screen.getByRole('button',{name:'Review again'}));expect(screen.getByText('2 / 100')).toBeInTheDocument();});
  it('lists weak spots and offers data controls',async()=>{ const user=userEvent.setup();render(<App/>);await user.click(screen.getByRole('button',{name:'Practice'}));await user.type(screen.getByLabelText('Polish form'),'wrong');await user.click(screen.getByRole('button',{name:'Check answer'}));await user.click(screen.getByRole('button',{name:'Weak Spots'}));expect(screen.getByText('Due & incorrect')).toBeInTheDocument();expect(screen.getByText(/1 incorrect/)).toBeInTheDocument();const data=screen.getByText('Progress data').parentElement!;expect(within(data).getByRole('button',{name:'Export JSON backup'})).toBeInTheDocument();});
  it('shows source and review limitations',async()=>{const user=userEvent.setup();render(<App/>);await user.click(screen.getByRole('button',{name:'About / Data Sources'}));expect(screen.getByText(/NKJP frequency CSV/)).toBeInTheDocument();expect(screen.getByText(/independent native speaker review/)).toBeInTheDocument();});
  it('shows complete clues and grammatical feedback for every authored fill exercise',()=>{
    render(<App/>);
    fireEvent.click(screen.getByRole('button',{name:'Practice'}));
    for (const [index,q] of questions.entries()) {
      const clues=screen.getByLabelText('Exercise clues');
      expect(within(clues).getByText(q.english),q.id).toBeInTheDocument();
      expect(within(clues).getByText(q.lemma),q.id).toBeInTheDocument();
      expect(clues.textContent,q.id).toContain(lemmaMeaning(q.lemma));
      expect(within(clues).getByText(`${caseName(q.case)} · ${q.case}`),q.id).toBeInTheDocument();
      expect(screen.queryByText('Correct form:'),q.id).not.toBeInTheDocument();
      fireEvent.change(screen.getByLabelText('Polish form'),{target:{value:q.acceptedAnswers[0]}});
      fireEvent.click(screen.getByRole('button',{name:'Check answer'}));
      expect(screen.getByText('Correct'),q.id).toBeInTheDocument();
      expect(screen.getByText('Correct form:').parentElement?.textContent,q.id).toContain(q.acceptedAnswers[0]);
      expect(screen.getByText('Why this case?').parentElement?.textContent,q.id).toContain(caseExplanation(q));
      expect(screen.getByText('Why this ending?').parentElement?.textContent,q.id).toContain(endingExplanation(q));
      if(index<questions.length-1) fireEvent.click(screen.getByRole('button',{name:'Next question'}));
    }
  },20000);
  it('disambiguates reverse vocabulary recall without revealing the Polish lemma',async()=>{
    const user=userEvent.setup();render(<App/>);
    fireEvent.click(within(screen.getByRole('navigation',{name:'Main navigation'})).getByRole('button',{name:'Vocabulary'}));
    fireEvent.change(screen.getByLabelText('Search words or meanings'),{target:{value:'polska'}});
    fireEvent.click(screen.getByRole('button',{name:/polska/i}));
    fireEvent.click(screen.getByRole('button',{name:'Practice meaning →'}));
    fireEvent.click(screen.getByLabelText('English → Polish'));
    expect(screen.getByText('Poland')).toBeInTheDocument();
    expect(screen.getByText('Core list rank 78 · noun')).toBeInTheDocument();
    expect(screen.queryByText('polska')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button',{name:'Reveal answer'}));
    expect(screen.getByText('polska')).toBeInTheDocument();
  });
  it('shows the accepted form and both reasons after an incorrect answer',()=>{
    render(<App/>);
    fireEvent.click(screen.getByRole('button',{name:'Practice'}));
    fireEvent.change(screen.getByLabelText('Polish form'),{target:{value:'wrong'}});
    fireEvent.click(screen.getByRole('button',{name:'Check answer'}));
    expect(screen.getByText('Review the explanation')).toBeInTheDocument();
    expect(screen.getByText('Correct form:').parentElement?.textContent).toContain('kot');
    expect(screen.getByText('Why this case?').parentElement?.textContent).toContain(caseExplanation(questions[0]));
    expect(screen.getByText('Why this ending?').parentElement?.textContent).toContain(endingExplanation(questions[0]));
  });
  it('teaches ending construction within all seven case lessons',()=>{
    render(<App/>);
    const sections=screen.getAllByText('How noun forms change');
    expect(sections).toHaveLength(7);
    fireEvent.click(sections[1]);
    expect(within(sections[1].parentElement!).getByText('Compare nouns in this case')).toBeInTheDocument();
    expect(screen.getByRole('table',{name:'genitive noun comparisons'})).toHaveTextContent('szkoły');
    expect(screen.getByRole('table',{name:'genitive noun comparisons'})).toHaveTextContent('książki');
    expect(screen.getByRole('table',{name:'genitive noun comparisons'})).toHaveTextContent('czasu');
  });
  it('practises noun endings with targeted feedback and case filters',()=>{
    render(<App/>);
    fireEvent.click(screen.getByRole('button',{name:'Practice'}));
    fireEvent.change(screen.getByLabelText('Case'),{target:{value:'genitive'}});
    fireEvent.click(screen.getByLabelText('Choose noun endings'));
    expect(screen.getByText(/genitive singular form of/)).toHaveTextContent('kot');
    fireEvent.click(screen.getByRole('radio',{name:'kotu'}));
    fireEvent.click(screen.getByRole('button',{name:'Check answer'}));
    expect(screen.getByText('Review the ending')).toBeInTheDocument();
    expect(screen.getByText('Correct form:').parentElement).toHaveTextContent('kota');
    expect(screen.getByText('Why this ending?').parentElement).toHaveTextContent('masculine animate');
    expect(screen.getByText('Compare in genitive singular')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:'Retry'}));
    fireEvent.click(screen.getByRole('radio',{name:'kota'}));
    fireEvent.click(screen.getByRole('button',{name:'Check answer'}));
    expect(screen.getByText('Correct')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:'Next pattern'}));
    expect(screen.getByText(/genitive singular form of/)).toHaveTextContent('książka');
  });
  it('saves an incorrect ending drill and resumes it from Weak Spots',()=>{
    render(<App/>);
    fireEvent.click(screen.getByRole('button',{name:'Practice'}));
    fireEvent.change(screen.getByLabelText('Case'),{target:{value:'genitive'}});
    fireEvent.click(screen.getByLabelText('Choose noun endings'));
    fireEvent.click(screen.getByRole('radio',{name:'kotu'}));
    fireEvent.click(screen.getByRole('button',{name:'Check answer'}));
    fireEvent.click(screen.getByRole('button',{name:'Weak Spots'}));
    expect(screen.getByText('Ending pattern')).toBeInTheDocument();
    expect(screen.getByText(/kot → kota/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:'Review'}));
    expect(screen.getByLabelText('Choose noun endings')).toBeChecked();
    expect(screen.getByText(/genitive singular form of/)).toHaveTextContent('kot');
  });
});
