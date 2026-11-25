// A library in pixel art, from crop-safe layers only: a paneled wall, small
// library things (a bookcase, a stack of books, a candle, a globe, an open
// book) as wallpaper, and a long bookshelf repeated along the bottom.
// Parchment walls by day, lamp-lit dark wood by night; nothing animates.

import { pixels, random, scene, sizeOf, strip, wallpaper } from '../kit.ts'
import type { Cells, Motif } from '../kit.ts'

// Book spines take one of these letters; each is a CSS class.
const SPINES = ['r', 'b', 'g', 'y', 'p', 'o']

const BOOKCASE: Cells = [
  'WWWWWWWWWWWWWWWW',
  'WrrbbgyyrpbbgoyW',
  'WrrbbgyyrpbbgoyW',
  'WrrbbgyyrpbbgoyW',
  'WWWWWWWWWWWWWWWW',
  'WgoyyrbbpgrryyW.',
  'WgoyyrbbpgrryyWW',
  'WgoyyrbbpgrryyWW',
  'WWWWWWWWWWWWWWWW',
  'WbbppgryyobbrgpW',
  'WbbppgryyobbrgpW',
  'WbbppgryyobbrgpW',
  'WWWWWWWWWWWWWWWW',
  'WW............WW',
]

const STACK: Cells = [
  '...rrrrrrrrr',
  '...rqqqqqqqr',
  '..bbbbbbbbbb',
  '..bqqqqqqqqb',
  'gggggggggg..',
  'gqqqqqqqqg..',
  '.yyyyyyyyyy.',
  '.yqqqqqqqqy.',
]

const CANDLE: Cells = [
  '...f..',
  '..fF..',
  '..fF..',
  '...k..',
  '..cc..',
  '..cc..',
  '..cc..',
  '..cc..',
  '..cc..',
  '.hhhh.',
  'hhhhhh',
]

const GLOBE: Cells = [
  '...ssss...',
  '..sggsss..',
  '.sggssggs.',
  'hsssgggss.',
  'h.ssggsss.',
  'hssssgsgs.',
  '.hsgsssss.',
  '..hsssss..',
  '...hhhh...',
  '....hh....',
  '..hhhhhh..',
]

const OPEN_BOOK: Cells = [
  '.qqqqq..qqqqq.',
  'qqiiqqq.qqiiqq',
  'qqqqqqqqqqqqqq',
  'qqiiiqqqqiiiqq',
  'qqqqqqqqqqqqqq',
  'qqiiqqqqqqiiqq',
  'rrrrrrrrrrrrrr',
]

const motif = (map: Cells, size: number): Motif => ({ svg: pixels(map, 0, 0, size), w: sizeOf(map, size).w })

// The long shelf: two boards with spines of varying height, color and width.
const shelf = (width: number, height: number): string => {
  const rand = random(31)
  let out = `<rect class="W" x="0" y="0" width="${width}" height="${height}"/>`
  for (const top of [12, 92]) {
    out += `<rect class="back" x="0" y="${top}" width="${width}" height="68"/>`
    let x = 0
    while (x < width - 4) {
      const w = 10 + Math.floor(rand() * 3) * 4
      const h = 44 + Math.floor(rand() * 6) * 4
      const cls = SPINES[Math.floor(rand() * SPINES.length)] ?? 'r'
      const lean = rand() < 0.08
      if (!lean && x + w <= width) {
        out += `<rect class="${cls}" x="${x}" y="${top + 68 - h}" width="${w}" height="${h}"/>`
        out += `<rect class="q" x="${x + 2}" y="${top + 68 - h + 8}" width="${w - 4}" height="4"/>`
      }
      x += w + (lean ? 8 : 2)
    }
  }
  return out
}

const STYLE = `
.wall { fill: #efe3cc }
.panel { fill: #e6d6b8 }
.W { fill: #8a5a34 }
.back { fill: #6e4527 }
.r { fill: #b5483c }
.b { fill: #3f6a9a }
.g { fill: #4f7d4c }
.y { fill: #d0a33c }
.p { fill: #7a4f8f }
.o { fill: #c9743a }
.q { fill: #f3ead6 }
.i { fill: #c8b894 }
.c { fill: #f3ead6 }
.f { fill: #f2b544 }
.F { fill: #ffe08a }
.k { fill: #3b2a1e }
.h { fill: #8a5a34 }
.s { fill: #7fb0c9 }
@media (prefers-color-scheme: dark) {
  .wall { fill: #1c1511 }
  .panel { fill: #221a14 }
  .W { fill: #4a3020 }
  .back { fill: #2e1d13 }
  .r { fill: #7d3229 }
  .b { fill: #2b4a6b }
  .g { fill: #375836 }
  .y { fill: #8f7029 }
  .p { fill: #543765 }
  .o { fill: #8a4f28 }
  .q { fill: #b9ac92 }
  .i { fill: #7c6f58 }
  .c { fill: #c9bc9f }
  .f { fill: #f2b544 }
  .F { fill: #ffe08a }
  .h { fill: #5a3a24 }
  .s { fill: #4c6f82 }
}`

// Wood paneling: tall panels in a slightly different shade, as texture.
const PANELS =
  '<defs><pattern id="biblioteca-panels" width="120" height="240" patternUnits="userSpaceOnUse"><rect class="panel" x="12" y="12" width="96" height="216"/></pattern></defs><rect width="100%" height="100%" fill="url(#biblioteca-panels)"/>'

export const sceneSvg = (size?: string): string =>
  scene(
    STYLE,
    [
      '<rect class="wall" width="100%" height="100%"/>',
      PANELS,
      wallpaper(
        'biblioteca-things',
        [motif(BOOKCASE, 6), motif(CANDLE, 7), motif(GLOBE, 7), motif(STACK, 7), motif(OPEN_BOOK, 6), motif(CANDLE, 7)],
        { opacity: 0.8 },
      ),
      strip('biblioteca-shelf', 'bottom', 172, 480, shelf(480, 172)),
    ],
    size,
  )

export const SCENE = sceneSvg()
