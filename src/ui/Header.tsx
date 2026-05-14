import React from 'react';
import { Text, Box } from 'ink';

export const Header = () => {
  return (
    <Box>
      <Text bold color="cyan">astrolink</Text>
      <Text>Lat: -33.8688, Lon: 151.2093</Text>
    </Box>
  );
};