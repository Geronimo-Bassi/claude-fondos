// Windows Terminal: one color scheme and one profile per look, written as a
// fragment Windows Terminal picks up when it starts. The background images
// sit in the plugin's data folder, so they outlive plugin updates.

type Scheme = Record<string, string>

const scheme = (name: string, c: string[]): Scheme => {
  const keys = [
    'background', 'foreground', 'cursorColor', 'selectionBackground',
    'black', 'red', 'green', 'yellow', 'blue', 'purple', 'cyan', 'white',
    'brightBlack', 'brightRed', 'brightGreen', 'brightYellow',
    'brightBlue', 'brightPurple', 'brightCyan', 'brightWhite',
  ]
  return Object.fromEntries([['name', name], ...keys.map((k, i) => [k, c[i]])])
}

const PROFILES = [
  {
    look: 'calido',
    title: 'Claude ✎ Cálido',
    opacity: 0.35,
    scheme: scheme('Fondos · Cálido', [
      '#1F1D1A', '#F2EDE4', '#D97757', '#4A4239',
      '#1F1D1A', '#D9614C', '#8FAE6B', '#E3A869', '#7A9CC6', '#B08AC9', '#7FB5A8', '#D3CBBD',
      '#6B6153', '#E8826E', '#A9C487', '#F0C38A', '#9AB6DA', '#C7A6DB', '#9CCDC0', '#F2EDE4',
    ]),
  },
  {
    look: 'atardecer',
    title: 'Claude ☀ Atardecer',
    opacity: 0.3,
    scheme: scheme('Fondos · Atardecer', [
      '#170D2C', '#F8ECFF', '#FF6FB5', '#3A2560',
      '#170D2C', '#FF4D6D', '#5EE0A0', '#FFD166', '#7AA2FF', '#C17BFF', '#5ED6E0', '#DCC8F0',
      '#6A5A8A', '#FF7A93', '#8AF0BE', '#FFE08A', '#A3BEFF', '#D7A6FF', '#8CE6EE', '#F8ECFF',
    ]),
  },
  {
    look: 'bosque',
    title: 'Claude 🌲 Bosque',
    opacity: 0.45,
    scheme: scheme('Fondos · Bosque', [
      '#0B1418', '#E8F2EE', '#F4E27A', '#1E3A3A',
      '#0B1418', '#FF6B6B', '#7FD1A8', '#F4E27A', '#6FA8DC', '#A8A4FF', '#6FCFC4', '#C3D6CF',
      '#4D6660', '#FF8F8F', '#A3E3C2', '#F8EDA3', '#95C2EA', '#C4C1FF', '#97E0D8', '#E8F2EE',
    ]),
  },
  {
    look: 'biblioteca',
    title: 'Claude 📚 Biblioteca',
    opacity: 0.4,
    scheme: scheme('Fondos · Biblioteca', [
      '#17110D', '#F3E9DA', '#C9743A', '#3A2C20',
      '#17110D', '#C25A4A', '#7FA36B', '#D0A33C', '#6F8FB5', '#9C78B0', '#7AA8A0', '#D6C7B1',
      '#6A5643', '#D97A6A', '#9DBE89', '#E3BE66', '#93AECF', '#B898C9', '#9CC2BB', '#F3E9DA',
    ]),
  },
]

export const TERMINAL_PROFILES = PROFILES.map(p => p.title)

/** The fragment's JSON, its images read from `imageDir` (a Windows path). */
export const fragment = (imageDir: string): string =>
  JSON.stringify(
    {
      schemes: PROFILES.map(p => p.scheme),
      profiles: PROFILES.map((p, i) => ({
        guid: `{6f0a1c2e-3b4d-4e5f-8a91-c2d3e4f5000${i + 1}}`,
        name: p.title,
        commandline: 'powershell.exe -NoLogo -NoExit -Command claude',
        startingDirectory: '%USERPROFILE%',
        colorScheme: p.scheme.name,
        backgroundImage: `${imageDir}\\${p.look}.png`,
        backgroundImageOpacity: p.opacity,
        backgroundImageStretchMode: 'uniformToFill',
        backgroundImageAlignment: 'bottom',
      })),
    },
    null,
    2,
  )
