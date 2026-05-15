import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getSymbolForBody, detectUnicodeSupport } from '../../src/render/asciiGrid';

describe('asciiGrid', () => {
  describe('getSymbolForBody', () => {
    it('returns Unicode sun symbol by default', () => {
      expect(getSymbolForBody('sun', undefined)).toBe('☉');
    });
    it('returns Unicode moon symbol by default', () => {
      expect(getSymbolForBody('moon', undefined)).toBe('◐');
    });
    it('returns ASCII sun symbol when unicode is false', () => {
      expect(getSymbolForBody('sun', undefined, false)).toBe('O');
    });
    it('returns ASCII moon symbol when unicode is false', () => {
      expect(getSymbolForBody('moon', undefined, false)).toBe('o');
    });
    it('returns star symbol for bright star', () => {
      expect(getSymbolForBody('star', -1.5)).toBe('*');
    });
    it('returns star symbol for medium star', () => {
      expect(getSymbolForBody('star', 2.0)).toBe('+');
    });
    it('returns dot for dim star', () => {
      expect(getSymbolForBody('star', 5.0)).toBe('.');
    });
    it('returns planet symbol', () => {
      expect(getSymbolForBody('planet', undefined)).toBe('*');
    });
    it('returns dot for unknown type', () => {
      expect(getSymbolForBody('unknown' as any, undefined)).toBe('.');
    });
    it('uses unicode when flag is explicitly true', () => {
      expect(getSymbolForBody('sun', undefined, true)).toBe('☉');
    });
  });

  describe('detectUnicodeSupport', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      vi.resetModules();
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('returns true when LC_ALL contains utf-8', () => {
      process.env.LC_ALL = 'en_US.UTF-8';
      expect(detectUnicodeSupport()).toBe(true);
    });

    it('returns true when LC_CTYPE contains utf', () => {
      delete process.env.LC_ALL;
      process.env.LC_CTYPE = 'en_US.UTF-8';
      expect(detectUnicodeSupport()).toBe(true);
    });

    it('returns true when TERM contains utf', () => {
      delete process.env.LC_ALL;
      delete process.env.LC_CTYPE;
      process.env.TERM = 'xterm-utf8';
      expect(detectUnicodeSupport()).toBe(true);
    });

    it('returns false when no env vars indicate utf-8', () => {
      delete process.env.LC_ALL;
      delete process.env.LC_CTYPE;
      process.env.TERM = 'vt100';
      expect(detectUnicodeSupport()).toBe(false);
    });

    it('defaults to true when no relevant env vars are set', () => {
      delete process.env.LC_ALL;
      delete process.env.LC_CTYPE;
      delete process.env.TERM;
      expect(detectUnicodeSupport()).toBe(true);
    });
  });
});
