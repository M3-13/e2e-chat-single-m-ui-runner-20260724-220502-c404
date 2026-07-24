const _ = 0
const O = 1
const L = 2
const D = 3
const W = 4
const R = 5
const S = 6

const STONE_PAL = [
  null,
  '#1b2436',
  '#8b8577',
  '#5f5a4e',
]

const BARREL_PAL = [
  null,
  '#1b2436',
  '#7a5c3a',
  '#5a4228',
  '#a8332e',
]

const STONE_DATA = [
  [_,_,_,_,O,O,O,O,O,_,_,_,_,_],
  [_,_,_,O,L,L,L,L,L,O,_,_,_,_],
  [_,_,O,L,L,L,L,L,L,L,O,_,_,_],
  [_,_,O,L,L,L,L,L,L,L,O,_,_,_],
  [_,_,O,L,L,D,D,D,D,L,O,_,_,_],
  [_,_,O,L,L,L,L,L,L,L,O,_,_,_],
  [_,_,O,L,L,L,L,L,L,L,O,_,_,_],
  [_,_,O,L,L,D,D,D,D,L,O,_,_,_],
  [_,_,O,L,L,L,L,L,L,L,O,_,_,_],
  [_,_,O,L,L,L,L,L,L,L,O,_,_,_],
  [_,_,O,L,L,D,D,D,D,L,O,_,_,_],
  [_,_,O,L,L,L,L,L,L,L,O,_,_,_],
  [_,_,_,O,L,L,L,L,L,O,_,_,_,_],
  [_,_,_,_,O,O,O,O,O,_,_,_,_,_],
]

const BARREL_DATA = [
  [_,_,_,_,O,O,O,_,_,_],
  [_,_,_,O,S,S,S,O,_,_],
  [_,_,O,W,W,W,W,W,O,_],
  [_,_,O,W,W,W,W,W,O,_],
  [_,O,W,W,R,R,W,W,W,O],
  [_,O,W,W,W,W,W,W,W,O],
  [_,O,W,W,W,W,W,W,W,O],
  [_,O,W,W,R,R,W,W,W,O],
  [_,O,W,W,W,W,W,W,W,O],
  [_,O,W,W,W,W,W,W,W,O],
  [_,O,W,W,R,R,W,W,W,O],
  [_,O,W,W,W,W,W,W,W,O],
  [_,_,O,W,W,W,W,W,O,_],
  [_,_,O,W,W,W,W,W,O,_],
  [_,_,_,O,O,O,O,O,_,_],
]

const STONE_W = 14
const STONE_H = 14
const BARREL_W = 10
const BARREL_H = 15
const SPRITE_SCALE = 3
const SPAWN_MIN = 0.8
const SPAWN_MAX = 2.5
const SPEED = 60

let _sprites = null
let _lastDpr = 0

function hexToRgba(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

function renderSprite(data, w, h, dpr, palette) {
  const scale = Math.round(SPRITE_SCALE * dpr)
  const src = document.createElement('canvas')
  src.width = w
  src.height = h
  const sctx = src.getContext('2d')
  const imgData = sctx.createImageData(w, h)

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = data[y][x]
      const color = palette[idx]
      const pi = (y * w + x) * 4
      if (color) {
        const { r, g, b } = hexToRgba(color)
        imgData.data[pi] = r
        imgData.data[pi + 1] = g
        imgData.data[pi + 2] = b
        imgData.data[pi + 3] = 255
      } else {
        imgData.data[pi + 3] = 0
      }
    }
  }

  sctx.putImageData(imgData, 0, 0)

  const dst = document.createElement('canvas')
  dst.width = w * scale
  dst.height = h * scale
  const dctx = dst.getContext('2d')
  dctx.imageSmoothingEnabled = false
  dctx.drawImage(src, 0, 0, w, h, 0, 0, w * scale, h * scale)

  return dst
}

function buildSprites(dpr) {
  const stoneCanvas = renderSprite(STONE_DATA, STONE_W, STONE_H, dpr, STONE_PAL)
  const barrelCanvas = renderSprite(BARREL_DATA, BARREL_W, BARREL_H, dpr, BARREL_PAL)

  const scale = Math.round(SPRITE_SCALE * dpr)
  _sprites = {
    stone: { canvas: stoneCanvas, w: STONE_W * scale, h: STONE_H * scale },
    barrel: { canvas: barrelCanvas, w: BARREL_W * scale, h: BARREL_H * scale },
  }
  _lastDpr = dpr
}

export function initObstacles(dpr) {
  if (dpr !== _lastDpr || !_sprites) {
    buildSprites(dpr)
  }
}

export function createObstacleSystem() {
  return {
    list: [],
    spawnTimer: 0,
    nextInterval: 0,
  }
}

function getNextInterval() {
  return SPAWN_MIN + Math.random() * (SPAWN_MAX - SPAWN_MIN)
}

export function updateObstacles(system, dt, dpr, canvasWidth) {
  if (dpr !== _lastDpr) buildSprites(dpr)

  const scale = Math.round(SPRITE_SCALE * dpr)

  system.spawnTimer += dt
  if (system.spawnTimer >= system.nextInterval) {
    system.spawnTimer = 0
    system.nextInterval = getNextInterval()

    const type = Math.random() < 0.5 ? 'stone' : 'barrel'
    const sprite = _sprites[type]
    system.list.push({
      type,
      x: canvasWidth,
    })
  }

  const speed = SPEED * dpr
  for (let i = system.list.length - 1; i >= 0; i--) {
    const obs = system.list[i]
    obs.x -= speed * dt
    const sprite = _sprites[obs.type]
    if (obs.x + sprite.w < 0) {
      system.list.splice(i, 1)
    }
  }
}

export function drawObstacles(ctx, system, state) {
  if (!_sprites) return

  const groundY = Math.round(state.height * 0.8)

  for (const obs of system.list) {
    const sprite = _sprites[obs.type]
    const y = groundY - sprite.h
    ctx.drawImage(sprite.canvas, obs.x, y, sprite.w, sprite.h)
  }
}
