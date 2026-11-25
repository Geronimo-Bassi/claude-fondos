import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, ThemeSetArgs } from 'claude-code'

import type { Limit, LookName } from '../types'
import { makeColors } from './make-colors.js'
import { SCENE as ATARDECER } from './scenes/atardecer.ts'
import { SCENE as BIBLIOTECA } from './scenes/biblioteca.ts'
import { SCENE as BOSQUE } from './scenes/bosque.ts'
import { SCENE as CALIDO } from './scenes/calido.ts'
import { fragment, TERMINAL_PROFILES } from './terminal.ts'

// Each look: its colors, its still scene, and the colors of the usage bar.
type Look = {
  label: string
  scene: string
  alt: string
  colors: ReturnType<typeof makeColors>
  overrideColorScheme?: 'light' | 'dark'
  bar: { icon: string; iconColor: string; text: string; muted: string; strong: string }
}

const LOOKS: Record<Exclude<LookName, 'apagado'>, Look> = {
  // Warm paper and terracotta, in both modes.
  calido: {
    label: 'Cálido',
    scene: CALIDO,
    alt: 'Escritorio cálido en pixel art: notas, lápiz, planta, taza e ideas conectadas',
    colors: makeColors({
      label: 'Cálido',
      roles: { accent: '#c96442', danger: '#b5402f', success: '#5f8048', warning: '#b7791f', pro: '#7d5ba6' },
      light: {
        gray: {
          anchors: {
            'surface-0': '#efe9dc',
            'surface-1': '#f5f0e6',
            'surface-2': '#faf7f0',
            'text-primary': '#2b2620',
            'text-secondary': '#524a3f',
            'text-muted': '#6b6153',
          },
        },
      },
      dark: {
        gray: {
          anchors: {
            'surface-0': '#1f1d1a',
            'surface-1': '#272522',
            'surface-2': '#2e2b27',
            'surface-3': '#34312c',
            'text-primary': '#f2ede4',
            'text-secondary': '#d3cbbd',
            'text-muted': '#aea596',
          },
        },
      },
    }),
    bar: { icon: '✎', iconColor: '#d97757', text: '#8a7f6e', muted: '#9a8f7d', strong: '#d97757' },
  },
  // Deep violet for the retro sunset, dark only.
  atardecer: {
    label: 'Atardecer retro',
    scene: ATARDECER,
    alt: 'Atardecer retro en pixel art: sol a rayas, estrellas y montañas',
    colors: makeColors({
      label: 'Atardecer retro',
      only: 'dark',
      roles: { accent: '#ff6fb5', danger: '#ff4d6d', success: '#5ee0a0', warning: '#ffb347', pro: '#9d7bff' },
      dark: {
        gray: {
          anchors: {
            'surface-0': '#170d2c',
            'surface-1': '#1f1238',
            'surface-2': '#271742',
            'surface-3': '#2d1a4b',
            'text-primary': '#f8ecff',
            'text-secondary': '#dcc8f0',
            'text-muted': '#b8a2d4',
          },
        },
      },
    }),
    bar: { icon: '☀', iconColor: '#ffd166', text: '#dcc8f0', muted: '#b8a2d4', strong: '#f8ecff' },
  },
  // Night forest: deep blue-green, dark only.
  bosque: {
    label: 'Bosque nocturno',
    scene: BOSQUE,
    alt: 'Bosque nocturno en pixel art: pinos, estrellas y luciérnagas',
    colors: makeColors({
      label: 'Bosque nocturno',
      only: 'dark',
      roles: { accent: '#7fd1a8', danger: '#ff6b6b', success: '#8fd16a', warning: '#f4e27a', pro: '#a8a4ff' },
      dark: {
        gray: {
          anchors: {
            'surface-0': '#0b1418',
            'surface-1': '#101c20',
            'surface-2': '#142327',
            'surface-3': '#18292d',
            'text-primary': '#e8f2ee',
            'text-secondary': '#c3d6cf',
            'text-muted': '#9db5ad',
          },
        },
      },
    }),
    bar: { icon: '🌲', iconColor: '#7fd1a8', text: '#c3d6cf', muted: '#9db5ad', strong: '#f4e27a' },
  },
  // Library: parchment by day, lamp-lit dark wood by night.
  biblioteca: {
    label: 'Biblioteca',
    scene: BIBLIOTECA,
    alt: 'Biblioteca en pixel art: estantes con libros, velas, un globo terráqueo y libros abiertos',
    colors: makeColors({
      label: 'Biblioteca',
      roles: { accent: '#9a5b2e', danger: '#b5483c', success: '#4f7d4c', warning: '#b8862b', pro: '#7a4f8f' },
      light: {
        gray: {
          anchors: {
            'surface-0': '#ece0c8',
            'surface-1': '#f2e8d4',
            'surface-2': '#f8f1e3',
            'text-primary': '#2a1f16',
            'text-secondary': '#4f3f30',
            'text-muted': '#6a5643',
          },
        },
      },
      dark: {
        gray: {
          anchors: {
            'surface-0': '#17110d',
            'surface-1': '#1f1712',
            'surface-2': '#261d16',
            'surface-3': '#2c221a',
            'text-primary': '#f3e9da',
            'text-secondary': '#d6c7b1',
            'text-muted': '#b1a089',
          },
        },
      },
    }),
    bar: { icon: '📚', iconColor: '#c9743a', text: '#8a7258', muted: '#9a8670', strong: '#c9743a' },
  },
}

const NAMES = Object.keys(LOOKS) as Exclude<LookName, 'apagado'>[]

const limits = atom({ plugin: 'fondos', key: 'limits' } as const, [] as Limit[])
const current = atom({ plugin: 'fondos', key: 'look' } as const, 'calido' as LookName)

const isLookName = (value: unknown): value is LookName =>
  value === 'apagado' || (typeof value === 'string' && value in LOOKS)

// Themes are drawn by the desktop and mobile apps only. In a terminal the
// theme draws nothing, and an older Claude Code has no `$.theme` at all (a
// TypeError here); the usage bar is all the mod shows there, so both stay
// quiet. Anything else is a real failure and is logged.
async function applyLook($: EngineInterface, name: LookName): Promise<void> {
  try {
    if (name === 'apagado') {
      await $.theme.clear()
      return
    }
    const look = LOOKS[name]
    const unpainted = look.colors.problems.find(line => line.startsWith("Desktop won't paint"))
    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    const args: ThemeSetArgs = {
      colors: look.colors.theme,
      backdrop: { scene: name, glass: { blur: 10, opacity: 0.6 } },
    }
    await $.theme.set(args)
  } catch (error) {
    if (!(error instanceof TypeError)) {
      $.ui.log(`fondos: no se pudo cambiar el tema (${String(error)})`)
    }
  }
}

// "en 2 h 10 min", "en 3 d 4 h": relative, so no time zone is needed.
const until = (resetsAt: string | undefined, now: number): string => {
  if (resetsAt === undefined) return ''
  const mins = Math.max(0, Math.round((Date.parse(resetsAt) - now) / 60_000))
  if (Number.isNaN(mins)) return ''
  const d = Math.floor(mins / 1440)
  const h = Math.floor((mins % 1440) / 60)
  const m = mins % 60
  return d > 0 ? `en ${d} d ${h} h` : h > 0 ? `en ${h} h ${m} min` : `en ${m} min`
}

const meter = (pct: number): string => {
  const full = Math.max(0, Math.min(10, Math.round(pct / 10)))
  return '■'.repeat(full) + '□'.repeat(10 - full)
}

const tone = (pct: number): string => (pct >= 90 ? '#e5484d' : pct >= 70 ? '#e0a030' : '#4caf7a')

const WINDOWS: Record<string, string> = { five_hour: '5 h', seven_day: '7 d' }

const HELP = `Fondos: ${NAMES.join(', ')}, apagado. Ejemplo: /fondo ${NAMES[0]}. En Windows: /fondo terminal`

// A Windows path from its parts, every separator a backslash.
const BACKSLASH = String.fromCharCode(92)
const winPath = (...parts: string[]): string => parts.join(BACKSLASH).replaceAll('/', BACKSLASH)

// Runs a PowerShell line with the given variables, for what $.fs cannot do:
// copying the PNGs (it writes text only) and removing files.
async function powershell($: EngineInterface, script: string, env: Record<string, string>): Promise<void> {
  const { exitCode, stderr } = await $.process.run(
    ['powershell.exe', '-NoProfile', '-NonInteractive', '-Command', script],
    { env },
  )
  if (exitCode !== 0) {
    throw new Error(stderr.trim() || `PowerShell terminó con ${exitCode}`)
  }
}

// /fondo terminal: copies the images to the plugin's data folder and writes a
// Windows Terminal fragment with one profile and color scheme per look.
// /fondo terminal quitar: removes both. Windows only.
async function terminalSetup($: EngineInterface, remove: boolean): Promise<string> {
  const local = await $.env.get('LOCALAPPDATA')
  if (local === undefined || local === '') {
    return 'Esto es solo para Windows Terminal, en Windows.'
  }
  const fragmentDir = winPath(local, 'Microsoft', 'Windows Terminal', 'Fragments', 'claude-fondos')
  const { CLAUDE_PLUGIN_DATA: data } = await $.process.hookEnv()
  const imageDir = data ? winPath(data, 'terminal') : winPath(local, 'claude-fondos', 'terminal')

  try {
    if (remove) {
      await powershell(
        $,
        'Remove-Item -LiteralPath $env:FONDOS_FRAGMENT, $env:FONDOS_IMAGES -Recurse -Force -ErrorAction SilentlyContinue; exit 0',
        { FONDOS_FRAGMENT: fragmentDir, FONDOS_IMAGES: imageDir },
      )
      return 'Listo, saqué los perfiles "Claude …" de Windows Terminal. Cerralo y abrilo de nuevo para que desaparezcan.'
    }

    await powershell(
      $,
      'New-Item -ItemType Directory -Force -Path $env:FONDOS_IMAGES | Out-Null; Copy-Item -Path (Join-Path $env:FONDOS_SOURCE "*.png") -Destination $env:FONDOS_IMAGES -Force',
      { FONDOS_SOURCE: winPath($.plugin.root, 'assets', 'terminal'), FONDOS_IMAGES: imageDir },
    )
    await $.fs.write(winPath(fragmentDir, 'claude-fondos.json'), fragment(imageDir))
  } catch (error) {
    return `No pude ${remove ? 'quitar' : 'instalar'} los perfiles de Windows Terminal: ${error instanceof Error ? error.message : String(error)}`
  }

  return [
    `Listo, instalé ${TERMINAL_PROFILES.length} perfiles en Windows Terminal: ${TERMINAL_PROFILES.join(', ')}.`,
    'Cerrá Windows Terminal del todo y abrilo de nuevo; después tocá la flechita ⌄ al lado de la pestaña y elegí uno. Abre Claude con ese fondo.',
    'Para sacarlos: /fondo terminal quitar',
  ].join(String.fromCharCode(10))
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'fondo',
      description: 'Cambia el fondo y el tema (o lo apaga)',
      argumentHint: `[${[...NAMES, 'apagado', 'terminal'].join('|')}]`,
    })

    const stored = await $.store.get('look')
    const name: LookName = isLookName(stored) ? stored : 'calido'
    await update($, current, () => name)
    await applyLook($, name)

    const usage = await $.session.usage()
    await update($, limits, () => usage.rateLimits.map(l => ({ ...l })))

    return next(e)
  })

  // Pushed by the engine when a window moves a whole point: no timer.
  on('session.measure', async ($, e, next) => {
    if (e.changed.includes('rateLimits')) {
      await update($, limits, () => e.rateLimits.map(l => ({ ...l })))
    }

    return next(e)
  })

  // /fondo calido · /fondo atardecer · /fondo apagado · /fondo (lists them)
  on('command.run', { command: 'fondo' }, async ($, e) => {
    const wanted = e.args.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

    if (wanted === '') {
      const now = await read($, current)
      return { text: `Fondo actual: ${now}. ${HELP}` }
    }
    if (wanted === 'terminal' || wanted === 'terminal quitar') {
      return { text: await terminalSetup($, wanted === 'terminal quitar') }
    }
    if (!isLookName(wanted)) {
      return { text: `No conozco el fondo "${wanted}". ${HELP}` }
    }

    await $.store.set('look', wanted)
    await update($, current, () => wanted)
    await applyLook($, wanted)

    return {
      text: wanted === 'apagado' ? 'Fondos apagados. Escribí /fondo calido para volver.' : `Fondo: ${LOOKS[wanted].label}`,
    }
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const name = await read($, current)
    if (e.props.hasSurvey || name === 'apagado') {
      return next(e)
    }

    const { bar } = LOOKS[name]
    const { Box, Text } = $.ui.resolve(e)
    const list = await read($, limits)

    if (list.length === 0) {
      return (
        <Box>
          <Text color={bar.muted}>{bar.icon} Uso de Claude: aparece después de la primera respuesta</Text>
        </Box>
      )
    }

    const now = await $.clock.now()

    return (
      <Box flexDirection="row">
        <Text color={bar.iconColor}>{bar.icon} </Text>
        {list.map(l => (
          <Box key={l.kind} flexDirection="row">
            <Text color={bar.text}>{WINDOWS[l.kind] ?? l.kind} </Text>
            <Text color={tone(l.percentUsed)}>{meter(l.percentUsed)}</Text>
            <Text color={bar.strong}> {Math.round(l.percentUsed)}%</Text>
            <Text color={bar.muted}> · reinicia {until(l.resetsAt, now)}   </Text>
          </Box>
        ))}
      </Box>
    )
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    const name = e.props.scene
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || !isLookName(name) || name === 'apagado') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)
    const look = LOOKS[name]

    return <Svg source={look.scene} alt={look.alt} />
  })
}
