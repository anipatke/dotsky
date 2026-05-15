import { describe, it, expect } from 'vitest';
import { validateFlags } from '../../src/cli/validateFlags.js';

describe('validateFlags', () => {
  it('returns null for valid flags', () => {
    expect(validateFlags({
      lat: -33.87,
      lon: 151.21,
      time: '2026-06-15T12:00:00Z',
      fps: 30,
      aspect: 0.5,
    })).toBeNull();
  });

  it('returns null for omitted optional flags', () => {
    expect(validateFlags({})).toBeNull();
  });

  it('rejects lat without lon', () => {
    const err = validateFlags({ lat: 10 });
    expect(err).toMatch(/together/);
  });

  it('rejects lon without lat', () => {
    const err = validateFlags({ lon: 10 });
    expect(err).toMatch(/together/);
  });

  it('rejects lat < -90', () => {
    const err = validateFlags({ lat: -91, lon: 0 });
    expect(err).toMatch(/lat.*\[-90, 90\]/);
  });

  it('rejects lat > 90', () => {
    const err = validateFlags({ lat: 91, lon: 0 });
    expect(err).toMatch(/lat.*\[-90, 90\]/);
  });

  it('rejects lon < -180', () => {
    const err = validateFlags({ lat: 0, lon: -181 });
    expect(err).toMatch(/lon.*\[-180, 180\]/);
  });

  it('rejects lon > 180', () => {
    const err = validateFlags({ lat: 0, lon: 181 });
    expect(err).toMatch(/lon.*\[-180, 180\]/);
  });

  it('rejects non-ISO time string', () => {
    const err = validateFlags({ time: 'not-a-date' });
    expect(err).toMatch(/time.*ISO 8601/);
  });

  it('accepts valid ISO 8601 time', () => {
    expect(validateFlags({ time: '2026-06-15T12:00:00Z' })).toBeNull();
  });

  it('rejects fps < 1', () => {
    const err = validateFlags({ fps: 0 });
    expect(err).toMatch(/fps.*\[1, 60\]/);
  });

  it('rejects fps > 60', () => {
    const err = validateFlags({ fps: 61 });
    expect(err).toMatch(/fps.*\[1, 60\]/);
  });

  it('accepts fps at boundary values', () => {
    expect(validateFlags({ fps: 1 })).toBeNull();
    expect(validateFlags({ fps: 60 })).toBeNull();
  });

  it('rejects non-positive aspect', () => {
    const err = validateFlags({ aspect: 0 });
    expect(err).toMatch(/aspect.*positive/);
  });

  it('rejects negative aspect', () => {
    const err = validateFlags({ aspect: -0.5 });
    expect(err).toMatch(/aspect.*positive/);
  });

  it('accepts positive aspect', () => {
    expect(validateFlags({ aspect: 0.1 })).toBeNull();
  });

  it('accepts lat=90 and lon=180 boundaries', () => {
    expect(validateFlags({ lat: 90, lon: 180 })).toBeNull();
    expect(validateFlags({ lat: -90, lon: -180 })).toBeNull();
  });
});
