const SCORE_RATE = 10

export function createScore() {
  return { value: 0 }
}

export function updateScore(score, dt) {
  score.value += SCORE_RATE * dt
}

export function resetScore(score) {
  score.value = 0
}

export function getScoreText(score) {
  return String(Math.floor(score.value)).padStart(4, '0')
}

export function getScoreValue(score) {
  return Math.floor(score.value)
}
