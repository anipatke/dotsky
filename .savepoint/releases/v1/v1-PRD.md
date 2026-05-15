---
type: release-prd
release: v1
status: active
---

# dotsky — v1 Release Plan

## Release goal

Ship a full-screen terminal planetarium that renders the live night sky from any observer location, with real astronomy calculations, interactive controls, and graceful failure handling.

## Epic list

| # | Epic | Status |
|---|------|--------|
| E01 | astronomy-engine | audited |
| E02 | location-and-cli | audited |
| E03 | tui-core | planned |
| E04 | polish-and-robustness | audited |

## Epic summaries

### E01: astronomy-engine
Replace the stub skyModel with real celestial calculations using the `astronomy-engine` package. Compute positions for Sun, Moon, naked-eye planets, and ~100 bright stars. This is the data foundation — everything else renders from it.

### E02: location-and-cli
Complete the location resolution chain: IP geolocation with timeout/cache, `--no-geo` support, fallback warning in the footer. Validate CLI inputs with clear error messages.

### E03: tui-core
Bring the app to life with React/Ink state management, all keybindings (`q`, `l`, `space`, arrows, `+/-`, `r`, `[`, `]`), an FPS-capped render loop, live and manual time modes, zoom, azimuth rotation, and labels toggle.

### E04: polish-and-robustness
Dynamic terminal sizing, proper viewport layout per spec, projection improvements (offset, zoom, aspect on both axes), star-priority label assignment, Unicode/ASCII fallback, minimum terminal size check, signal handling, clean up duplicates, and integration tests.

## Out of scope for this release

- Constellations
- Search
- Mouse support
- City lookup
- Themes
- Export/screenshot
- Telescope integration
- Deep-sky objects
- AR compass mode
