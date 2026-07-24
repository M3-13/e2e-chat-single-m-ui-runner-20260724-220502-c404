# Design — Project Identity

> This document is project-long-lived. Tokens are not changed without
> the Architect's approval. Developers MUST use these tokens
> instead of improvising their own colors/spacings.

## Style Direction

Warme, gedämpfte Mittelalter-Pixel-Art im Retro-Look: Pergament- und Steintöne mit dämmrigem Blauhimmel und goldenem Akzent, märchenhaft und klar lesbar wie ein 16-Bit-Abenteuer.

## Colors

- `--color-bg`: **#2b3a55**
- `--color-fg`: **#f4e9d0**
- `--color-accent`: **#e0a83d**
- `--color-border`: **#1b2436**
- `--color-muted`: **#8a94a8**
- `--color-sky_top`: **#3a4d70**
- `--color-sky_bottom`: **#6b7fa3**
- `--color-hill_far`: **#4a5d78**
- `--color-hill_near`: **#5a6e4a**
- `--color-ground`: **#7a5c3a**
- `--color-ground_dark`: **#5a4228**
- `--color-stone`: **#8b8577**
- `--color-stone_dark`: **#5f5a4e**
- `--color-knight_armor`: **#c9d1dc**
- `--color-knight_armor_dark`: **#8a94a8**
- `--color-knight_tunic`: **#a8332e**
- `--color-knight_outline`: **#1b2436**
- `--color-danger`: **#a8332e**
- `--color-gold_dark`: **#9c6f22**

## Typography

- `font_family`: 'Press Start 2P', 'Courier New', monospace
- `heading_weight`: 400
- `body_weight`: 400
- `size_score`: 20px
- `size_title`: 32px
- `size_hint`: 12px

## Spacing Scale

- `--space-0`: 4px
- `--space-1`: 8px
- `--space-2`: 12px
- `--space-3`: 16px
- `--space-4`: 24px
- `--space-5`: 32px
- `--space-6`: 48px

## Border-Radii

- `--radius-sm`: 2px
- `--radius-md`: 4px
- `--radius-lg`: 8px
- `--radius-pill`: 999px

## Components

### Button

Pixel-Rahmen-Look: padding 12/24, radius sm(2px), bg=accent #e0a83d, fg=border #1b2436, 2px solid border #9c6f22, font 'Press Start 2P' 12px. default: leichter innerer Schatten unten. hover: bg +10% lightness (#e8b855). active: um 2px nach unten versetzt (gedrückt), border-bottom flach. disabled: opacity 0.6, kein Cursor. min-height 44px, min-width 44px (Touch-Ziel). Wird nur für Neustart/Menü genutzt, nicht im Canvas-Spielfeld.

### Knight (Player-Sprite)

48x48px Basisframe, 2x-3x skaliert gerendert (pixelated, image-rendering: pixelated). Silhouette: aufrechter Ritter mit Helm, roter Tunika, silberne Rüstung. Farben min. 4 Töne: knight_armor #c9d1dc (Highlight), knight_armor_dark #8a94a8 (Schatten), knight_tunic #a8332e (Rock/Umhang), knight_outline #1b2436 (1px Kontur rundum). Lauf-Animation: 4 Frames (Beine wechseln, Arme leicht schwingen). Sprung: 1 gestreckter Frame (Beine angewinkelt). KEINE einfarbigen Rechtecke — echte Pixel-Silhouette mit erkennbarem Helm-Federbusch (accent-Gold) als Wiedererkennung. Boden-Schatten: ovaler halbtransparenter Fleck unter dem Ritter.

### Obstacle-Sprites

Zwei Varianten für Abwechslung, je 32-48px hoch. (1) Steinhindernis/Barrikade: stone #8b8577 hell, stone_dark #5f5a4e Schatten, outline #1b2436, gestapelte Quader mit Fugen. (2) Fass/Spitzpfahl: ground #7a5c3a Holz, ground_dark #5a4228 Reifen, danger #a8332e Spitze oben zur Gefahrensignalisierung. Beide mit 1px Kontur, klar gegen Boden abgehoben. Hitbox = AABB, minimal enger als Sprite (Toleranz für faires Gameplay).

### Background (Parallax)

Drei Ebenen, zeitbasiert unterschiedlich schnell nach links scrollend. Ebene 1 (Himmel, statisch/langsam): Vertikalverlauf sky_top #3a4d70 → sky_bottom #6b7fa3, dazu 2-3 Pixel-Wolken in fg-Ton mit reduzierter Deckung. Ebene 2 (fern, langsam): Silhouette einer Burg/Berge in hill_far #4a5d78. Ebene 3 (nah, mittel): Hügel/Bäume in hill_near #5a6e4a. Nahtlos kachelbar. Kontrast so gewählt, dass der helle Ritter (#c9d1dc) sich klar abhebt.

### Ground

Bodenstreifen unten, Höhe ca. 15-20% der Canvas-Höhe. Oberkante ground #7a5c3a mit Pixel-Grasnarbe (hill_near-Tupfer), darunter ground_dark #5a4228 mit angedeuteten Steinen/Erdstruktur. Scrollt mit der schnellsten Parallax-Geschwindigkeit. Klare Trennlinie (1px outline) als Lauf-Grundlinie für den Ritter.

### HUD (Score)

Oben links, Abstand 16px zum Rand. Text 'DISTANZ: 0000' in font 'Press Start 2P' 20px, Farbe fg #f4e9d0 mit 2px border-Schatten (#1b2436) für Lesbarkeit über jedem Hintergrund. Zahl mit führenden Nullen, live steigend. Kein Kasten nötig — der Schatten-Outline sichert Kontrast. Auf schmalen Screens (<480px) auf 14px reduzieren.

### Game-Over-Screen (Canvas-Overlay)

Halbtransparentes Overlay bg #2b3a55 bei 78% Deckung über gesamtem Canvas. Zentriert: Titel 'GAME OVER' 32px accent #e0a83d mit Outline. Darunter 'DISTANZ: XXXX' 20px fg. Darunter Hinweistext 'LEERTASTE / KLICK für Neustart' 12px muted #8a94a8. Vertikale Abstände 24px. Optional pulsierender accent-Rahmen um den Hinweis.

### Start-/Titelscreen (Canvas)

Zeigt scrollenden Hintergrund + stehenden/laufenden Ritter live. Zentrierter Titel 'RITTER RUN' 32px accent mit Outline, darunter Hinweis 'LEERTASTE, ↑ oder KLICK zum Springen' 12px fg. Ohne DOM-Buttons — reine Canvas-Zeichnung, jede Eingabe startet.

## Layout Principles

- Vollflächiges responsives Canvas: füllt das Browserfenster, Seitenverhältnis via requestAnimationFrame-Resize angepasst; interne Auflösung an devicePixelRatio skaliert für scharfe Pixel.
- image-rendering: pixelated global — alle Sprites werden ganzzahlig skaliert (2x/3x je nach Fenstergröße), damit Pixel-Art scharf bleibt.
- Boden-Grundlinie bei ~80% der Canvas-Höhe; Ritter läuft auf fester X-Position (~20% von links), Hindernisse kommen von rechts.
- Breakpoints: <480px (mobil, HUD 14px, kleinere Sprite-Skalierung 2x), 480–1024px (2x), >1024px (3x Skalierung).
- Alle DOM-Overlays (falls genutzt) rein per textContent gesetzt — niemals innerHTML mit Eingabewerten (XSS-Schutz).
- Konsistente Spacing-Skala für DOM-Elemente (Neustart-Button, Container); im Canvas Abstände in Vielfachen von 8px (Pixel-Grid-Ausrichtung).
- Farb-Kontrastregel: Vordergrund (Ritter, Hindernisse) nutzt helle/gesättigte Töne (#c9d1dc, #a8332e), Hintergrund bleibt gedämpft (Blau-/Grüntöne) — Spieler ist immer klar erkennbar.
