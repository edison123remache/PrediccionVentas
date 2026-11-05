# Frontend de Mundo Hogar

## Incremento 1

Layout adaptable, tres tarjetas, gráfico interactivo con tooltip y leyenda, tabla equivalente, resumen calculado y acceso informativo al asistente pendiente. Las secciones futuras muestran «Próximamente» sin enlaces vacíos. No hay autenticación, backend ni modelo conectado.

Todos los valores y fechas son demostrativos. Enero–diciembre de 2025 y enero de 2026 se utilizan solo para probar la interfaz; no son evidencia para la tesis ni registros de Mundo Hogar.

## Componentes y servicios

- `AppShell`: menú lateral, menú móvil, cabecera, pie y enlace para saltar al contenido.
- `MetricCard`: importe numérico animado con Tween, etiqueta, detalle, minigráfico de ventas y variante destacada. El valor final está disponible a lectores de pantalla sin anunciar cada cuadro de la animación.
- `DataState`: carga, error, ausencia de datos y callback de reintento.
- `SalesChart`: Chart.js con dos series diferenciadas por color y trazo, tooltip, controles de líneas/barras, estimación visible/oculta y tabla HTML sincronizada. Destruye el gráfico al desmontarse; anima las actualizaciones salvo preferencia de movimiento reducido.
- `types/dashboard.ts`: contratos `MonthlySale`, `SalesForecast`, `DatasetMetadata`, `DashboardData` y `SalesService`.
- `utils/format.ts`: USD, fechas en español y UTC, variación porcentual y meses consecutivos.
- `demo/dashboard.ts`: conjunto de ejemplo.
- `services/sales.ts`: implementación demostrativa de `SalesService`, separada de la página.

La página carga el servicio al montarse y cancela consultas al salir. El mes seleccionado cambia las tarjetas y la comparación; el rango 3/6/12 meses cambia el total, promedio, gráfico y tabla. Seleccionar un punto del gráfico también actualiza el resumen; el selector de mes ofrece una alternativa de teclado. La variación exige dos meses consecutivos y denominador distinto de cero. La tarjeta de estimación exige el siguiente mes al último registro. Los datos ausentes no se convierten en cero.

## Integración futura con FastAPI

Sustituir `salesService.getDashboard(signal)` por un adaptador HTTP. Las rutas candidatas `/sales/monthly` y `/forecasts/monthly` aún no existen. El adaptador deberá validar JSON, garantizar períodos únicos ordenados `YYYY-MM`, importes finitos en USD y metadatos de origen y actualización. TypeScript no valida JSON en ejecución.

Antes de activar datos reales, adaptar los avisos y textos demostrativos del layout y la página a los metadatos. Esta entrega es exclusivamente de demostración; cambiar solo la URL no basta.

Inventario y chatbot tendrán servicios separados en incrementos posteriores. No hay respuestas ficticias de un chatbot ni métricas de precisión. Los intervalos, métricas y consulta por artículo se incorporarán únicamente si el backend proporciona datos verificables.

No usar inventario de 2026 como predictor histórico de 2023–2025. La incorporación de 2022 requiere validación. El origen y cobertura real se documentarán cuando se disponga de los archivos de la empresa.

## Validación

```sh
npm ci
npm run check
npm run build
npx playwright install chromium
npm run test:e2e
```

En esta máquina se usó `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e`. Las pruebas arrancan Vite en el puerto 5174.

Se comprueban escritorio (1440 px), móvil (360 px), importes, tabla, menú, detalles del asistente, desbordamiento y errores JavaScript. Los estados de carga, error, reintento y ausencia de datos se prueban sustituyendo el servicio solo en el navegador de prueba, sin interruptores de producción.

Hay etiquetas, foco visible, navegación semántica y tabla alternativa. La validación no equivale a una certificación WCAG ni incluye Safari o Firefox.

## Identidad e interacción

Paleta roja inspirada en la referencia de Mundo Hogar. `Brand.svelte` y el favicon son adaptaciones vectoriales provisionales de esa referencia, no los archivos originales de la marca. Sustituir por el SVG/PNG oficial cuando se disponga del archivo.

Las tarjetas entran de forma escalonada y muestran cifras con Tween; las barras comparativas transicionan con el mes seleccionado. Los gráficos animan los datos al cambiar rango y tipo. Las preferencias de movimiento reducido desactivan estas animaciones. Recargar ejemplo vuelve a consultar el servicio, sin generar cifras aleatorias ni simular una sincronización externa.

Las pruebas también cubren filtros, cambio de tipo, visibilidad de estimación, selector de mes, teclado y movimiento reducido.
