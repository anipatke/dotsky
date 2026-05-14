import { Box, Text } from 'ink';

export type ViewportPoint = {
  x: number;
  y: number;
  symbol: string;
};

type ViewportProps = {
  screenPoints: ViewportPoint[];
};

export const Viewport = ({ screenPoints }: ViewportProps) => {
  return (
    <Box width={80} height={24} position="relative">
      {screenPoints.map((point, i) => (
        <Box key={i} top={point.y} left={point.x} position="absolute">
          <Text>{point.symbol}</Text>
        </Box>
      ))}
    </Box>
  );
};
