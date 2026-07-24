export function setupInput(onJump) {
  const onKeyDown = (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === ' ' || e.key === 'ArrowUp') {
      e.preventDefault()
      onJump()
    }
  }

  const onPointer = () => {
    onJump()
  }

  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('pointerdown', onPointer)
  window.addEventListener('touchstart', onPointer, { passive: true })

  return function teardownInput() {
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('pointerdown', onPointer)
    window.removeEventListener('touchstart', onPointer)
  }
}
