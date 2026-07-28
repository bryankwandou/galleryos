# GalleryOS

GalleryOS is a photography-studio workflow prototype covering booking visibility, explainable human-confirmed culling, gallery preparation, and a private client selection experience.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`, then use **Open the studio**. The client-facing demo is at `/gallery/harper-chen`.

## Current scope

- Responsive marketing site, pricing, privacy, and terms
- Interactive studio dashboard and booking filters
- Human-confirmed cull review; suggestions never remove work automatically
- Gallery builder preview and client favorites flow
- Unit tests for cull decision invariants

Production integrations are intentionally not represented as complete. See `docs/KNOWN_LIMITATIONS.md`.
