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

describe('Horizon', () => {
  it('renders N marker', async () => {
    const out = await renderToString(createElement(Horizon, { width: 80 }));
    expect(out).toContain('N');
  });

  it('renders E marker', async () => {
    const out = await renderToString(createElement(Horizon, { width: 80 }));
    expect(out).toContain('E');
  });

  it('renders S marker', async () => {
    const out = await renderToString(createElement(Horizon, { width: 80 }));
    expect(out).toContain('S');
  });

  it('renders W marker', async () => {
    const out = await renderToString(createElement(Horizon, { width: 80 }));
    expect(out).toContain('W');
  });

  it('renders separator dashes', async () => {
    const out = await renderToString(createElement(Horizon, { width: 80 }));
    expect(out).toContain('-');
  });
});
