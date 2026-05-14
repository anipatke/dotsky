import { Box, Text } from 'ink';

export function Footer() {
  return (
    <Box>
      <Text dimColor>
        {'[q] quit | [l] labels | [space] pause/live | [←/→] rotate | [+/-] zoom'}
      </Text>
    </Box>
  );
}
