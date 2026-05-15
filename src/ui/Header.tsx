import { Text, Box } from 'ink';

type HeaderProps = {
  location: { lat: number; lon: number };
  time: Date;
  mode: 'live' | 'manual';
};

export function Header({ location, time, mode }: HeaderProps) {
  const latStr = location.lat.toFixed(2);
  const lonStr = location.lon.toFixed(2);
  const timeStr = time.toISOString().replace('T', ' ').replace(/\.\d{3}Z/, '') + ' UTC';
  return (
    <Box>
      <Text bold color="cyan">dotsky</Text>
      <Text>  Lat: {latStr}, Lon: {lonStr}  |  {timeStr}  [{mode === 'live' ? 'live' : 'paused'}]</Text>
    </Box>
  );
}