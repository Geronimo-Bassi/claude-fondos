// A night forest in pixel art, from crop-safe layers only: a banded night
// sky, stars and fireflies as wallpaper, and two rows of pines repeated
// sideways along the bottom over a strip of ground. Dark only; nothing animates.

import { bands, random, scene, strip, wallpaper } from '../kit.ts'
import type { Motif } from '../kit.ts'

const SKY = ['#070b16', '#0a1020', '#0d1529', '#101b31', '#132138', '#16283e', '#1a2f43', '#1d3546']

const CELL = 8

// One pine: tiers that widen downward with a notch every few rows, and a trunk.
const pine = (cx: number, base: number, rows: number, cls: string): string => {
  let out = ''
  for (let r = 0; r < rows; r++) {
    const half = 1 + Math.floor(r * 0.42) - (r > 2 && r % 4 === 0 ? 1 : 0)
    out += `<rect class="${cls}" x="${cx - half * CELL}" y="${base - (rows - r + 2) * CELL}" width="${(half * 2 + 1) * CELL}" height="${CELL}"/>`
  }
  out += `<rect class="trunk" x="${cx}" y="${base - 2 * CELL}" width="${CELL}" height="${2 * CELL}"/>`
  return out
}

// A row of pines in a tile `width` wide. A tree that crosses the tile's edge is
// drawn again one tile over, so the row wraps seamlessly when it repeats.
const pines = (width: number, height: number, seed: number, minRows: number, maxRows: number, cls: string): string => {
  const rand = random(seed)
  let out = ''
  for (let x = 0; x < width; x += 48 + Math.floor(rand() * 4) * CELL) {
    const rows = minRows + Math.floor(rand() * (maxRows - minRows + 1))
    const cx = Math.round(x / CELL) * CELL
    out += pine(cx, height, rows, cls) + pine(cx - width, height, rows, cls) + pine(cx + width, height, rows, cls)
  }
  return out
}

// Stars: a cross and a few dim cells. Fireflies: warm dots with a faint halo.
const stars = (seed: number): Motif => {
  const rand = random(seed)
  let svg = ''
  for (let i = 0; i < 6; i++) {
    const x = Math.floor((rand() * 84) / 6) * 6
    const y = Math.floor((rand() * 84) / 6) * 6
    svg +=
      i === 0
        ? `<rect class="star" x="${x}" y="${y + 4}" width="12" height="4"/><rect class="star" x="${x + 4}" y="${y}" width="4" height="12"/>`
        : `<rect class="dim" x="${x}" y="${y}" width="4" height="4"/>`
  }
  return { svg, w: 96 }
}

const fireflies = (seed: number): Motif => {
  const rand = random(seed)
  let svg = ''
  for (let i = 0; i < 3; i++) {
    const x = 6 + Math.floor((rand() * 72) / 6) * 6
    const y = 6 + Math.floor((rand() * 72) / 6) * 6
    svg += `<rect class="halo" x="${x - 6}" y="${y - 6}" width="18" height="18"/><rect class="fly" x="${x}" y="${y}" width="6" height="6"/>`
  }
  return { svg, w: 90 }
}

const STYLE = `
${SKY.map((c, i) => `.sky${i} { fill: ${c} }`).join('\n')}
.star { fill: #e8f0ff }
.dim { fill: #b9c8e8; opacity: 0.6 }
.fly { fill: #f4e27a }
.halo { fill: #f4e27a; opacity: 0.14 }
.far { fill: #12302f }
.near { fill: #0a1f1d }
.trunk { fill: #1d1510 }
.ground { fill: #08140f }
.moss { fill: #0f2a1d }`

const GROUND =
  '<rect class="ground" x="0" y="0" width="240" height="60"/>' +
  [0, 40, 96, 150, 200].map(x => `<rect class="moss" x="${x}" y="0" width="24" height="8"/>`).join('')

export const sceneSvg = (size?: string): string =>
  scene(
    STYLE,
    [
      bands(SKY.map((_, i) => `sky${i}`)),
      wallpaper('bosque-stars', [stars(3), stars(9), stars(15), stars(21)], { column: 220, row: 220 }),
      wallpaper('bosque-flies', [fireflies(4), fireflies(12)], { column: 300, row: 340, opacity: 0.9 }),
      strip('bosque-far', 'bottom', 300, 480, pines(480, 300, 7, 14, 22, 'far')),
      strip('bosque-near', 'bottom', 200, 528, pines(528, 200, 13, 10, 16, 'near')),
      strip('bosque-ground', 'bottom', 60, 240, GROUND),
    ],
    size,
  )

export const SCENE = sceneSvg()
