// A retro sunset in pixel art, built from crop-safe layers only: a banded sky,
// stars as wallpaper, a striped sun-glow along the horizon and two mountain
// ranges repeated sideways at the bottom. Nothing animates.

import { bands, random, scene, strip, wallpaper } from '../kit.ts'
import type { Motif } from '../kit.ts'

const SKY = ['#140b2b', '#1b0f38', '#241246', '#301654', '#3e1a5e', '#521f66', '#6a256c', '#84306f', '#9e3b70', '#b8476f', '#cf566b', '#e26a63']

const CELL = 12

// Heights in cells from a sum of whole sine waves, so a tile meets itself
// seamlessly when it repeats.
const ridge = (count: number, base: number, waves: [number, number][]): number[] =>
  Array.from({ length: count }, (_, i) =>
    Math.max(1, Math.round(base + waves.reduce((sum, [k, a]) => sum + a * Math.sin((2 * Math.PI * k * i) / count), 0))),
  )

const range = (heights: number[], height: number, cls: string): string =>
  heights
    .map((h, i) => `<rect class="${cls}" x="${i * CELL}" y="${height - h * CELL}" width="${CELL}" height="${h * CELL}"/>`)
    .join('')

// Sun-glow: horizontal stripes that thin out toward the horizon, full width.
const GLOW = ['sun0', 'sun1', 'sun2', 'sun3', 'sun4', 'sun5']
const glow = GLOW.map((c, i) => `<rect class="${c}" x="0" y="${i * 30}" width="480" height="${22 - i * 3}"/>`).join('')

// A few star clusters, each well under the wallpaper's motif limit.
const cluster = (seed: number): Motif => {
  const rand = random(seed)
  let svg = ''
  for (let i = 0; i < 7; i++) {
    const x = Math.floor((rand() * 84) / 6) * 6
    const y = Math.floor((rand() * 84) / 6) * 6
    svg +=
      i === 0
        ? `<rect class="star" x="${x}" y="${y + 6}" width="18" height="6"/><rect class="star" x="${x + 6}" y="${y}" width="6" height="18"/>`
        : `<rect class="dim" x="${x}" y="${y}" width="6" height="6"/>`
  }
  return { svg, w: 96 }
}

const STYLE = `
${SKY.map((c, i) => `.sky${i} { fill: ${c} }`).join('\n')}
.star { fill: #fff4d6 }
.dim { fill: #f3d9ff; opacity: 0.7 }
.sun0 { fill: #ffe66d } .sun1 { fill: #ffd166 } .sun2 { fill: #ffb85c }
.sun3 { fill: #ff9a56 } .sun4 { fill: #ff7b5c } .sun5 { fill: #ff5f6d }
.far { fill: #4a1f5c }
.near { fill: #2a1240 }`

export const sceneSvg = (size?: string): string =>
  scene(
    STYLE,
    [
      bands(SKY.map((_, i) => `sky${i}`)),
      wallpaper('atardecer-stars', [cluster(5), cluster(11), cluster(17), cluster(23)], { column: 220, row: 200 }),
      strip('atardecer-glow', 'bottom', 400, 480, glow),
      strip('atardecer-far', 'bottom', 300, 480, range(ridge(40, 12, [[1, 4], [3, 3], [5, 1.5]]), 300, 'far')),
      strip('atardecer-near', 'bottom', 170, 480, range(ridge(40, 7, [[2, 3], [4, 2], [7, 1]]), 170, 'near')),
    ],
    size,
  )

export const SCENE = sceneSvg()
