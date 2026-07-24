VERDICT: CHANGES_REQUESTED

## Zusammenfassung
Das Spiel selbst verarbeitet nachweislich keine personenbezogenen Daten (kein Tracking, keine Cookies, kein `localStorage`, keine Netzwerk-Calls — CSP mit `connect-src 'self'` bestätigt das). Die im Spec geforderten Security-/Datenschutz-Akzeptanzkriterien sind im Code sauber umgesetzt. Es fehlen jedoch die für ein öffentlich ausgeliefertes, deutschsprachiges Web-Produkt zwingenden Rahmentexte (Impressum, Datenschutzerklärung) sowie ein Mindestmaß an Barrierefreiheit. Das sind klassische, schnell behebbare Lücken — kein fundamentaler Verstoß.

---

## 1) DSGVO
**Befund (mittel-hoch):** Es gibt keinerlei Datenschutzerklärung/Hinweis, obwohl bereits der reine Betrieb der Website (Server-/Hosting-Zugriffslogs mit IP-Adresse, Zeitstempel etc.) personenbezogene Daten iSd Art. 4 DSGVO verarbeitet. Die App selbst ist zwar sauber (kein Tracking, keine Cookies, kein Storage), aber die Transparenzpflicht nach Art. 12/13 DSGVO bezieht sich auf die gesamte Datenverarbeitung im Zusammenhang mit dem Angebot, nicht nur auf In-App-Logik.
- **Fundstelle:** kein `datenschutz.html`/Link im gesamten Projekt (`index.html`, keine weiteren Seiten vorhanden).
- **Remedy:** Statische Seite `src/datenschutz.html` (oder Route) ergänzen mit: Verantwortlicher, Zweck/Rechtsgrundlage der Server-Logs (Art. 6 Abs. 1 lit. f DSGVO, berechtigtes Interesse Betriebssicherheit), Speicherdauer (z.B. „Server-Logs werden nach 7 Tagen gelöscht"), Hosting-Anbieter benennen, Betroffenenrechte (Auskunft, Löschung, Beschwerde bei Aufsichtsbehörde) auflisten. Link dazu im Footer/UI von `index.html` ergänzen.
- Positiv vermerkt: „Keine Erhebung/Speicherung personenbezogener Daten" (In-App) ist durch den Code tatsächlich erfüllt — kein Cookie-Banner nötig, da keine Cookies gesetzt werden.

## 2) EU Cyber Resilience Act (CRA)
**Befund (niedrig):** `package.json` hat kein `license`-Feld ("project license: unspecified"). Für SBOM-/Lizenz-Konformität und CRA-Dokumentation sollte eine Lizenz explizit deklariert sein.
- **Remedy:** `"license": "MIT"` (oder gewählte Lizenz) in `package.json` ergänzen + `LICENSE`-Datei im Root.

**Befund (niedrig-mittel):** Keine dokumentierten Sicherheitseigenschaften/kein Vulnerability-Disclosure-Hinweis (z.B. `SECURITY.md`), wie für CRA-Produkte mit digitalen Elementen empfohlen.
- **Remedy:** `SECURITY.md` mit Kontakt für Sicherheitsmeldungen, unterstützten Versionen und Update-Prozess (Redeploy via Vite-Build) ergänzen.

**Positiv:** Laufzeit-Abhängigkeiten = 0 (nur `devDependencies`: vite, @playwright/test) — minimale Angriffsfläche, vorbildlich. CSP in `index.html` ist restriktiv (`default-src 'self'`, kein `unsafe-inline/unsafe-eval`), entspricht „secure defaults". Kein `eval`/`Function()`/dynamischer Fremdcode gefunden — AC erfüllt. Kein `innerHTML`-Einsatz mit Nutzereingaben gefunden — XSS-AC erfüllt.

## 3) EU AI Act
Nicht relevant — keine KI-Funktion im Produkt vorhanden.

## 4) Pflichttexte & UI
**Befund (hoch):** Kein Impressum vorhanden. Für ein öffentlich erreichbares, deutschsprachiges Webangebot (`lang="de"`) ist ein Impressum nach §5 DDG/TMG unabhängig vom Geschäftsmodell im Regelfall zwingend, sobald es dauerhaft/geschäftsmäßig bereitgestellt wird.
- **Fundstelle:** `index.html` enthält keinerlei Link/Seite dazu.
- **Remedy:** `src/impressum.html` (oder einfache In-Page-Sektion) mit Anbieterkennzeichnung (Name/Anschrift, Kontakt, ggf. „Verantwortlich für den Inhalt") ergänzen und im UI verlinken (z.B. dezenter Footer-Link, außerhalb des Canvas, per HTML/CSS statt Canvas-Zeichnung, damit er nicht mit dem Spiel kollidiert).
- Cookie-Banner: nicht erforderlich, da nachweislich keine Cookies/kein Tracking gesetzt werden (AC erfüllt, korrekt so belassen).

## 5) Barrierefreiheit (WCAG/BITV/EAA)
**Befund (mittel):** Das `<canvas id="game-canvas">` hat kein `role`/`aria-label`, keine Textalternative und keine `aria-live`-Region für Status-/Score-Änderungen bzw. Game-Over. Screenreader-Nutzer erhalten keinerlei Information zum Spielgeschehen.
- **Fundstelle:** `index.html` (`<canvas id="game-canvas"></canvas>`), `src/game/engine.js` (`drawScore`, `drawGameOver` — nur visuell gerendert).
- **Remedy:** 
  - `role="img"` + `aria-label="Mittelalter Endless Runner"` am Canvas-Element ergänzen.
  - Sichtbaren/visuell verborgenen Steuerungshinweis als echtes HTML-Element hinzufügen (z.B. `<p class="sr-only">Leertaste, Pfeil-oben oder Klick/Touch zum Springen</p>`), nicht nur im Canvas gezeichnet.
  - Ein `aria-live="polite"`-Element außerhalb des Canvas ergänzen, das bei Game-Over den Text „Game Over, Distanz: XXXX" setzt.
- **Befund (niedrig):** Keine Möglichkeit, Spielgeschwindigkeit/Reaktionsanforderungen anzupassen (WCAG 2.2.1/2.2.2 „Timing Adjustable" bei zeitkritischen Spielen oft mit Ausnahme für Spiele, aber dokumentieren, dass Ausnahme für Echtzeit-Ereignisse gilt, ist empfehlenswert).

## 6) Sonstiges (kein Compliance-Blocker, aber empfehlenswert)
- **Befund (niedrig):** `window.__TEST_API__` wird auch im Produktions-Build exponiert (`src/main.js`). Enthält keine personenbezogenen Daten, ist aber unnötige Angriffsfläche/Informationsoffenlegung interner Zustände in Produktion.
  - **Remedy:** Hinter `import.meta.env.DEV` bzw. einen Build-Flag stellen, sodass die Test-API in Produktionsbuilds nicht existiert (z.B. via Playwright-Fixture nur im E2E-Build injizieren).

---

## Ergebnis
Kein fundamentaler DSGVO-/Sicherheitsverstoß (keine PII im Klartext, keine Drittanbieter-Calls, gute CSP, minimale Dependencies). Aber: fehlendes Impressum und fehlende Datenschutzerklärung sind klassische, leicht behebbare Pflichttextlücken, plus Barrierefreiheits- und kleinere CRA-Dokumentationslücken (Lizenzfeld, SECURITY.md). → **CHANGES_REQUESTED**, kein Freigabe-Blocker im Sinne von „BLOCKED".