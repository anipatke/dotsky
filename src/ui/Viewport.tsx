import { Box, Text } from 'ink';
import type { LabeledPoint } from '../render/labelLayout.js';

export type ViewportPoint = {
  x: number;
  y: number;
  symbol: string;
};

type ViewportProps = {
  screenPoints: ViewportPoint[];
  labeledPoints: LabeledPoint[];
  labelsEnabled: boolean;
  width: number;
  height: number;
};

export const Viewport = ({ screenPoints, labeledPoints, labelsEnabled, width, height }: ViewportProps) => {
  return (
    <Box width={width} height={height} position="relative">
      {screenPoints.map((point, i) => (
        <Box key={i} top={point.y} left={point.x} position="absolute">
          <Text>{point.symbol}</Text>
        </Box>
      ))}
      {labelsEnabled && labeledPoints.map((p, i) => (
        <Box key={`lbl-${i}`} top={p.labelY} left={p.labelX} position="absolute">
          <Text>{p.name}</Text>
        </Box>
      ))}
    </Box>
  );
};
