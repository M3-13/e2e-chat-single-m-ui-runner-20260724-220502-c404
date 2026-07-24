# Mittelalter Endless Runner (Browser)

## Overview
Ein 2D-Endless-Runner im Browser: Ein dauerhaft laufender Ritter springt über Hindernisse vor scrollendem Mittelalter-Hintergrund. Sprung per Leertaste, Pfeil-oben oder Klick/Touch, mit Gravitation. Kollision führt zu Game-Over mit Neustart, die zurückgelegte Distanz wird live als Punktzahl angezeigt. Umgesetzt mit Vite und HTML5-Canvas, schlichte aber stimmige Pixel-Art statt einfarbiger Rechtecke.

## Functional Requirements

- Der Ritter läuft dauerhaft (Lauf-Animation) vor einem horizontal scrollenden Mittelalter-Hintergrund.
- Sprungmechanik mit Gravitation: Der Ritter springt auf Eingabe und fällt realistisch zurück auf den Boden.
- Mehrfach-Eingabe für den Sprung: Leertaste, Pfeil-oben-Taste und Klick/Touch lösen alle denselben Sprung aus.
- Hindernisse erscheinen fortlaufend von rechts und bewegen sich mit dem Hintergrund nach links.
- Kollisionserkennung zwischen Ritter und Hindernis (AABB-basiert).
- Bei Kollision: Game-Over-Zustand mit sichtbarem Neustart (Taste oder Klick startet ein neues Spiel).
- Live angezeigte Distanz-Punktzahl, die mit fortschreitendem Lauf steigt.
- Responsives Canvas-Layout, das sich an die Fenstergröße anpasst.

## Non-functional Requirements

- Flüssige Darstellung über requestAnimationFrame mit zeitbasierter Bewegung (delta time).
- Pixel-Art mit stimmigem Mittelalter-Look statt flacher einfarbiger Rechtecke.

## Tech Stack

- **language**: JavaScript (ES Modules)
- **build**: Vite
- **rendering**: HTML5 Canvas 2D
- **art**: Pixel-Art (Mittelalter-Stil), im Canvas gezeichnet
- **project_type**: `web-vite` (determines the CI pipeline)

## Acceptance Criteria

- [ ] Das Spiel startet mit npm run dev und zeigt sofort den laufenden Ritter vor scrollendem Hintergrund.
- [ ] Leertaste, Pfeil-oben und Klick/Touch lassen den Ritter springen; er kehrt durch Gravitation auf den Boden zurück.
- [ ] Ein Zusammenstoß mit einem Hindernis löst Game-Over aus; ein Neustart bringt das Spiel in den Anfangszustand zurück.
- [ ] Die Distanz-Punktzahl ist während des Spiels sichtbar und steigt an.
- [ ] Das Canvas passt sich an unterschiedliche Fenstergrößen an.
- [ ] [Security] Keine Third-Party-Netzwerk-/API-Aufrufe oder dynamisches Nachladen von Assets aus nicht vertrauenswürdigen Quellen
- [ ] [Security] Eingabebehandlung (Tastatur/Touch/Klick) darf keine beliebigen Strings in DOM/innerHTML rendern (XSS-Vermeidung)
- [ ] [Security] Keine Nutzung von eval/Function-Konstruktoren oder dynamischem Code aus externen Quellen
- [ ] [Security] Abhängigkeiten (package.json) minimal halten und auf bekannte CVEs prüfen (npm audit)
- [ ] [Datenschutz] Keine Erhebung oder Speicherung personenbezogener Daten (kein Tracking, keine Analytics, keine Cookies)