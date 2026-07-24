const _ = 0
const O = 1
const A = 2
const D = 3
const T = 4
const G = 5
const B = 6

const PALETTE = [
  null,
  '#1b2436',
  '#c9d1dc',
  '#8a94a8',
  '#a8332e',
  '#e0a83d',
  '#5a4228',
]

const FRAME_DATA = [
  [
    [_,_,_,_,_,G,G,_,_,_,_,_,_,_],
    [_,_,_,_,G,O,O,G,_,_,_,_,_,_],
    [_,_,_,O,O,A,A,O,O,_,_,_,_,_],
    [_,_,O,O,A,A,A,A,O,O,_,_,_,_],
    [_,_,O,O,A,_,_,A,O,O,_,_,_,_],
    [_,_,O,O,A,A,A,A,A,O,O,_,_,_],
    [_,O,O,O,A,A,A,A,A,O,O,O,_,_],
    [_,O,T,T,T,T,T,T,T,T,T,O,_,_],
    [_,O,T,T,A,A,A,A,A,T,T,O,_,_],
    [_,O,T,A,A,A,A,A,A,A,T,O,_,_],
    [_,O,T,T,A,A,A,A,A,T,T,O,_,_],
    [_,_,O,T,T,T,T,T,T,T,O,_,_,_],
    [_,_,_,O,T,T,T,T,T,O,_,_,_,_],
    [_,_,_,_,O,T,_,_,T,O,_,_,_,_,_],
    [_,_,_,_,O,T,_,_,T,O,_,_,_,_,_],
    [_,_,_,_,O,B,_,_,B,O,_,_,_,_,_],
  ],
  [
    [_,_,_,_,_,G,G,_,_,_,_,_,_,_],
    [_,_,_,_,G,O,O,G,_,_,_,_,_,_],
    [_,_,_,O,O,A,A,O,O,_,_,_,_,_],
    [_,_,O,O,A,A,A,A,O,O,_,_,_,_],
    [_,_,O,O,A,_,_,A,O,O,_,_,_,_],
    [_,_,O,O,A,A,A,A,A,O,O,_,_,_],
    [_,O,O,O,A,A,A,A,A,O,O,O,_,_],
    [_,O,T,T,T,T,T,T,T,T,T,O,_,_],
    [_,O,T,T,A,A,A,A,A,T,T,O,_,_],
    [_,O,T,A,A,A,A,A,A,A,T,O,_,_],
    [_,O,T,T,A,A,A,A,A,T,T,O,_,_],
    [_,_,O,T,T,T,T,T,T,T,O,_,_,_],
    [_,_,_,O,T,T,T,T,T,O,_,_,_,_],
    [_,_,_,_,O,T,_,T,O,_,_,_,_,_],
    [_,_,_,_,O,T,_,T,O,_,_,_,_,_],
    [_,_,_,_,_,O,B,B,O,_,_,_,_,_],
  ],
  [
    [_,_,_,_,_,G,G,_,_,_,_,_,_,_],
    [_,_,_,_,G,O,O,G,_,_,_,_,_,_],
    [_,_,_,O,O,A,A,O,O,_,_,_,_,_],
    [_,_,O,O,A,A,A,A,O,O,_,_,_,_],
    [_,_,O,O,A,_,_,A,O,O,_,_,_,_],
    [_,_,O,O,A,A,A,A,A,O,O,_,_,_],
    [_,O,O,O,A,A,A,A,A,O,O,O,_,_],
    [_,O,T,T,T,T,T,T,T,T,T,O,_,_],
    [_,O,T,T,A,A,A,A,A,T,T,O,_,_],
    [_,O,T,A,A,A,A,A,A,A,T,O,_,_],
    [_,O,T,T,A,A,A,A,A,T,T,O,_,_],
    [_,_,O,T,T,T,T,T,T,T,O,_,_,_],
    [_,_,_,O,T,T,T,T,T,O,_,_,_,_],
    [_,_,_,O,T,_,_,T,O,_,_,_,_,_],
    [_,_,_,O,T,_,_,T,O,_,_,_,_,_],
    [_,_,_,_,O,B,B,O,_,_,_,_,_,_],
  ],
  [
    [_,_,_,_,_,G,G,_,_,_,_,_,_,_],
    [_,_,_,_,G,O,O,G,_,_,_,_,_,_],
    [_,_,_,O,O,A,A,O,O,_,_,_,_,_],
    [_,_,O,O,A,A,A,A,O,O,_,_,_,_],
    [_,_,O,O,A,_,_,A,O,O,_,_,_,_],
    [_,_,O,O,A,A,A,A,A,O,O,_,_,_],
    [_,O,O,O,A,A,A,A,A,O,O,O,_,_],
    [_,O,T,T,T,T,T,T,T,T,T,O,_,_],
    [_,O,T,T,A,A,A,A,A,T,T,O,_,_],
    [_,O,T,A,A,A,A,A,A,A,T,O,_,_],
    [_,O,T,T,A,A,A,A,A,T,T,O,_,_],
    [_,_,O,T,T,T,T,T,T,T,O,_,_,_],
    [_,_,_,O,T,T,T,T,T,O,_,_,_,_],
    [_,_,_,_,O,T,_,T,O,_,_,_,_,_],
    [_,_,_,_,O,T,_,T,O,_,_,_,_,_],
    [_,_,_,_,_,O,B,B,O,_,_,_,_,_],
  ],
  [
    [_,_,_,_,_,G,G,_,_,_,_,_,_,_],
    [_,_,_,_,G,O,O,G,_,_,_,_,_,_],
    [_,_,_,O,O,A,A,O,O,_,_,_,_,_],
    [_,_,O,O,A,A,A,A,O,O,_,_,_,_],
    [_,_,O,O,A,_,_,A,O,O,_,_,_,_],
    [_,_,O,O,A,A,A,A,A,O,O,_,_,_],
    [_,O,O,O,A,A,A,A,A,O,O,O,_,_],
    [_,O,T,T,T,T,T,T,T,T,T,O,_,_],
    [_,O,T,T,A,A,A,A,A,T,T,O,_,_],
    [_,O,T,A,A,A,A,A,A,A,T,O,_,_],
    [_,O,T,T,A,A,A,A,A,T,T,O,_,_],
    [_,_,O,T,T,T,T,T,T,T,O,_,_,_],
    [_,_,_,O,T,T,T,T,T,O,_,_,_,_],
    [_,_,_,_,O,T,O,T,O,_,_,_,_,_],
    [_,_,_,_,O,B,O,B,O,_,_,_,_,_],
    [_,_,_,_,_,O,O,O,_,_,_,_,_,_],
  ],
]

const SPRITE_W = 14
const SPRITE_H = 16
const BASE_SIZE = 48

let frameCanvases = null

function hexToRgba(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

export function getSpriteSheet() {
  if (frameCanvases) return frameCanvases

  frameCanvases = FRAME_DATA.map((frame) => {
    const src = document.createElement('canvas')
    src.width = SPRITE_W
    src.height = SPRITE_H
    const sctx = src.getContext('2d')
    const imgData = sctx.createImageData(SPRITE_W, SPRITE_H)

    for (let y = 0; y < SPRITE_H; y++) {
      for (let x = 0; x < SPRITE_W; x++) {
        const idx = frame[y][x]
        const color = PALETTE[idx]
        const pi = (y * SPRITE_W + x) * 4
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
    dst.width = BASE_SIZE
    dst.height = BASE_SIZE
    const dctx = dst.getContext('2d')
    dctx.imageSmoothingEnabled = false
    const scaleX = BASE_SIZE / SPRITE_W
    const scaleY = BASE_SIZE / SPRITE_H
    dctx.drawImage(src, 0, 0, SPRITE_W, SPRITE_H, 0, 0, BASE_SIZE, BASE_SIZE)

    return dst
  })

  return frameCanvases
}
