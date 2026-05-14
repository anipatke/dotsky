# astrolink Engineering Spec

Version: 1.1.0
Stack: Node.js + Ink + React + astronomy-js
Package: `astrolink`
Binary: `astrolink`

---

## 1. Product Goal

Build a full-screen terminal planetarium that renders the live night sky based on observer location, time, and terminal dimensions.

The app should feel like a cockpit-style terminal viewport: immersive, responsive, accurate enough for educational use, and stable across resize events.

---

## 2. Core Requirements

### 2.1 Full-Screen Terminal Mode

On launch:

* Enter alternate screen buffer
* Hide terminal cursor
* Clear screen
* Render UI at full terminal width and height

On exit:

* Restore primary buffer
* Show cursor
* Cleanly remove listeners
* Exit without corrupting terminal state

Exit triggers:

* `q`
* `Ctrl+C`
* process `SIGINT`
* process `SIGTERM`

Required dependency:

* `ansi-escapes`

---

## 3. CLI Interface

Use `meow` for argument parsing.

### Commands

```bash
astrolink
astrolink --lat=-33.8688 --lon=151.2093
astrolink --time="2026-04-29T21:00:00+10:00"
astrolink --no-geo
astrolink --aspect=0.5
astrolink --fps=15
astrolink --labels
```

### CLI Options

| Option     |    Type |     Default | Description                          |
| ---------- | ------: | ----------: | ------------------------------------ |
| `--lat`    |  number |        auto | Observer latitude                    |
| `--lon`    |  number |        auto | Observer longitude                   |
| `--time`   |  string | system time | Initial observation time             |
| `--no-geo` | boolean |       false | Disable IP geolocation               |
| `--aspect` |  number |         0.5 | Terminal character aspect correction |
| `--fps`    |  number |          15 | Maximum render FPS                   |
| `--labels` | boolean |       false | Start with labels enabled            |
| `--help`   | boolean |       false | Show help                            |

---

## 4. Location Resolution

Location priority:

1. CLI `--lat` and `--lon`
2. Cached previous location
3. IP geolocation
4. Default fallback: Sydney, Australia
   `lat=-33.8688`, `lon=151.2093`

If IP lookup fails, do not crash. Show a small footer warning:

```text
Location fallback: Sydney
```

---

## 5. Architecture

```text
src/
  cli.ts
  App.tsx
  terminal/
    screen.ts
    input.ts
    resize.ts
  location/
    resolveLocation.ts
    cacheLocation.ts
  astronomy/
    skyModel.ts
    objectTypes.ts
  projection/
    projectAltAz.ts
    aspectCorrection.ts
  render/
    starDensity.ts
    asciiGrid.ts
    labelLayout.ts
  ui/
    Header.tsx
    Viewport.tsx
    Footer.tsx
    Horizon.tsx
```

---

## 6. Component Responsibilities

### `<App />`

Owns:

* app state
* location
* time mode
* viewport dimensions
* keyboard handling
* render tick loop
* graceful shutdown

#### State Shape

```ts
type AppState = {
  location: {
    lat: number;
    lon: number;
    source: "cli" | "cache" | "geo" | "fallback";
  };
  time: Date;
  mode: "live" | "manual";
  labelsEnabled: boolean;
  azimuthOffset: number;
  zoom: number;
  dimensions: {
    width: number;
    height: number;
  };
};
```

---

### `skyModel.ts`

Responsible for celestial calculations only.

#### Input

```ts
{
  time: Date;
  lat: number;
  lon: number;
}
```

#### Output

```ts
type CelestialBody = {
  id: string;
  name: string;
  type: "star" | "planet" | "sun" | "moon";
  azimuth: number;
  altitude: number;
  magnitude?: number;
};
```

No rendering logic allowed here.

---

### `projectAltAz.ts`

Converts sky coordinates to terminal grid coordinates.

Responsibilities:

* Apply azimuth offset
* Apply zoom
* Apply aspect correction
* Filter below-horizon bodies

#### Output

```ts
type ScreenPoint = {
  id: string;
  name: string;
  type: CelestialBody["type"];
  x: number;
  y: number;
  visible: boolean;
  magnitude?: number;
};
```

---

## 7. Projection Rules

Minimum acceptable projection:

```text
x = normalized azimuth across viewport width
y = normalized altitude across viewport height
```

Projection logic must be isolated to allow replacement with:

* stereographic projection
* orthographic projection
* azimuthal equidistant projection

---

## 8. Terminal Aspect Correction

Default:

```ts
aspect = 0.5
```

Override:

```bash
astrolink --aspect=0.55
```

Aspect correction must be applied in projection, not rendering.

---

## 9. Rendering Model

Default:

```ts
fps = 15
```

Rules:

* Live mode updates celestial positions once per second
* Render loop capped at `fps`
* Resize events debounced (16–50ms)
* Avoid unnecessary redraws
* Render full grid before output to prevent flicker

---

## 10. Star Density

```ts
targetDensity = viewportArea / 120;
```

Priority:

1. Sun
2. Moon
3. Planets
4. Bright stars
5. Dim stars

---

## 11. ASCII Rendering

| Object      | Symbol     |
| ----------- | ---------- |
| Sun         | `☉` or `O` |
| Moon        | `◐` or `o` |
| Planet      | `*`        |
| Bright star | `*`        |
| Medium star | `+`        |
| Dim star    | `.`        |

Fallback to ASCII-safe mode if Unicode fails.

---

## 12. Labels

* Disabled by default
* Toggle with `l`
* Collision avoidance required
* Priority: planets > moon > sun > bright stars

```ts
maxLabels = Math.floor(width / 12);
```

---

## 13. UI Layout

```text
┌─ astrolink ─────────────── [ lat, lon ] ─┐
│                                          │
│                 viewport                 │
│                                          │
├──────────────────────────────────────────┤
│ N -------- E -------- S -------- W ----- │
└──────────────────────────────────────────┘
[q] quit | [l] labels | [space] pause/live | [←/→] rotate | [+/-] zoom
```

#### Layout Rules

```ts
headerHeight = 1;
horizonHeight = 2;
footerHeight = 1;
viewportHeight = totalHeight - headerHeight - horizonHeight - footerHeight;
```

Minimum terminal:

```text
80x24
```

---

## 14. Keybindings

| Key      | Action             |
| -------- | ------------------ |
| `q`      | Quit               |
| `Ctrl+C` | Quit               |
| `l`      | Toggle labels      |
| `space`  | Toggle live/manual |
| `left`   | Rotate west        |
| `right`  | Rotate east        |
| `+`      | Zoom in            |
| `-`      | Zoom out           |
| `r`      | Reset              |
| `[`      | Step backward      |
| `]`      | Step forward       |

---

## 15. Time Model

### Live Mode

* Uses system time
* Updates every second

### Manual Mode

* Freezes time
* Step via `[` and `]`
* Step size: 10 minutes
* Returning to live snaps to system time

---

## 16. Failure Modes

Handle gracefully:

* No internet
* IP geolocation failure
* Invalid CLI inputs
* Small terminal
* Unicode issues
* Resize mid-render
* Astronomy calculation errors

---

## 17. Testing Requirements

### Unit Tests

* location resolution
* projection bounds
* aspect correction
* star density
* label collision
* CLI parsing

### Integration Tests

* full-screen entry/exit
* resize behavior
* CLI overrides
* fallback handling

---

## 18. Success Criteria

* Full-screen works reliably
* Terminal restored correctly
* No flicker
* Accurate celestial positioning
* Responsive resizing
* Works offline
* CLI install works globally

---

## 19. Future Enhancements

Out of scope for v1:

* Constellations
* Search
* Mouse support
* City lookup
* Themes
* Export/screenshot
* Telescope integration
* Deep-sky objects
* AR compass mode

---

## 20. Summary

This system separates:

* **Astronomy (data)**
* **Projection (math)**
* **Rendering (ASCII)**
* **Terminal control (environment)**

This separation is mandatory to ensure maintainability, extensibility, and correctness.

Failure to maintain these boundaries will result in tightly coupled logic and increased refactor cost.
