// office-crew tester: deterministic smoke test + interaction crawl.
// Loads the app AND THEN drives a generic interaction sweep (keyboard + a grid
// of canvas clicks, or clicking DOM controls) while watching for ANY console
// error / uncaught exception the whole time — so bugs that only appear AFTER
// interaction (entering a world/level, starting gameplay, opening a menu) are
// caught, not just load-time errors. A canvas game exposes no DOM buttons and
// changes scenes via clicks/keys, so the crawl walks menu -> world/level select
// -> gameplay and fails on the first runtime error it provokes.
const { test, expect } = require('@playwright/test');

test('app loads and survives an interaction crawl without runtime errors', async ({ page }) => {
  test.setTimeout(90000);
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console.error: ' + m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + ((e && e.stack) || String(e))));
  // Best-effort screenshots into _shots/ so Tessa can judge the VISUALS afterwards
  // (invisible player, placeholder art, blank scene) — things a console-error smoke
  // never sees. Never fails the test.
  const shot = async (n) => { try { await page.screenshot({ path: '_shots/' + n + '.png' }); } catch (e) {} };

  await page.goto('/', { waitUntil: 'load' });
  await page.waitForTimeout(3000);
  await shot('01_load');

  const canvas = await page.$('canvas');
  const mounted = !!canvas || await page.evaluate(
    () => !!(document.body && document.body.children.length > 0));
  expect(mounted, 'no <canvas>/root element mounted — the app did not render').toBeTruthy();
  // Fail fast on a load-time crash before spending time on the crawl.
  expect(errors, 'runtime errors during load:\n' + errors.join('\n')).toEqual([]);

  // --- Interaction crawl --------------------------------------------------
  const step = async () => { await page.waitForTimeout(350); };
  // Common navigation/confirm/gameplay keys first (menus + gameplay respond to these).
  for (const k of ['Enter', 'Space', 'ArrowDown', 'ArrowRight', 'Enter']) {
    await page.keyboard.press(k); await step();
  }
  const box = canvas ? await canvas.boundingBox() : null;
  if (box) {
    // Canvas game: click a grid of points (hits menu buttons / world & level
    // cards / gameplay), pressing Enter after each to confirm a selection.
    const cols = 4, rows = 3;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = box.x + (box.width * (c + 0.5)) / cols;
        const y = box.y + (box.height * (r + 0.5)) / rows;
        await page.mouse.click(x, y); await step();
        await page.keyboard.press('Enter'); await step();
      }
    }
    // Hybrid apps overlay DOM screens (menu / stage select / settings) on the
    // canvas — those often only react to clicks, not keys. Click the first few
    // visible DOM controls too, so the crawl can actually ENTER gameplay before
    // the controls probe below (else it probes a static menu, which proves
    // nothing about gameplay input).
    const overlay = await page.$$('button, a, [role=button], input[type=submit], input[type=button]');
    for (const el of overlay.slice(0, 8)) {
      try { if (await el.isVisible()) { await el.click({ timeout: 1000 }); await step(); } } catch (e) { /* ignore */ }
    }
    // Close whatever modal the sweep may have opened, so the controls probe
    // below doesn't run against a settings/pause dialog.
    await page.keyboard.press('Escape'); await step();
  } else {
    // DOM app: click the visible controls to exercise navigation.
    const clickables = await page.$$('button, a, [role=button], input[type=submit], input[type=button]');
    for (const el of clickables.slice(0, 15)) {
      try { await el.click({ timeout: 1000 }); } catch (e) { /* ignore un-clickable */ }
      await step();
    }
  }
  await shot('02_after_nav');
  // A burst of gameplay-style input in whatever scene we ended up in.
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Space');
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(600);
  await shot('03_gameplay');

  // --- Controls probe (canvas apps) ---------------------------------------
  // Deterministic input-responsiveness signal for Tessa: hold each common
  // gameplay control, then report whether anything observable happened. Two
  // signals per key, weakest to strongest:
  //   (a) frame change — PNG byte equality of before/after canvas screenshots.
  //       Reliable as a "nothing changed AT ALL" detector; meaningless when the
  //       scene animates on its own (the idle line says which case applies).
  //   (b) player position via the window.__TEST_API__ hook (project convention
  //       for games: { scene, player: {x, y} }) — animation-immune.
  // The probe never fails the test itself: in a static menu "no change" is
  // normal. Tessa interprets the [input-probe] lines together with the probe_*
  // screenshots (a player that never moves across them = dead controls).
  if (canvas) {
    const shotBuf = async () => { try { return await canvas.screenshot(); } catch (e) { return null; } };
    const readApi = async () => {
      try {
        return await page.evaluate(() => {
          const a = window.__TEST_API__ || window.TEST_API;  // tolerant: accept the single-underscore variant devs sometimes expose
          if (!a || typeof a !== 'object') return null;
          const p = a.player || {};
          return { scene: String(a.scene || ''), x: Number(p.x), y: Number(p.y) };
        });
      } catch (e) { return null; }
    };
    const fmt = (s) => s ? ('scene=' + (s.scene || '?') + ' player=(' + s.x + ',' + s.y + ')') : 'no __TEST_API__ hook';
    const idle1 = await shotBuf(); await page.waitForTimeout(700); const idle2 = await shotBuf();
    const idleAnimates = !!(idle1 && idle2 && !idle1.equals(idle2));
    console.log('[input-probe] idle: ' + (idleAnimates
      ? 'scene animates without input (frame-change alone proves nothing — use player positions/screenshots)'
      : 'scene is static without input (a frame change below = real input reaction)'));
    const s0 = await readApi();
    console.log('[input-probe] state before probe: ' + fmt(s0));
    const scLow = s0 ? String(s0.scene || '').toLowerCase() : '';
    const terminalScene = ['over', 'dead', 'lost', 'defeat', 'fail', 'ended', 'gameover', 'game_over'].some(w => scLow.includes(w));
    if (terminalScene) console.log('[input-probe] NOTE: scene "' + s0.scene + '" is a TERMINAL/game-over state — the game correctly stopped after a game-over; a static frame and unresponsive keys below are EXPECTED here, NOT a dead app or dead controls.');
    if (!s0) console.log('[input-probe] NOTE: no game test hook exposed (checked window.__TEST_API__ and window.TEST_API) — scene/player cannot be read, so the controls verdict is frame-only and unreliable; a low-severity testability gap (expose window.__TEST_API__ = { scene, player: { x, y } }), NOT evidence of a dead app.');
    for (const key of ['ArrowRight', 'ArrowLeft', 'Space', 'ArrowUp', 'KeyX']) {
      const before = await shotBuf(); const sBefore = await readApi();
      await page.keyboard.down(key); await page.waitForTimeout(900); await page.keyboard.up(key);
      await page.waitForTimeout(250);
      const after = await shotBuf(); const sAfter = await readApi();
      const frame = (before && after) ? (before.equals(after) ? 'frame UNCHANGED' : 'frame changed') : 'frame n/a';
      let move = '';
      if (sBefore && sAfter && Number.isFinite(sBefore.x) && Number.isFinite(sAfter.x)) {
        const dx = Math.round(sAfter.x - sBefore.x), dy = Math.round(sAfter.y - sBefore.y);
        move = ' player (' + dx + ',' + dy + ')' + ((dx === 0 && dy === 0) ? ' — position unchanged (a defect ONLY if THIS ticket promised this key acts; an auto-runner has no left/right control and a fixed player is correct)' : ' — moved');
      }
      console.log('[input-probe] hold ' + key + ' 900ms: ' + frame + move);
      await shot('04_probe_' + key);
    }
  }

  expect(errors, 'runtime errors during load or interaction crawl:\n' + errors.join('\n')).toEqual([]);
});
