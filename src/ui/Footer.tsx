import { Box, Text } from 'ink';
import { MIN_WIDTH, MIN_HEIGHT } from '../constants.js';

type FooterProps = {
  locationSource?: string;
  belowMinimum?: boolean;
};

export function Footer({ locationSource, belowMinimum }: FooterProps = {}) {
  return (
    <Box>
      <Box flexGrow={1}>
        <Text dimColor>
          {'[q] quit | [l] labels | [space] pause/live | [←/→] rotate | [+/-] zoom'}
        </Text>
      </Box>
      {belowMinimum && (
        <Text color="yellow">
          {`   [Terminal too small — minimum ${MIN_WIDTH}x${MIN_HEIGHT}]`}
        </Text>
      )}
      {!belowMinimum && locationSource === 'fallback' && (
        <Text dimColor>
          {'   [Location fallback: Sydney]'}
        </Text>
      )}
    </Box>
  );
}
