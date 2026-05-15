import type { CelestialBodyType } from '../astronomy/objectTypes.js';

const UNICODE_SYMBOLS: Record<string, string> = {
  sun: '☉',
  moon: '◐',
};

const ASCII_SYMBOLS: Record<string, string> = {
  sun: 'O',
  moon: 'o',
};

export function detectUnicodeSupport(): boolean {
  const lcAll = process.env.LC_ALL;
  if (lcAll) {
    return lcAll.toLowerCase().includes('utf') || lcAll.toLowerCase().includes('utf-8');
  }
  const lcCtype = process.env.LC_CTYPE;
  if (lcCtype) {
    return lcCtype.toLowerCase().includes('utf') || lcCtype.toLowerCase().includes('utf-8');
  }
  const term = process.env.TERM;
  if (term) {
    return term.toLowerCase().includes('utf');
  }
  return true;
}

export function getSymbolForBody(type: CelestialBodyType, magnitude?: number, unicode?: boolean): string {
  const useUnicode = unicode ?? true;
  if (!useUnicode) {
    switch (type) {
      case 'sun': return ASCII_SYMBOLS.sun;
      case 'moon': return ASCII_SYMBOLS.moon;
      case 'planet': return '*';
      case 'star':
        if (magnitude !== undefined && magnitude < 1.0) return '*';
        if (magnitude !== undefined && magnitude < 3.0) return '+';
        return '.';
      default: return '.';
    }
  }
  switch (type) {
    case 'sun': return UNICODE_SYMBOLS.sun;
    case 'moon': return UNICODE_SYMBOLS.moon;
    case 'planet': return '*';
    case 'star':
      if (magnitude !== undefined && magnitude < 1.0) return '*';
      if (magnitude !== undefined && magnitude < 3.0) return '+';
      return '.';
    default: return '.';
  }
}
