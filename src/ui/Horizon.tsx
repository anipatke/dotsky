import { Box, Text } from 'ink';

type HorizonProps = {
  width: number;
};

export function Horizon({ width }: HorizonProps) {
  const markerCount = 4; // N E S W
  const markerWidth = 1;
  const spacesForDashes = width - markerCount * markerWidth - (markerCount - 1) * 1;
  const segLen = Math.max(0, Math.floor(spacesForDashes / markerCount));
  const dashes = (n: number) => '-'.repeat(n);

  const compassLine = `N ${dashes(segLen)} E ${dashes(segLen)} S ${dashes(segLen)} W`;

  return (
    <Box flexDirection="column">
      <Text>{dashes(width)}</Text>
      <Text>{compassLine}</Text>
    </Box>
  );
}
