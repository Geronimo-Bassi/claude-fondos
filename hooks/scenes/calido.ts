// A warm study desk in pixel art: cream paper with a dot grid and small desk
// things (plant, mug, notes, pencil, book, linked ideas) repeated as
// wallpaper, so whole ones show in whatever gutter Desktop leaves visible.
// Original art in a warm terracotta palette; no logos. Nothing animates.

import { pixels, scene, sizeOf, wallpaper } from '../kit.ts'
import type { Cells, Motif } from '../kit.ts'

const PLANT: Cells = [
  '.....g..g.....',
  '..g..gg.gg..g.',
  '..gg.Gg.gG.gg.',
  '...gGGggGGgG..',
  '.g..GgGGgGG..g',
  '.gg..GGGGG..gg',
  '..gGg.GGG.gGg.',
  '...GGgGGGgGG..',
  '.....GGGGG....',
  '...tttttttt...',
  '...TTTTTTTT...',
  '....tttttt....',
  '....tttttt....',
  '.....tttt.....',
]

const MUG: Cells = [
  '..s...s...s...',
  '...s...s...s..',
  '..s...s...s...',
  '..............',
  '.cccccccccc...',
  '.cCCCCCCCCcccc',
  '.cttttttttc..c',
  '.cttttttttc..c',
  '.cccccccccccc.',
  '.cccccccccc...',
  '..cccccccc....',
]

const PENCIL: Cells = [
  'eewwwwtttttttttttttttkk.',
  'eewwwwTTTTTTTTTTTTTTTkkl',
  'eewwwwtttttttttttttttkk.',
]

const BOOK: Cells = [
  'TTTTTTTTTTTT',
  'TttttttttttT',
  'Ttpppppppptl',
  'TtppiiiipptT',
  'TtpppppppptT',
  'TtppiiipptlT',
  'TtpppppppptT',
  'TtppiiiipptT',
  'TtpppppppptT',
  'TtttttttttTT',
  'TTTTTTTTTTTT',
]

const motif = (map: Cells, size: number): Motif => ({ svg: pixels(map, 0, 0, size), w: sizeOf(map, size).w })

// A stack of three note sheets with lines of writing, 84 px wide.
const NOTES: Motif = {
  w: 84,
  svg: [
    '<rect class="edge" x="10" y="0" width="74" height="92"/><rect class="sheet" x="12" y="2" width="70" height="88"/>',
    '<rect class="edge" x="5" y="5" width="74" height="92"/><rect class="sheet" x="7" y="7" width="70" height="88"/>',
    '<rect class="edge" x="0" y="10" width="74" height="92"/><rect class="sheet" x="2" y="12" width="70" height="88"/>',
    '<rect class="t" x="10" y="20" width="26" height="6"/>',
    ...[54, 44, 58, 34, 50, 40, 56].map((w, i) => `<rect class="ink" x="10" y="${34 + i * 9}" width="${w}" height="4"/>`),
  ].join(''),
}

// Ideas: a few nodes joined by lines, 90 px wide.
const IDEAS: Motif = (() => {
  const nodes: [number, number, string][] = [[0, 30, 't'], [36, 0, 'a'], [76, 22, 't'], [54, 64, 'a'], [8, 80, 't']]
  const links: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [0, 4]]
  let svg = ''
  for (const [a, b] of links) {
    const p = nodes[a]
    const q = nodes[b]
    if (p && q) svg += `<line class="link" x1="${p[0] + 7}" y1="${p[1] + 7}" x2="${q[0] + 7}" y2="${q[1] + 7}"/>`
  }
  for (const [x, y, c] of nodes) {
    svg += `<rect class="${c}" x="${x}" y="${y}" width="14" height="14"/><rect class="sheet" x="${x + 5}" y="${y + 5}" width="4" height="4"/>`
  }
  return { svg, w: 90 }
})()

const STYLE = `
.bg { fill: #f3eee3 }
.dot { fill: #e2d8c4 }
.sheet { fill: #fffdf8 }
.edge { fill: #d9cdb6 }
.ink { fill: #cfc3ad }
.t { fill: #d97757 }
.T { fill: #b85c3f }
.a { fill: #e3a869 }
.g { fill: #8fae6b }
.G { fill: #5f8048 }
.c { fill: #fbf6ec }
.C { fill: #8a5a3c }
.s { fill: #ddd3c1 }
.w { fill: #e9c89a }
.k { fill: #f2b5a8 }
.e { fill: #c9bfae }
.l { fill: #3b3630 }
.p { fill: #fbf6ec }
.i { fill: #d6c9b2 }
.link { stroke: #d8c9b0; stroke-width: 3 }
@media (prefers-color-scheme: dark) {
  .bg { fill: #24221f }
  .dot { fill: #33302a }
  .sheet { fill: #34312c }
  .edge { fill: #1c1a17 }
  .ink { fill: #4a463e }
  .t { fill: #b8644a }
  .T { fill: #8f4a35 }
  .a { fill: #a87a4b }
  .g { fill: #66804f }
  .G { fill: #485f38 }
  .c { fill: #45413a }
  .C { fill: #2a221c }
  .s { fill: #45413a }
  .w { fill: #9a8060 }
  .k { fill: #a97a70 }
  .e { fill: #625d54 }
  .l { fill: #cfc7b8 }
  .p { fill: #3b3833 }
  .i { fill: #57524a }
  .link { stroke: #48433c }
}`

export const sceneSvg = (size?: string): string =>
  scene(
    STYLE,
    [
      '<rect class="bg" width="100%" height="100%"/>',
      '<defs><pattern id="calido-dots" width="28" height="28" patternUnits="userSpaceOnUse"><rect class="dot" x="12" y="12" width="4" height="4"/></pattern></defs><rect width="100%" height="100%" fill="url(#calido-dots)"/>',
      wallpaper('calido-desk', [motif(PLANT, 6), motif(MUG, 6), IDEAS, NOTES, motif(PENCIL, 4), motif(BOOK, 7)], {
        opacity: 0.85,
      }),
    ],
    size,
  )

export const SCENE = sceneSvg()
