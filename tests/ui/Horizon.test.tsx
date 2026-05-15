import { describe, it, expect } from 'vitest';
import { render } from 'ink';
import { PassThrough } from 'node:stream';
import { createElement } from 'react';
import { Horizon } from '../../src/ui/Horizon';

async function renderToString(element: Parameters<typeof render>[0]): Promise<string> {
  const chunks: Buffer[] = [];
  const stdout = new PassThrough() as unknown as NodeJS.WriteStream;
  (stdout as any).isTTY = true;
  (stdout as any).columns = 80;
  (stdout as any).rows = 24;
  stdout.on('data', (chunk: Buffer) => chunks.push(chunk));
  const { unmount, waitUntilRenderFlush } = render(element, { stdout, patchConsole: false });
  await waitUntilRenderFlush();
  unmount();
  return Buffer.concat(chunks).toString();
}

function horizon(width = 80, azimuthOffset = 0) {
  return createElement(Horizon, { width, azimuthOffset });
}

describe('Horizon', () => {
  it('renders N marker', async () => {
    const out = await renderToString(horizon());
    expect(out).toContain('N');
  });

  it('renders E marker', async () => {
    const out = await renderToString(horizon());
    expect(out).toContain('E');
  });

  it('renders S marker', async () => {
    const out = await renderToString(horizon());
    expect(out).toContain('S');
  });

  it('renders W marker', async () => {
    const out = await renderToString(horizon());
    expect(out).toContain('W');
  });

  it('renders separator dashes', async () => {
    const out = await renderToString(horizon());
    expect(out).toContain('-');
  });

  function compassLine(out: string): string {
    const lines = out.split('\n');
    return lines.find(l => /^[NESW]/.test(l.trim()))?.trim() ?? '';
  }

  it('moves markers with a 15 degree azimuthOffset', async () => {
    const baseline = compassLine(await renderToString(horizon(80, 0)));
    const rotated = compassLine(await renderToString(horizon(80, 15)));
    expect(rotated).not.toBe(baseline);
  });

  it('rotates markers with azimuthOffset 90 — E appears first', async () => {
    const out = await renderToString(horizon(80, 90));
    expect(compassLine(out).startsWith('E')).toBe(true);
  });

  it('rotates markers with azimuthOffset 180 — S appears first', async () => {
    const out = await renderToString(horizon(80, 180));
    expect(compassLine(out).startsWith('S')).toBe(true);
  });

  it('rotates markers with azimuthOffset 270 — W appears first', async () => {
    const out = await renderToString(horizon(80, 270));
    expect(compassLine(out).startsWith('W')).toBe(true);
  });

  it('rotates markers with azimuthOffset 360 — back to N first', async () => {
    const out = await renderToString(horizon(80, 360));
    expect(compassLine(out).startsWith('N')).toBe(true);
  });
});
