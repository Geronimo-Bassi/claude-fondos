# fondos

Fondos de pixel art para Claude Code Desktop. Son estáticos, sin animaciones, así que no generan lag. Cada fondo cambia también los colores de la app y suma una barra con el uso de Claude arriba del prompt.

| Fondo | Modo |
| --- | --- |
| `calido`: escritorio cálido con plantas, tazas, notas y libros | claro y oscuro |
| `atardecer`: atardecer retro con cielo en franjas y montañas | oscuro |
| `bosque`: bosque nocturno con pinos, estrellas y luciérnagas | oscuro |
| `biblioteca`: estantes con libros, velas y un globo terráqueo | claro y oscuro |

Los dibujos se repiten en pequeño y se apoyan en los bordes, para que se vean enteros aunque la lista de sesiones, los paneles o el chat tapen partes de la ventana.

## Instalar

En una sesión de Claude Code en la terminal:

```
/plugin install fondos --marketplace Geronimo-Bassi/claude-fondos
```

Respondé `y` para agregar el marketplace y después elegí el alcance (Enter para el de usuario).

Desde una terminal:

```
claude plugin install fondos --marketplace Geronimo-Bassi/claude-fondos
```

En la app de escritorio: hacé clic en **+** al lado de la caja del prompt, después en **Plugins**, **Add marketplace** con `Geronimo-Bassi/claude-fondos` y por último **Add plugin**.

## Usar

```
/fondo calido      fondo cálido
/fondo atardecer   atardecer retro
/fondo bosque      bosque nocturno
/fondo biblioteca  biblioteca
/fondo apagado     colores normales y sin barra
/fondo             muestra cuál está puesto y cuáles hay
```

El mod recuerda el último fondo que elegiste.

## Para tener en cuenta

- Los fondos y los colores se ven solo en la app de escritorio y en la del celular. En la terminal y en VS Code solo aparece la barra de uso.
- La barra muestra el uso de las ventanas de 5 horas y de 7 días cuando usás Claude con una suscripción. Aparece después de la primera respuesta de la sesión.
