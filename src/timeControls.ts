export type TimeMode = 'live' | 'manual';

export const STEP_MS = 600_000;

export function toggleTimeMode(mode: TimeMode, time: Date): { mode: TimeMode; time: Date } {
  if (mode === 'live') {
    return { mode: 'manual', time };
  }
  return { mode: 'live', time: new Date() };
}

export function stepTime(time: Date, direction: 'forward' | 'back'): Date {
  const ms = direction === 'forward' ? STEP_MS : -STEP_MS;
  return new Date(time.getTime() + ms);
}
