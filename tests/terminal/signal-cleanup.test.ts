import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { onResize, removeAllResizeListeners } from '../../src/terminal/resize.js';

describe('signal cleanup', () => {
  beforeEach(() => {
    removeAllResizeListeners();
  });

  afterEach(() => {
    removeAllResizeListeners();
  });

  it('removeAllResizeListeners called on exit prevents further callbacks', () => {
    const cb = vi.fn();
    onResize(cb);

    removeAllResizeListeners();

    process.stdout.emit('resize');
    expect(cb).not.toHaveBeenCalled();
  });

  it('multiple resize listeners all cleared on cleanup', () => {
    const cb1 = vi.fn();
    const cb2 = vi.fn();
    onResize(cb1);
    onResize(cb2);

    removeAllResizeListeners();

    process.stdout.emit('resize');
    expect(cb1).not.toHaveBeenCalled();
    expect(cb2).not.toHaveBeenCalled();
  });

  it('debounce timer cleared on cleanup prevents delayed callback', async () => {
    const cb = vi.fn();
    onResize(cb);

    removeAllResizeListeners();
    process.stdout.emit('resize');

    await new Promise(resolve => setTimeout(resolve, 50));
    expect(cb).not.toHaveBeenCalled();
  });
});
