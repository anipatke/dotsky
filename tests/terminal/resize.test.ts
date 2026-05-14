import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { onResize, removeAllResizeListeners } from '../../src/terminal/resize';

describe('resize', () => {
  beforeEach(() => {
    removeAllResizeListeners();
  });

  afterEach(() => {
    removeAllResizeListeners();
  });

  it('calls callback with dimensions after debounce', async () => {
    const cb = vi.fn();
    onResize(cb);
    process.stdout.emit('resize');
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(cb).toHaveBeenCalledOnce();
    const arg = cb.mock.calls[0][0] as { width: number; height: number };
    expect(arg).toHaveProperty('width');
    expect(arg).toHaveProperty('height');
    expect(typeof arg.width).toBe('number');
    expect(typeof arg.height).toBe('number');
  });

  it('debounces multiple rapid resize events into one call', async () => {
    const cb = vi.fn();
    onResize(cb);
    process.stdout.emit('resize');
    process.stdout.emit('resize');
    process.stdout.emit('resize');
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(cb).toHaveBeenCalledOnce();
  });

  it('unsubscribe prevents future callbacks', async () => {
    const cb = vi.fn();
    const unsub = onResize(cb);
    unsub();
    process.stdout.emit('resize');
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(cb).not.toHaveBeenCalled();
  });

  it('removeAllResizeListeners clears all callbacks', async () => {
    const cb1 = vi.fn();
    const cb2 = vi.fn();
    onResize(cb1);
    onResize(cb2);
    removeAllResizeListeners();
    process.stdout.emit('resize');
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(cb1).not.toHaveBeenCalled();
    expect(cb2).not.toHaveBeenCalled();
  });
});
