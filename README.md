# Aster

> A real-time orbital intelligence platform for monitoring Near-Earth Objects and the International Space Station.

Aster turns public orbital data into a responsive mission-control experience. It combines live NEO discovery, close-approach intelligence, ISS telemetry, and interactive 3D visualisations in a mobile-first Next.js application.

## Highlights

- Mission Control dashboard with health-aware telemetry and mission feed
- Multi-target NEO trajectory display with interactive asteroid tracks
- Orbital Explorer powered by NASA NeoWs search and object-detail data
- Upcoming close-approach timeline with distance, velocity, and orbiting body
- ISS Command Center with live telemetry, pass predictions, map and vehicle views
- Reusable React Three Fiber scene foundation for Earth, orbital tracks, and spacecraft visualisation
- Progressive Web App metadata and installability preparation
- Responsive design for mobile through desktop viewports

## ISS Command Center

Aster’s ISS Command Center offers two interactive operational views, backed by live position telemetry and designed for clear at-a-glance orbital awareness.

### Geocentric tactical map

The map view presents a wireframe Earth, the ISS target lock, and multiple colour-coded orbital paths in a compact geocentric display. Operators can switch between the tactical map and vehicle model without leaving the ISS page.

![ISS Command Center geocentric tactical map](public/images/readme/iss-orbital-map.png)

### Holographic vehicle viewer

The vehicle view provides an interactive technical model of the International Space Station with subsystem selection, camera orientation controls, reset interaction, and a live telemetry readout below.

![ISS Command Center holographic vehicle viewer](public/images/readme/iss-vehicle-viewer.png)

## Technology

- Next.js 15, App Router, React 19, and TypeScript
- Tailwind CSS 4 and custom HUD design tokens
- TanStack React Query for client caching and polling
- Three.js, React Three Fiber, and Drei for interactive orbital visualisation
- Framer Motion and GSAP for restrained interface motion
- Lucide React for interface icons

## Getting started

### Prerequisites

- Node.js 20 or later
- npm 10 or later
- NASA API key
- N2YO API key for ISS pass data

### Installation

```bash
git clone https://github.com/MadManGodGifted/Aster.git
cd Aster
npm install
```

Create a local environment file from the template:

```bash
copy .env.example .env.local
```

Then provide your keys:

```dotenv
NASA_API_KEY=your_nasa_api_key
N2YO_API_KEY=your_n2yo_api_key
```

Never commit `.env.local` or expose these keys in browser code. Aster routes external requests through Next.js route handlers.

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create an optimised production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | Run strict TypeScript validation |

## Data sources

Aster uses publicly available services through server-side API routes:

- [NASA NeoWs](https://api.nasa.gov/) for NEO search and close-approach data
- [N2YO](https://www.n2yo.com/) for ISS pass prediction data
- [CelesTrak](https://celestrak.org/) for satellite and orbital reference data
- ISS position endpoints for live position telemetry

Service health is surfaced to the interface as connected, degraded, or offline. Cached data is retained where possible so a temporary upstream failure does not break the dashboard.

## Project structure

```text
src/
├── app/                  # App Router pages and server route handlers
├── components/
│   ├── 3d/               # Reusable React Three Fiber scene modules
│   ├── explorer/         # NEO search and details interface
│   ├── iss/              # ISS command interface
│   ├── mission/          # Mission Control modules
│   ├── ui/               # Shared HUD components
│   └── layout/           # Shell and navigation
├── hooks/                # Reusable React and query hooks
├── lib/                  # API clients, caching, animation, and 3D utilities
├── types/                # Shared TypeScript types
└── styles/               # Global design tokens and styling

public/
└── assets/3d/            # Local Earth textures and future scene assets
```

## Design system

The interface follows Aster’s retro-futuristic aerospace language: industrial panels, thin structural borders, monospaced telemetry, subtle scanlines, and purposeful motion. Visual tokens are defined centrally in `src/app/globals.css`; components use those tokens rather than ad-hoc visual values.

The current visual direction uses a near-black command surface with mint operational signals, amber warnings, and red critical states. It is designed to read as an orbital operations terminal, not a generic dashboard.

## 3D engine

The 3D foundation is modular and lazy-loaded to preserve page responsiveness:

- Earth, atmosphere, lighting, and star-background primitives
- Adaptive render quality and device pixel ratio
- Off-screen scene pausing through visibility observation
- Isolated scene boundaries to keep rendering work out of the broader UI tree
- Interactive orbit controls with mobile-safe constraints

The Mission Control view focuses on multi-object asteroid tracking. The ISS page retains the geocentric Earth and orbital-track display alongside its spacecraft view.

## Progressive Web App

PWA metadata, icons, theme colour, manifest configuration, and service-worker preparation are included. The project is structured for installation from Android Chrome; full offline-cache behaviour can be expanded in a future release.

## Quality checks

Before opening a pull request or publishing a change, run:

```bash
npm run typecheck
npm run build
```

## Contributing

1. Create a focused branch from `main`.
2. Keep API secrets out of source control.
3. Preserve the existing design tokens and component boundaries.
4. Run type checking and a production build before submitting changes.
5. Describe API, UI, and performance impact in the pull request.

## License

This repository does not currently include a license. All rights are reserved until a license is added.
