import { Box, Text } from 'ink';

type HorizonProps = {
  width: number;
  azimuthOffset: number;
};

const CARDINALS = [
  { label: 'N', azimuth: 0 },
  { label: 'E', azimuth: 90 },
  { label: 'S', azimuth: 180 },
  { label: 'W', azimuth: 270 },
];

function normalizeAngle(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

export function Horizon({ width, azimuthOffset }: HorizonProps) {
  const dashes = (n: number) => '-'.repeat(n);
  const compass = Array.from({ length: Math.max(0, width) }, () => ' ');

  for (const marker of CARDINALS) {
    const adjusted = normalizeAngle(marker.azimuth - azimuthOffset);
    const position = Math.floor((adjusted / 360) * width);
    if (position >= 0 && position < compass.length) {
      compass[position] = marker.label;
    }
  }

  return (
    <Box flexDirection="column">
      <Text>{dashes(width)}</Text>
      <Text>{compass.join('')}</Text>
    </Box>
  );
}
