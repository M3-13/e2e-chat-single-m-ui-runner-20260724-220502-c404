# Ritter Run — Mittelalter Endless Runner

2D-Endless-Runner im Browser: Ein Ritter läuft dauerhaft vor scrollendem Mittelalter-Hintergrund.

## How to run

```bash
npm install
npm run dev
```

Dann im Browser `http://localhost:5173` öffnen.

Zum Bauen:

```bash
npm run build
npm run preview
```

## Steuerung

- **Leertaste**, **Pfeil-oben** oder **Klick/Touch**: Sprung (kommt in Ticket #2)

## Technische Hinweise

- Das Canvas füllt das gesamte Browserfenster und skaliert mit devicePixelRatio für scharfe Pixel.
- Pixel-Art wird mit `image-rendering: pixelated` ganzzahlig skaliert.
- QA-Hook: `window.__TEST_API__` liefert `{ scene: null, player: { x, y } }`.
