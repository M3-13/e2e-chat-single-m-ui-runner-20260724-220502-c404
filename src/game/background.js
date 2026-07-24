const TILE_W = 64
const TILE_H = 40
const FAR_SPEED = 20
const NEAR_SPEED = 50
const FAR_COLOR = '#4a5d78'
const NEAR_COLOR = '#5a6e4a'

let _tiles = null
let _lastDpr = 0

function farHeight(nx) {
  const hill = 0.35 + Math.sin(nx * 2 * Math.PI * 2 + 0.2) * 0.12
  const castleKeep = (nx > 0.32 && nx < 0.48) ? 0.3 : 0
  const tower1 = (nx > 0.25 && nx < 0.32) ? 0.15 : 0
  const tower2 = (nx > 0.48 && nx < 0.55) ? 0.15 : 0
  const tower3 = (nx > 0.7 && nx < 0.78) ? 0.1 : 0
  return Math.min(hill + castleKeep + tower1 + tower2 + tower3, 0.85)
}

function nearHeight(nx) {
  const hill = 0.4 + Math.sin(nx * 2 * Math.PI * 1 + 1) * 0.15 + Math.sin(nx * 2 * Math.PI * 2 + 3) * 0.05
  let trees = 0
  const treePositions = [0.08, 0.28, 0.52, 0.72, 0.92]
  for (const tp of treePositions) {
    const d = Math.abs(nx - tp)
    if (d < 0.07) {
      trees += (0.07 - d) / 0.07 * 0.18
    }
  }
  return Math.min(hill + trees, 0.85)
}

function buildTile(w, h, heightFunc, color) {
  const src = document.createElement('canvas')
  src.width = w
  src.height = h
  const sctx = src.getContext('2d')

  sctx.fillStyle = color
  sctx.beginPath()
  sctx.moveTo(0, h)
  for (let x = 0; x <= w; x++) {
    const nx = x / w
    const y = h - Math.round(heightFunc(nx) * h)
    sctx.lineTo(x, y)
  }
  sctx.lineTo(w, h)
  sctx.closePath()
  sctx.fill()

  return src
}

function buildTiles(dpr) {
  const w = TILE_W
  const h = TILE_H
  const scale = Math.round(dpr * 4)

  const farSrc = buildTile(w, h, farHeight, FAR_COLOR)
  const nearSrc = buildTile(w, h, nearHeight, NEAR_COLOR)

  const farDst = document.createElement('canvas')
  farDst.width = w * scale
  farDst.height = h * scale
  const fctx = farDst.getContext('2d')
  fctx.imageSmoothingEnabled = false
  fctx.drawImage(farSrc, 0, 0, w, h, 0, 0, w * scale, h * scale)

  const nearDst = document.createElement('canvas')
  nearDst.width = w * scale
  nearDst.height = h * scale
  const nctx = nearDst.getContext('2d')
  nctx.imageSmoothingEnabled = false
  nctx.drawImage(nearSrc, 0, 0, w, h, 0, 0, w * scale, h * scale)

  _tiles = { far: farDst, near: nearDst }
  _lastDpr = dpr
}

export function initBackground(dpr) {
  if (dpr !== _lastDpr || !_tiles) {
    buildTiles(dpr)
  }
}

export function drawBackground(ctx, state, scrollTime) {
  const { width, height, dpr } = state
  if (dpr !== _lastDpr || !_tiles) {
    buildTiles(dpr)
  }

  const groundY = Math.round(height * 0.8)
  const scale = Math.round(dpr * 4)
  const tileW = TILE_W * scale
  const tileH = TILE_H * scale

  const farOff = -((scrollTime * FAR_SPEED * dpr) % tileW)
  for (let x = farOff; x < width + tileW; x += tileW) {
    ctx.drawImage(_tiles.far, x, groundY - tileH + 8 * dpr)
  }

  const nearOff = -((scrollTime * NEAR_SPEED * dpr) % tileW)
  for (let x = nearOff; x < width + tileW; x += tileW) {
    ctx.drawImage(_tiles.near, x, groundY - tileH + 5 * dpr)
  }
}
