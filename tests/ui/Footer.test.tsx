import { describe, it, expect } from 'vitest';
import { render } from 'ink';
import { PassThrough } from 'node:stream';
import { createElement } from 'react';
import { Footer } from '../../src/ui/Footer';

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

describe('Footer', () => {
  it('renders quit hint', async () => {
    const out = await renderToString(createElement(Footer));
    expect(out).toContain('[q] quit');
  });

  it('renders labels hint', async () => {
    const out = await renderToString(createElement(Footer));
    expect(out).toContain('[l] labels');
  });

  it('renders rotate hint', async () => {
    const out = await renderToString(createElement(Footer));
    expect(out).toContain('rotate');
  });

  it('renders zoom hint', async () => {
    const out = await renderToString(createElement(Footer));
    expect(out).toContain('[+/-] zoom');
  });
});
