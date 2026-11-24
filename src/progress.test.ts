import { describe, expect, it } from 'vitest';
import { emptyProgress, exportProgress, importProgress, priority, recordAttempt } from './progress';
describe('progress', () => {
  it('schedules wrong immediately and correct after 1, 3, 7, 14 days', () => { const now=1000000; let p=recordAttempt(emptyProgress(),'case:form:nominative-01',false,now); expect(p.records['case:form:nominative-01'].due).toBe(now); for(const day of [1,3,7,14,14]) { p=recordAttempt(p,'case:form:nominative-01',true,now); expect(p.records['case:form:nominative-01'].due).toBe(now+day*86400000); } expect(p.records['case:form:nominative-01'].attempts).toBe(6); expect(p.records['case:form:nominative-01'].incorrect).toBe(1); });
  it('prioritizes incorrect due items', () => { const now=1000000; const p=recordAttempt(emptyProgress(),'word:pl-en:być',false,now); expect(priority('word:pl-en:być',p,now)).toBe(0); expect(priority('word:pl-en:other',p,now)).toBe(2); });
  it('round trips valid backups and rejects malformed records and schemas', () => { const p=recordAttempt(emptyProgress(),'word:pl-en:być',true,100); expect(importProgress(exportProgress(p))).toEqual(p); expect(()=>importProgress('{"schemaVersion":2,"records":{}}')).toThrow(); expect(()=>importProgress('{"schemaVersion":1,"records":{"bad":{"attempts":1}}}')).toThrow(); });
  it('keeps ending drill progress in a version-one backup',()=>{const p=recordAttempt(emptyProgress(),'case:ending:ending-genitive-01',false,100);expect(importProgress(exportProgress(p))).toEqual(p);});
});
