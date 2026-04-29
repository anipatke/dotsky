# ✦ astrolink

> A full-screen terminal planetarium. No telescope required — just a keyboard and a sense of wonder.

```text
       .      *       +      .      .          .
    +      .     .      *         .       +
  .    *       .      .     ☉       .      *
      .     +      .        .      *       .
   *      .      .      +      .      .      +
            [ TERMINAL SKY ACTIVATED ]
```

**astrolink** turns your terminal into a live celestial viewport. Point it anywhere on Earth, dial in any time, and watch the sky render in ASCII — stars, planets, the Moon, and the Sun, plotted in real time.

It is accurate enough to trust, minimal enough to leave running, and weird enough to feel like a piece of arcade hardware that fell off a satellite.

---

## 🚀 Install

```bash
npm install -g astrolink
```

Or run it directly with `npx`:

```bash
npx astrolink
```

---

## 🌌 Usage

Launch and let it find your sky automatically:

```bash
astrolink
```

Take the helm manually:

```bash
# Set your ground station
astrolink --lat=-33.8688 --lon=151.2093

# Rewind to a specific night
astrolink --time="2026-04-29T21:00:00+10:00"

# Disable geolocation (fully offline)
astrolink --no-geo

# Start with labels enabled
astrolink --labels

# Fine-tune the display
astrolink --aspect=0.5 --fps=15
```

### CLI Options

| Option     | Default     | Description                          |
| ---------- | ----------- | ------------------------------------ |
| `--lat`    | auto        | Observer latitude                    |
| `--lon`    | auto        | Observer longitude                   |
| `--time`   | system time | Initial observation time (ISO 8601)  |
| `--no-geo` | false       | Skip IP geolocation                  |
| `--aspect` | 0.5         | Terminal character aspect correction |
| `--fps`    | 15          | Maximum render FPS                   |
| `--labels` | false       | Show object labels on startup        |
| `--help`   | false       | Show help                            |

---

## 🎮 Flight Controls

Once inside, your keyboard is the control deck:

| Key         | Action                          |
| ----------- | ------------------------------- |
| `q`         | Eject (quit)                    |
| `Ctrl + C`  | Eject (quit)                    |
| `Space`     | Toggle live / manual time       |
| `←` `→`     | Rotate viewport west / east     |
| `+` `-`     | Zoom in / out                   |
| `l`         | Toggle object labels            |
| `[` `]`     | Step time backward / forward    |
| `r`         | Reset view and time             |

In **live mode**, the sky updates every second.
In **manual mode**, time freezes and you step through it in 10-minute chunks.

---

## 🗺️ How Location Works

astrolink tries to lock onto your position in this order:

1. **CLI flags** (`--lat` / `--lon`) — you know where you are
2. **Cached location** — remembers the last session
3. **IP geolocation** — asks the internet (only if you let it)
4. **Sydney, Australia** — our proud fallback coordinates

If the network is down, no drama. It defaults gracefully and prints a quiet footer:

```text
Location fallback: Sydney
```

---

## 🛰️ What's Under the Hood

- **Node.js + Ink + React** — rendering a TUI that feels like a cockpit HUD
- **astronomy-engine** — precise celestial mechanics (no guesswork)
- **Custom projection layer** — altitude/azimuth mapped to your terminal grid
- **Star density culling** — adapts to your viewport so it never feels crowded
- **Debounced resize** — handles terminal resizing without tearing the sky apart

The architecture is split into four clean domains:

```
Astronomy  →  Projection  →  Rendering  →  Terminal
   (data)       (math)        (ASCII)      (display)
```

Swap in stereographic, orthographic, or azimuthal projections without touching the sky model.

---

## 🧰 Requirements

- Node.js 18+
- A terminal that supports Unicode and alternate screen buffers
- Minimum resolution: **80×24**

---

## 🌠 Roadmap

v1 ships with the core sky. Future orbits may include:

- Constellation overlays
- City search
- Deep-sky objects (nebulae, clusters)
- Screenshot / export
- Mouse support
- Telescope integration

---

## 📜 License

ISC

---

```text
┌─ astrolink ──────────────────────────────┐
│                                          │
│   "The universe is under no obligation   │
│    to make sense to you."                │
│                                          │
│              — but we plotted it anyway  │
│                                          │
└──────────────────────────────────────────┘
```
