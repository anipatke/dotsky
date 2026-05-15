#!/usr/bin/env node
import meow from 'meow';
import { render } from 'ink';
import { createElement } from 'react';
import { resolveLocation } from './location/resolveLocation.js';
import App, { type AppProps } from './App.js';
import { validateFlags } from './cli/validateFlags.js';
import { removeAllResizeListeners } from './terminal/resize.js';

const cli = meow(
  `
  Usage
    $ dotsky

  Options
    --lat       Observer latitude
    --lon       Observer longitude
    --time      Initial observation time (ISO 8601)
    --no-geo    Disable IP geolocation
    --aspect    Character aspect ratio (default: 0.5)
    --fps       Maximum render FPS (default: 15)
    --labels    Start with labels enabled

  Examples
    $ dotsky --lat=-33.8688 --lon=151.2093
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

const { lat, lon, geo, time: timeStr, aspect, fps, labels } = cli.flags;

const error = validateFlags({ lat, lon, time: timeStr, fps, aspect });
if (error) {
  console.error(`Error: ${error}`);
  process.exit(1);
}

const initialTime = timeStr ? new Date(timeStr) : undefined;
const location = await resolveLocation({ lat, lon, noGeo: !geo });

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
process.on('exit', removeAllResizeListeners);

await waitUntilExit();
process.exit(0);
