import type { FC } from 'react';
import { Box, Text, useApp, useInput, useStdin } from 'ink';
import { Footer } from './ui/Footer.js';
import { Header } from './ui/Header.js';
import { Horizon } from './ui/Horizon.js';
import { Viewport } from './ui/Viewport.js';

export type AppProps = {
  lat?: number;
  lon?: number;
  locationSource?: string;
  initialTime?: Date;
  aspect?: number;
  fps?: number;
  labelsEnabled?: boolean;
};

export const App: FC<AppProps> = (_props = {}) => {
  const { exit } = useApp();
  const { isRawModeSupported, stdin } = useStdin();
  const isInputEnabled = Boolean(isRawModeSupported && stdin.isTTY);

  useInput(input => {
    if (input === 'q') {
      exit();
    }
  }, { isActive: isInputEnabled });

  const previewPoints = [
    { x: 6, y: 2, symbol: '*' },
    { x: 24, y: 4, symbol: '+' },
    { x: 45, y: 7, symbol: '.' },
    { x: 61, y: 3, symbol: '*' },
  ];

  return (
    <Box flexDirection="column" width={80}>
      <Header />
      <Text>Astrolink sky preview</Text>
      <Viewport screenPoints={previewPoints} />
      <Horizon width={80} />
      <Footer />
    </Box>
  );
};

export default App;
