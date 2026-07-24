import { start, getPlayerPos } from './game/engine.js'

const canvas = document.getElementById('game-canvas')
start(canvas)

const TEST_API = {
  scene: null,
  player: { x: 0, y: 0 },
}

Object.defineProperty(window, '__TEST_API__', {
  value: Object.freeze(TEST_API),
  writable: false,
  configurable: false,
})

const initPos = getPlayerPos()
TEST_API.player.x = initPos.x
TEST_API.player.y = initPos.y

function updateTestApi() {
  const pos = getPlayerPos()
  TEST_API.player.x = pos.x
  TEST_API.player.y = pos.y
  requestAnimationFrame(updateTestApi)
}

requestAnimationFrame(updateTestApi)
