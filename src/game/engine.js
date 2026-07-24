import { getSpriteSheet } from './sprites.js'
import { createKnight, jump, updateKnight, resetKnight } from './knight.js'
import { setupInput } from './input.js'
import { initBackground, drawBackground } from './background.js'
import { initObstacles, createObstacleSystem, updateObstacles, drawObstacles } from './obstacles.js'
import { checkCollision } from './collision.js'

const SKY_TOP = [58, 77, 112]
const SKY_BOTTOM = [107, 127, 163]
const GROUND_LINE = '#7a5c3a'
const GROUND_DARK = '#5a4228'
const GRASS = '#5a6e4a'

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
  scale: 1,
  running: false,
  knight: null,
  obstacles: null,
  gameOver: false,
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
  initBackground(state.dpr)
  initObstacles(state.dpr)
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

  const { ctx, animTime, knightX, scale, knight } = state
  const groundY = Math.round(state.height * GROUND_FRACTION)

  const frameIdx = Math.floor(animTime / FRAME_DURATION) % 4
  const frame = knightFrames[knight.grounded ? frameIdx : 4]

  const s = scale * (BASE_SIZE / 48)
  const drawSize = 48 * s
  const x = knightX - drawSize / 2
  const y = groundY - drawSize + 4 * s + knight.y

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

function drawGameOver() {
  const { ctx, width, height } = state
  const cx = width / 2
  const cy = height / 2

  ctx.fillStyle = 'rgba(43,58,85,0.78)'
  ctx.fillRect(0, 0, width, height)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.lineWidth = 2

  ctx.font = '32px "Courier New", monospace'
  ctx.fillStyle = '#e0a83d'
  ctx.strokeStyle = '#1b2436'
  ctx.strokeText('GAME OVER', cx, cy - 60)
  ctx.fillText('GAME OVER', cx, cy - 60)

  ctx.font = '20px "Courier New", monospace'
  ctx.fillStyle = '#f4e9d0'
  ctx.strokeText('DISTANZ: 0000', cx, cy)
  ctx.fillText('DISTANZ: 0000', cx, cy)

  ctx.font = '12px "Courier New", monospace'
  ctx.fillStyle = '#8a94a8'
  ctx.strokeText('LEERTASTE / KLICK f\u00fcr Neustart', cx, cy + 60)
  ctx.fillText('LEERTASTE / KLICK f\u00fcr Neustart', cx, cy + 60)
}

function draw() {
  const { ctx, width, height, animTime } = state
  ctx.clearRect(0, 0, width, height)
  drawSky()
  drawBackground(ctx, state, animTime)
  drawGround()
  drawObstacles(ctx, state.obstacles, state)
  drawKnight()
  if (state.gameOver) drawGameOver()
}

function checkGameOver() {
  if (!state.obstacles || !state.obstacles.list.length) return
  const groundY = Math.round(state.height * GROUND_FRACTION)
  const s = state.scale * (BASE_SIZE / 48)
  const drawSize = 48 * s
  const kx = state.knightX - drawSize / 2
  const ky = groundY - drawSize + 4 * s + state.knight.y

  if (checkCollision(kx, ky, drawSize, drawSize, state.obstacles.list, groundY, state.dpr)) {
    state.gameOver = true
  }
}

function restartGame() {
  state.gameOver = false
  state.animTime = 0
  resetKnight(state.knight)
  state.obstacles.list = []
  state.obstacles.spawnTimer = 0
  state.obstacles.nextInterval = 1.5
}

function update(dt) {
  if (state.gameOver) return
  state.animTime += dt
  updateKnight(state.knight, dt, state.dpr)
  if (state.obstacles) {
    updateObstacles(state.obstacles, dt, state.dpr, state.width)
  }
  checkGameOver()
}

export function start(canvas) {
  state.canvas = canvas
  state.ctx = canvas.getContext('2d')
  knightFrames = getSpriteSheet()
  state.knight = createKnight()
  state.obstacles = createObstacleSystem()
  resize()
  initBackground(state.dpr)
  initObstacles(state.dpr)
  state.running = true

  setupInput(() => {
    if (state.gameOver) {
      restartGame()
    } else {
      jump(state.knight)
    }
  })
  window.addEventListener('resize', resize)

  let lastTime = 0
  function loop(timestamp) {
    if (!state.running) return
    const dt = lastTime ? Math.min((timestamp - lastTime) / 1000, 0.05) : 0.016
    lastTime = timestamp

    update(dt)
    draw()
    requestAnimationFrame(loop)
  }

  requestAnimationFrame(loop)
}

export function getScene() {
  if (!state.running) return null
  return state.gameOver ? 'gameover' : 'running'
}

export function getPlayerPos() {
  const groundY = Math.round(state.height * GROUND_FRACTION)
  const s = state.scale * (BASE_SIZE / 48)
  const drawSize = 48 * s
  return {
    x: state.knightX,
    y: groundY - drawSize + 4 * s + (state.knight ? state.knight.y : 0),
  }
}
