import meow from 'meow';
import { render } from 'ink';
import { createElement } from 'react';
import { resolveLocation } from './location/resolveLocation.js';
import App, { type AppProps } from './App.js';

const cli = meow(
  `
  Usage
    $ astrolink

  Options
    --lat       Observer latitude
    --lon       Observer longitude
    --time      Initial observation time (ISO 8601)
    --no-geo    Disable IP geolocation
    --aspect    Character aspect ratio (default: 0.5)
    --fps       Maximum render FPS (default: 15)
    --labels    Start with labels enabled

  Examples
    $ astrolink --lat=-33.8688 --lon=151.2093
`,
  {
    importMeta: import.meta,
    flags: {
      lat: { type: 'number' },
      lon: { type: 'number' },
      time: { type: 'string' },
      geo: { type: 'boolean', default: true },
      aspect: { type: 'number', default: 0.5 },
      fps: { type: 'number', default: 15 },
      labels: { type: 'boolean', default: false },
    },
  },
);

const { lat, lon, time: timeStr, aspect, fps, labels } = cli.flags;

if ((lat !== undefined) !== (lon !== undefined)) {
  console.error('Error: --lat and --lon must be provided together.');
  process.exit(1);
}

if ((lat !== undefined && isNaN(lat)) || (lon !== undefined && isNaN(lon))) {
  console.error('Error: --lat and --lon must be valid numbers.');
  process.exit(1);
}

const initialTime = timeStr ? new Date(timeStr) : undefined;
const location = await resolveLocation({ lat, lon });

// Ink owns the full terminal lifecycle via alternateScreen + exitOnCtrlC.
// Do NOT call enterScreen()/exitScreen() manually — that conflicts with Ink's
// own cursor/screen management and breaks stdin raw mode on Windows.
const appProps: AppProps = {
    lat: location.lat,
    lon: location.lon,
    locationSource: location.source,
    initialTime,
    aspect,
    fps,
    labelsEnabled: labels,
};

const isInteractive = Boolean(process.stdin.isTTY);

const { waitUntilExit } = render(
  createElement(App, appProps),
  {
    alternateScreen: isInteractive,
    exitOnCtrlC: isInteractive,
    patchConsole: false,
  },
);

process.on('SIGTERM', () => process.exit(0));

await waitUntilExit();
process.exit(0);
