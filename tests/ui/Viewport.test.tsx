import { describe, expect, test } from 'vitest';
import { render } from 'ink-testing-library';
import { Viewport } from '../../src/ui/Viewport';
import type { LabeledPoint } from '../../src/render/labelLayout';

const emptyLabeled: LabeledPoint[] = [];

test('renders screen points', async () => {
  const screenPoints = [
    { x: 0, y: 0, symbol: '*' },
    { x: 10, y: 5, symbol: '+' }
  ];
  const { lastFrame } = render(<Viewport screenPoints={screenPoints} labeledPoints={emptyLabeled} labelsEnabled={false} width={80} height={24} />);
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(lastFrame()).toContain('*');
  expect(lastFrame()).toContain('+');
});

describe('labels rendering', () => {
  function makeLabeledPoint(name: string, x: number, y: number, labelX: number, labelY: number): LabeledPoint {
    return { id: name, name, type: 'star', x, y, visible: true, labelX, labelY };
  }

  test('renders labels when enabled', async () => {
    const labeledPoints = [makeLabeledPoint('Sirius', 5, 5, 6, 5)];
    const { lastFrame } = render(<Viewport screenPoints={[]} labeledPoints={labeledPoints} labelsEnabled={true} width={80} height={24} />);
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(lastFrame()).toContain('Sirius');
  });

  test('hides labels when disabled', async () => {
    const labeledPoints = [makeLabeledPoint('Sirius', 5, 5, 6, 5)];
    const { lastFrame } = render(<Viewport screenPoints={[]} labeledPoints={labeledPoints} labelsEnabled={false} width={80} height={24} />);
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(lastFrame()).not.toContain('Sirius');
  });
});
