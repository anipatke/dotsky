import { Box } from 'ink';

export default function Viewport({ screenPoints }: { screenPoints: Array<{ x: number; y: number; symbol: string }> }) {
  return (
    <Box width={80} height={24}>
      {screenPoints.map((point, index) => (
        <Box key={`point-${index}`} top={point.y} left={point.x}>
          {point.symbol}
        </Box>
      ))}
    </Box>
  );
}