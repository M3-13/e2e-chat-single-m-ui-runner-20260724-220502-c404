const GRAVITY = 1600
const JUMP_VELOCITY = 850

export function createKnight() {
  return {
    y: 0,
    velocityY: 0,
    grounded: true,
  }
}

export function jump(knight) {
  if (!knight.grounded) return
  knight.velocityY = -JUMP_VELOCITY
  knight.grounded = false
}

export function updateKnight(knight, dt, dpr) {
  if (knight.grounded) {
    knight.velocityY = 0
    knight.y = 0
    return
  }

  knight.velocityY += GRAVITY * dpr * dt
  knight.y += knight.velocityY * dt

  if (knight.y >= 0) {
    knight.y = 0
    knight.velocityY = 0
    knight.grounded = true
  }
}

export function resetKnight(knight) {
  knight.y = 0
  knight.velocityY = 0
  knight.grounded = true
}
