import { getSpriteSheet } from './sprites.js'

const SKY_TOP = [58, 77, 112]
const SKY_BOTTOM = [107, 127, 163]
const GROUND_LINE = '#7a5c3a'
const GROUND_DARK = '#5a4228'
const GRASS = '#5a6e4a'
const GROUND_LINE_RGB = [122, 92, 58]
const GROUND_DARK_RGB = [90, 66, 40]

const GROUND_FRACTION = 0.8

const FRAME_DURATION = 0.12

let knightFrames = null

const state = {
  canvas: null,
  ctx: null,
  width: 0,
  height: 0,
  dpr: 1,
  animTime: 0,
  knightX: 0,
  knightY: 0,
  scale: 1,
  running: false,
}

function resize() {
  const w = window.innerWidth
  const h = window.innerHeight
  const dpr = window.devicePixelRatio || 1

  state.canvas.width = Math.round(w * dpr)
  state.canvas.height = Math.round(h * dpr)
  state.canvas.style.width = w + 'px'
  state.canvas.style.height = h + 'px'

  state.width = state.canvas.width
  state.height = state.canvas.height
  state.dpr = dpr
  state.ctx.setTransform(1, 0, 0, 1, 0, 0)

  const baseScreen = 1024
  if (w < 480) {
    state.scale = 2
  } else if (w <= baseScreen) {
    state.scale = 2
  } else {
    state.scale = 3
  }

  state.knightX = Math.round(state.width * 0.2)
}

function drawSky() {
  const { ctx, width, height } = state
  const grad = ctx.createLinearGradient(0, 0, 0, height * GROUND_FRACTION)
  grad.addColorStop(0, `rgb(${SKY_TOP[0]},${SKY_TOP[1]},${SKY_TOP[2]})`)
  grad.addColorStop(1, `rgb(${SKY_BOTTOM[0]},${SKY_BOTTOM[1]},${SKY_BOTTOM[2]})`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, width, Math.round(height * GROUND_FRACTION) + 1)

  const dpr = state.dpr
  ctx.fillStyle = 'rgba(244,233,208,0.08)'
  const cloudPositions = [
    [width * 0.1, height * 0.08, 60 * dpr, 16 * dpr],
    [width * 0.35, height * 0.12, 80 * dpr, 12 * dpr],
    [width * 0.65, height * 0.06, 50 * dpr, 14 * dpr],
    [width * 0.85, height * 0.15, 70 * dpr, 10 * dpr],
  ]
  for (const [cx, cy, cw, ch] of cloudPositions) {
    ctx.beginPath()
    ctx.ellipse(cx, cy, cw, ch, 0, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawGround() {
  const { ctx, width, height } = state
  const groundY = Math.round(height * GROUND_FRACTION)
  ctx.fillStyle = GROUND_LINE
  ctx.fillRect(0, groundY, width, Math.round(height * 0.2) + 1)

  ctx.fillStyle = GROUND_DARK
  ctx.fillRect(0, groundY + 10 * state.dpr, width, Math.round(height * 0.2) + 1)

  ctx.fillStyle = GRASS
  const dpr = state.dpr
  for (let i = 0; i < width; i += 12 * dpr) {
    const gx = i + ((state.animTime * 60 * dpr) % (12 * dpr))
    ctx.fillRect(gx, groundY - 3 * dpr, 2 * dpr, 3 * dpr)
    ctx.fillRect(gx + 5 * dpr, groundY - 2 * dpr, 2 * dpr, 2 * dpr)
  }
}

function drawKnight() {
  if (!knightFrames) return

  const { ctx, animTime, knightX, scale } = state
  const groundY = Math.round(state.height * GROUND_FRACTION)

  const frameIdx = Math.floor(animTime / FRAME_DURATION) % 4
  const frame = knightFrames[frameIdx]

  const s = scale * (BASE_SIZE / 48)
  const drawSize = 48 * s
  const x = knightX - drawSize / 2
  const y = groundY - drawSize + 4 * s

  ctx.imageSmoothingEnabled = false
  ctx.drawImage(frame, x, y, drawSize, drawSize)

  const shadowW = 20 * s
  const shadowH = 4 * s
  ctx.fillStyle = 'rgba(0,0,0,0.25)'
  ctx.beginPath()
  ctx.ellipse(knightX, groundY + 2 * s, shadowW / 2, shadowH / 2, 0, 0, Math.PI * 2)
  ctx.fill()
}

const BASE_SIZE = 48

function draw() {
  const { ctx, width, height } = state
  ctx.clearRect(0, 0, width, height)
  drawSky()
  drawGround()
  drawKnight()
}

function update(dt) {
  state.animTime += dt
}

export function start(canvas) {
  state.canvas = canvas
  state.ctx = canvas.getContext('2d')
  knightFrames = getSpriteSheet()
  resize()
  state.running = true

  window.addEventListener('resize', resize)

  let lastTime = 0
  function loop(timestamp) {
    if (!state.running) return
    const dt = lastTime ? Math.min((timestamp - lastTime) / 1000, 0.05) : 0.016
    lastTime = timestamp

    update(dt)
    draw()

    const groundY = Math.round(state.height * GROUND_FRACTION)
    const s = state.scale * (BASE_SIZE / 48)
    const drawSize = 48 * s
    const playerY = groundY - drawSize + 4 * s

    requestAnimationFrame(loop)
  }

  requestAnimationFrame(loop)
}

export function getPlayerPos() {
  const groundY = Math.round(state.height * GROUND_FRACTION)
  const s = state.scale * (BASE_SIZE / 48)
  const drawSize = 48 * s
  return {
    x: state.knightX,
    y: groundY - drawSize + 4 * s,
  }
}
