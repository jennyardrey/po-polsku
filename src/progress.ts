export const SCHEMA_VERSION = 1;
export const STORAGE_KEY = 'polish-drills-progress-v1';
export type RecordEntry = { attempts: number; correct: number; incorrect: number; streak: number; lastSeen: number; due: number };
export type Progress = { schemaVersion: 1; records: Record<string, RecordEntry> };
export const emptyProgress = (): Progress => ({ schemaVersion: SCHEMA_VERSION, records: {} });
export const caseKey = (id: string, mode: 'form' | 'identify' | 'ending') => `case:${mode}:${id}`;
export const wordKey = (lemma: string, direction: 'pl-en' | 'en-pl') => `word:${direction}:${lemma}`;
export function recordAttempt(progress: Progress, key: string, correct: boolean, now = Date.now()): Progress {
  const old = progress.records[key];
  const streak = correct ? (old?.streak ?? 0) + 1 : 0;
  const days = [0,1,3,7,14][Math.min(streak,4)];
  return { schemaVersion: 1, records: { ...progress.records, [key]: { attempts: (old?.attempts ?? 0)+1, correct: (old?.correct ?? 0)+(correct ? 1 : 0), incorrect: (old?.incorrect ?? 0)+(correct ? 0 : 1), streak, lastSeen: now, due: now + days * 86400000 } } };
}
export function validateProgress(value: unknown): value is Progress {
  if (!value || typeof value !== 'object') return false;
  const p = value as Record<string,unknown>;
  if (p.schemaVersion !== 1 || !p.records || typeof p.records !== 'object' || Array.isArray(p.records)) return false;
  return Object.entries(p.records).every(([key, entry]) => {
    if (!/^(case:(form|identify):[a-z]+-\d+|case:ending:ending-[a-z]+-\d+|word:(pl-en|en-pl):.+)$/.test(key) || !entry || typeof entry !== 'object') return false;
    const r = entry as Record<string,unknown>;
    return ['attempts','correct','incorrect','streak','lastSeen','due'].every(k => typeof r[k] === 'number' && Number.isFinite(r[k]) && (r[k] as number) >= 0) && Number.isInteger(r.attempts) && Number.isInteger(r.correct) && Number.isInteger(r.incorrect) && Number.isInteger(r.streak) && (r.correct as number)+(r.incorrect as number) === r.attempts && (r.streak as number) <= (r.correct as number);
  });
}
export function importProgress(text: string): Progress {
  const value: unknown = JSON.parse(text);
  if (!validateProgress(value)) throw new Error('Invalid or unsupported progress backup.');
  return value;
}
export const exportProgress = (p: Progress) => JSON.stringify(p,null,2);
export function loadProgress(): Progress {
  try { return importProgress(localStorage.getItem(STORAGE_KEY) ?? ''); } catch { return emptyProgress(); }
}
export function saveProgress(p: Progress): void { localStorage.setItem(STORAGE_KEY, exportProgress(p)); }
export function priority(key: string, p: Progress, now = Date.now()): number {
  const r = p.records[key];
  if (!r) return 2;
  if (r.due <= now) return r.streak === 0 ? 0 : 1;
  return 3;
}
