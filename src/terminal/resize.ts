import { MIN_HEIGHT, MIN_WIDTH } from '../constants.js';

type ResizeDimensions = { width: number; height: number };
type ResizeCallback = (dim: ResizeDimensions) => void;

const listeners: Set<ResizeCallback> = new Set();
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let attached = false;

function handleResize(): void {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const dim = {
      width: process.stdout.columns ?? MIN_WIDTH,
      height: process.stdout.rows ?? MIN_HEIGHT,
    };
    listeners.forEach(cb => cb(dim));
  }, 16);
}

export function onResize(cb: ResizeCallback): () => void {
  listeners.add(cb);
  if (!attached) {
    process.stdout.on('resize', handleResize);
    attached = true;
  }
  return () => {
    listeners.delete(cb);
    if (listeners.size === 0) {
      process.stdout.off('resize', handleResize);
      attached = false;
    }
  };
}

export function removeAllResizeListeners(): void {
  listeners.clear();
  if (attached) {
    process.stdout.off('resize', handleResize);
    attached = false;
  }
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
}
