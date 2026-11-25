import { expect, mock, test } from 'claude-code/testing'

for (const surface of ['terminal', 'desktop'] as const) {
  test(`/fondo switches looks and turns the usage bar off (${surface})`, async ($, on) => {
    mock.store(on)
    // Stand-ins for the engine: an empty band beneath the mod, and the log
    // the theme calls write to.
    on('ui.render', { component: 'AbovePrompt' }, ($, e) => {
      const { Box } = $.ui.resolve(e)
      return <Box key="engine-band" />
    })
    on('ui.log', () => ({ value: {} }) as never)
    // Off Windows there is no LOCALAPPDATA: /fondo terminal says so and touches nothing.
    on('env.get', () => ({ value: undefined }) as never)

    const band = {
      plugin: 'fondos',
      surface,
      component: 'AbovePrompt',
      props: { hasSurvey: false, isCollapsed: false, isWorking: false },
    } as const

    const shown = await $.ui.mount(band as never)
    expect(await shown.find({ type: 'Text' })).toBeDefined()
    await shown.unmount()

    const sunset = await $.command.run({ command: 'fondo', args: 'atardecer' } as never)
    expect(JSON.stringify(sunset)).toContain('Atardecer retro')

    const accent = await $.command.run({ command: 'fondo', args: 'Cálido' } as never)
    expect(JSON.stringify(accent)).toContain('Cálido')

    const unknown = await $.command.run({ command: 'fondo', args: 'selva' } as never)
    expect(JSON.stringify(unknown)).toContain('No conozco')

    const terminal = await $.command.run({ command: 'fondo', args: 'terminal quitar' } as never)
    expect(JSON.stringify(terminal)).toContain('Windows')

    const off = await $.command.run({ command: 'fondo', args: 'apagado' } as never)
    expect(JSON.stringify(off)).toContain('apagados')
    const hidden = await $.ui.mount(band as never)
    expect(await hidden.find({ type: 'Text' })).toBeUndefined()
    await hidden.unmount()
  })
}
