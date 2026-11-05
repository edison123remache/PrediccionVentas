# Frontend de Mundo Hogar

## Incremento 1

Layout adaptable, tres tarjetas, gráfico interactivo con tooltip y leyenda, tabla equivalente, resumen calculado y acceso informativo al asistente pendiente. Las secciones futuras muestran «Próximamente» sin enlaces vacíos. No hay autenticación, backend ni modelo conectado.

Todos los valores y fechas son demostrativos. Julio–diciembre de 2025 y enero de 2026 se utilizan solo para probar la interfaz; no son evidencia para la tesis ni registros de Mundo Hogar.

## Componentes y servicios

- `AppShell`: menú lateral, menú móvil, cabecera, pie y enlace para saltar al contenido.
- `MetricCard`: etiqueta, valor, detalle y variante destacada.
- `DataState`: carga, error, ausencia de datos y callback de reintento.
- `SalesChart`: Chart.js con dos series diferenciadas por color y trazo, tooltip, leyenda interactiva y tabla HTML. Destruye el gráfico al desmontarse. Sin animaciones.
- `types/dashboard.ts`: contratos `MonthlySale`, `SalesForecast`, `DatasetMetadata`, `DashboardData` y `SalesService`.
- `utils/format.ts`: USD, fechas en español y UTC, variación porcentual y meses consecutivos.
- `demo/dashboard.ts`: conjunto de ejemplo.
- `services/sales.ts`: implementación demostrativa de `SalesService`, separada de la página.

La página carga el servicio al montarse y cancela consultas al salir. La variación exige dos meses consecutivos y denominador distinto de cero. La tarjeta de estimación exige el siguiente mes al último registro. Los datos ausentes no se convierten en cero.

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
