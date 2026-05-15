import { describe, it, expect } from 'vitest';
import { mapKey } from '../../src/terminal/input';

const noKey = { leftArrow: false, rightArrow: false };
const leftKey = { leftArrow: true, rightArrow: false };
const rightKey = { leftArrow: false, rightArrow: true };

describe('mapKey', () => {
  it('maps q to quit', () => {
    expect(mapKey('q', noKey)).toBe('quit');
  });

  it('maps l to toggleLabels', () => {
    expect(mapKey('l', noKey)).toBe('toggleLabels');
  });

  it('maps space to toggleMode', () => {
    expect(mapKey(' ', noKey)).toBe('toggleMode');
  });

  it('maps left arrow to rotateLeft', () => {
    expect(mapKey('', leftKey)).toBe('rotateLeft');
  });

  it('maps right arrow to rotateRight', () => {
    expect(mapKey('', rightKey)).toBe('rotateRight');
  });

  it('maps + to zoomIn', () => {
    expect(mapKey('+', noKey)).toBe('zoomIn');
  });

  it('maps = to zoomIn', () => {
    expect(mapKey('=', noKey)).toBe('zoomIn');
  });

  it('maps - to zoomOut', () => {
    expect(mapKey('-', noKey)).toBe('zoomOut');
  });

  it('maps _ to zoomOut', () => {
    expect(mapKey('_', noKey)).toBe('zoomOut');
  });

  it('maps r to reset', () => {
    expect(mapKey('r', noKey)).toBe('reset');
  });

  it('maps ] to stepForward', () => {
    expect(mapKey(']', noKey)).toBe('stepForward');
  });

  it('maps [ to stepBack', () => {
    expect(mapKey('[', noKey)).toBe('stepBack');
  });

  it('returns null for unknown input', () => {
    expect(mapKey('x', noKey)).toBeNull();
  });

  it('returns null for unknown key', () => {
    expect(mapKey('', { leftArrow: false, rightArrow: false })).toBeNull();
  });

  it('prefers input over key when both match', () => {
    expect(mapKey('q', leftKey)).toBe('quit');
  });
});
