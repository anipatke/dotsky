import { useState, useEffect, useRef, useCallback, type FC } from 'react';
import { Box, useApp, useInput, useStdin } from 'ink';
import { Footer } from './ui/Footer.js';
import { Header } from './ui/Header.js';
import { Horizon } from './ui/Horizon.js';
import { Viewport } from './ui/Viewport.js';
import type { ViewportPoint } from './ui/Viewport.js';
import { calculateCelestialBodies } from './astronomy/skyModel.js';
import { projectBody } from './projection/projectAltAz.js';
import { applyStarDensity } from './render/starDensity.js';
import { assignLabels, type LabeledPoint } from './render/labelLayout.js';
import { getSymbolForBody, detectUnicodeSupport } from './render/asciiGrid.js';
import { onResize, removeAllResizeListeners } from './terminal/resize.js';
import { mapKey } from './terminal/input.js';
import { toggleTimeMode, stepTime } from './timeControls.js';
import { MIN_WIDTH, MIN_HEIGHT } from './constants.js';

export type AppProps = {
  lat?: number;
  lon?: number;
  locationSource?: string;
  initialTime?: Date;
  aspect?: number;
  fps?: number;
  labelsEnabled?: boolean;
};

export type AppState = {
  location: { lat: number; lon: number; source?: string };
  time: Date;
  mode: 'live' | 'manual';
  labelsEnabled: boolean;
  azimuthOffset: number;
  zoom: number;
  dimensions: { width: number; height: number };
  belowMinimum: boolean;
};

const DEFAULT_LAT = -33.8688;
const DEFAULT_LON = 151.2093;
const unicodeSupported = detectUnicodeSupport();

function clampDimensions(dim: { width: number; height: number }) {
  return {
    width: Math.max(dim.width, MIN_WIDTH),
    height: Math.max(dim.height, MIN_HEIGHT),
  };
}

export const App: FC<AppProps> = (props = {}) => {
  const { exit } = useApp();
  const { isRawModeSupported, stdin } = useStdin();
  const isInputEnabled = Boolean(isRawModeSupported && stdin.isTTY);

  const initialRawWidth = process.stdout.columns ?? MIN_WIDTH;
  const initialRawHeight = process.stdout.rows ?? MIN_HEIGHT;

  const [state, setState] = useState<AppState>({
    location: {
      lat: props.lat ?? DEFAULT_LAT,
      lon: props.lon ?? DEFAULT_LON,
      source: props.locationSource,
    },
    time: props.initialTime ?? new Date(),
    mode: 'live',
    labelsEnabled: props.labelsEnabled ?? false,
    azimuthOffset: 0,
    zoom: 1,
    dimensions: clampDimensions({ width: initialRawWidth, height: initialRawHeight }),
    belowMinimum: initialRawWidth < MIN_WIDTH || initialRawHeight < MIN_HEIGHT,
  });

  const [screenPoints, setScreenPoints] = useState<ViewportPoint[]>([]);
  const [labeledPoints, setLabeledPoints] = useState<LabeledPoint[]>([]);

  const fps = props.fps ?? 15;
  const aspect = props.aspect ?? 0.5;

  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    return onResize(({ width, height }) => {
      setState(prev => ({
        ...prev,
        dimensions: clampDimensions({ width, height }),
        belowMinimum: width < MIN_WIDTH || height < MIN_HEIGHT,
      }));
    });
  }, []);

  useEffect(() => {
    return () => {
      removeAllResizeListeners();
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const s = stateRef.current;
      const bodies = calculateCelestialBodies({
        time: s.time,
        lat: s.location.lat,
        lon: s.location.lon,
      });

      const vpWidth = s.dimensions.width;
      const vpHeight = Math.max(1, s.dimensions.height - 4);

      const projected = bodies.map(body =>
        projectBody(body, { width: vpWidth, height: vpHeight }, {
          azimuthOffset: s.azimuthOffset,
          zoom: s.zoom,
          aspect,
        }),
      );

      const limited = applyStarDensity(projected, vpWidth, vpHeight);
      const labeled = assignLabels(limited, vpWidth);

      const points: ViewportPoint[] = limited.map(p => ({
        x: p.x,
        y: p.y,
        symbol: getSymbolForBody(p.type, p.magnitude, unicodeSupported),
      }));

      setScreenPoints(points);
      setLabeledPoints(labeled);
    }, 1000 / fps);

    return () => clearInterval(id);
  }, [fps, aspect]);

  useEffect(() => {
    if (state.mode !== 'live') return;
    const id = setInterval(() => {
      setState(prev => ({ ...prev, time: new Date() }));
    }, 1000);
    return () => clearInterval(id);
  }, [state.mode]);

  const handleKey = useCallback((input: string, key: { leftArrow?: boolean; rightArrow?: boolean }) => {
    const action = mapKey(input, key);
    if (!action) return;
    switch (action) {
      case 'quit':
        exit();
        break;
      case 'toggleLabels':
        setState(prev => ({ ...prev, labelsEnabled: !prev.labelsEnabled }));
        break;
      case 'toggleMode':
        setState(prev => {
          const { mode, time } = toggleTimeMode(prev.mode, prev.time);
          return { ...prev, mode, time };
        });
        break;
      case 'rotateLeft':
        setState(prev => ({ ...prev, azimuthOffset: prev.azimuthOffset - 15 }));
        break;
      case 'rotateRight':
        setState(prev => ({ ...prev, azimuthOffset: prev.azimuthOffset + 15 }));
        break;
      case 'zoomIn':
        setState(prev => ({ ...prev, zoom: Math.min(prev.zoom + 0.25, 5) }));
        break;
      case 'zoomOut':
        setState(prev => ({ ...prev, zoom: Math.max(prev.zoom - 0.25, 0.25) }));
        break;
      case 'reset':
        setState(prev => ({
          ...prev,
          zoom: 1,
          azimuthOffset: 0,
          labelsEnabled: props.labelsEnabled ?? false,
          mode: 'live',
        }));
        break;
      case 'stepForward':
        setState(prev => ({ ...prev, time: stepTime(prev.time, 'forward') }));
        break;
      case 'stepBack':
        setState(prev => ({ ...prev, time: stepTime(prev.time, 'back') }));
        break;
    }
  }, [exit, props.labelsEnabled]);

  useInput(handleKey, { isActive: isInputEnabled });

  const viewportHeight = Math.max(1, state.dimensions.height - 4);

  return (
    <Box flexDirection="column" width={state.dimensions.width}>
      <Header location={state.location} time={state.time} mode={state.mode} />
      <Viewport screenPoints={screenPoints} labeledPoints={labeledPoints} labelsEnabled={state.labelsEnabled} width={state.dimensions.width} height={viewportHeight} />
      <Horizon width={state.dimensions.width} azimuthOffset={state.azimuthOffset} />
      <Footer locationSource={state.location.source} belowMinimum={state.belowMinimum} />
    </Box>
  );
};

export default App;
