# Auditoría de legibilidad y accesibilidad visual

## Alcance

Dashboard de administradora y trabajador, navegación móvil y de escritorio, selección de perfiles, Información, módulos comerciales y administrativos existentes, estados de acceso limitado y servicio no disponible. Se conservan funciones, logotipo, identidad roja, animaciones y estructura de contenido.

## Hallazgos iniciales

Medición en Chromium, ventana de 1440 px y tamaño de navegador predeterminado:

| Elemento                         | Antes                                              | Ahora                             |
| -------------------------------- | -------------------------------------------------- | --------------------------------- |
| Título principal                 | Hasta 37–38 px, con tamaños distintos por pantalla | 28–34 px                          |
| Títulos de sección               | Habitualmente 17 px                                | 20 px                             |
| Texto de Información             | 12,9 px                                            | 16 px                             |
| Menú lateral                     | 11,85 px                                           | 15 px                             |
| Estado del menú                  | 8,7 px                                             | 13 px                             |
| Etiquetas y detalles de tarjetas | 10,05 px                                           | 14 px                             |
| Botones                          | Algunos de 10,65–12 px                             | 15 px; controles de gráfico 14 px |
| Pie de página                    | 9,75 px                                            | 13 px                             |
| Valores principales              | Escala variable dispersa                           | 30–38 px                          |

Se encontraron incumplimientos de contraste de 4,14:1 en las etiquetas de comparación y 4,39:1 en la nota del elemento activo del menú. El extremo claro de la tarjeta roja también necesitaba oscurecerse para garantizar contraste a sus textos pequeños.

## Implementación

`src/lib/styles/typography.css` centraliza tamaños, pesos, interlineados, colores de texto y ajustes de reflujo. Se eliminaron los tamaños dispersos de `app.css`; los pesos e interlineados remiten a los tokens comunes. El tamaño raíz es 100 %, para respetar la preferencia del navegador, y la escala usa rem.

Texto de párrafo a 16 px, secundario a 14 px y notas a 13 px con pesos 400–700. El mínimo de 13 px es una decisión del proyecto: WCAG no establece un tamaño mínimo general. Títulos con interlineado 1,25, texto normal 1,65 y párrafos largos 1,75. En móviles no se reduce el tamaño del texto para hacerlo caber.

La tipografía del logotipo es parte de la marca y se conserva como gráfico. No se considera texto de interfaz ni se altera su composición.

La tarjeta destacada conserva un degradado rojo, con ambos extremos suficientemente oscuros y textos blancos. Relaciones calculadas con luminancia relativa WCAG:

| Texto              | Fondo          | Contraste |
| ------------------ | -------------- | --------- |
| Secundario #65525e | Blanco #ffffff | 7,19:1    |
| Secundario #65525e | Activo #fcedef | 6,33:1    |
| Secundario #65525e | Página #f8f7f9 | 6,73:1    |
| Blanco #ffffff     | Rojo #b81e32   | 6,42:1    |
| Blanco #ffffff     | Rojo #bd2532   | 6,04:1    |

Chart.js obtiene tamaño, familia y color del estilo calculado del canvas: etiquetas y tooltips de 14 px por defecto, con los mismos tokens secundarios. Las marcas del eje se espacian según el ancho disponible. Se mantiene la tabla equivalente completa, sin eliminar valores de los datos.

Botones y selectores tienen una altura mínima de 44 px. Se refuerzan bordes de campos y botones delineados, etiquetas y foco visible. La tabla conserva desplazamiento horizontal dentro de su región; esta región tiene nombre y foco por teclado. La excepción puntual del linter de Svelte documenta precisamente ese contenedor desplazable, sin desactivar comprobaciones globales.

Cabecera, filtros, tarjetas y controles se distribuyen en nuevas líneas cuando lo necesitan. En anchos intermedios el dashboard pasa a una columna antes de que el texto se estreche demasiado. El menú de escritorio mantiene su desplazamiento vertical, y el móvil su apertura explícita.

## Verificación reproducible

```sh
npm ci
npm run check
npm run build
npm run test:e2e
npm run test:unavailable
```

En esta máquina se usa Chromium del sistema mediante `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium`. Las suites se ejecutan secuencialmente.

`tests/readability.spec.ts` utiliza axe-core con reglas WCAG A/AA y verifica las once rutas actuales en escritorio y móvil, con el menú móvil abierto y la tabla del dashboard visible. También examina el dashboard del trabajador y el estado 403. Las pruebas comprueban tamaños de texto propios de la interfaz, desbordamiento general, recortes y solapamientos de controles.

Para ampliación se comprueba el reflujo a 720 px CSS (espacio equivalente al de una ventana de 1440 px con zoom 200 %) y además se duplica el tamaño raíz de texto. Son comprobaciones automatizadas de geometría y ampliación, no una operación del menú de zoom de cada navegador. Se comprueban también pantallas de 320 y 360 px y se revisan capturas de Información, dashboard, perfiles y administración. La tabla puede requerir desplazamiento horizontal; el resto de la página no.

Las capturas quedan en `test-results/`, excluido de Git. El análisis automático no detecta infracciones A/AA en los estados examinados; no equivale a una certificación completa WCAG ni a una validación de Safari o Firefox.
