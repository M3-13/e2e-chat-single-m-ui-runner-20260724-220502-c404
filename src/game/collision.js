const SPRITE_SCALE = 3

const STONE_W = 14
const STONE_H = 14
const BARREL_W = 10
const BARREL_H = 15

const INSETS = {
  stone: { x: 0.15, y: 0.1, w: 0.7, h: 0.8 },
  barrel: { x: 0.1, y: 0.08, w: 0.8, h: 0.84 },
}

export function checkCollision(knightX, knightY, knightW, knightH, obstacles, groundY, dpr) {
  const scale = Math.round(SPRITE_SCALE * dpr)

  const kx = knightX + knightW * 0.2
  const ky = knightY + knightH * 0.15
  const kw = knightW * 0.6
  const kh = knightH * 0.7

  if (kx + kw < 0 || ky + kh < 0) return false

  for (const obs of obstacles) {
    let obsW, obsH
    if (obs.type === 'stone') {
      obsW = STONE_W * scale
      obsH = STONE_H * scale
    } else {
      obsW = BARREL_W * scale
      obsH = BARREL_H * scale
    }

    const obsY = groundY - obsH
    const ins = INSETS[obs.type]

    const ox = obs.x + obsW * ins.x
    const oy = obsY + obsH * ins.y
    const ow = obsW * ins.w
    const oh = obsH * ins.h

    if (kx < ox + ow && kx + kw > ox && ky < oy + oh && ky + kh > oy) {
      return true
    }
  }

  return false
}
