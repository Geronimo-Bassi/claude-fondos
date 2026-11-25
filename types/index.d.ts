export type Limit = { kind: string; percentUsed: number; resetsAt?: string }

export type LookName = 'calido' | 'atardecer' | 'bosque' | 'biblioteca' | 'apagado'

declare module 'claude-code' {
  interface PluginState {
    fondos: { limits: Limit[]; look: LookName }
  }
}
