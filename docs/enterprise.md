# Base empresarial — fase 1

## Implementado

- Dashboard existente conservado dentro de `routes/(app)`.
- Layout raíz compartido y layout de aplicación separado de la pantalla pública de perfiles.
- `/perfiles`: selección explícita de administradora o trabajador de demostración, sin contraseñas ni cuentas reales.
- Cookie `mh_demo_profile` de ocho horas, HttpOnly y SameSite=Lax; Secure cuando se usa HTTPS. Es solo una preferencia de demostración, no una credencial de autenticación.
- Comprobación del origen del POST y rechazo de valores de perfil desconocidos.
- Política central en `lib/access/policy.ts` y perfiles de ejemplo en `lib/demo/profiles.ts`.
- Navegación adaptada a permisos, estado activo, menú móvil y rutas de módulos pendientes.
- Trabajador: dos indicadores de ventas, resumen simplificado y accesos de consulta. No muestra tarjeta de pronóstico ni gráfico con estimación.
- El servicio de ventas de demostración elimina las series o estimaciones no concedidas por los permisos suministrados. Esto reduce datos accidentales en la vista, pero no protege los fixtures incluidos en JavaScript.
- Guardas de servidor SvelteKit por ruta: el perfil trabajador recibe 403 al abrir administración, predicciones o reportes directamente.
- Pantallas informativas de módulos pendientes, errores y modo conectado no disponible. No existen formularios de carga ficticios, registros de importación inventados ni respuestas generadas por un chatbot.
- Contratos TypeScript y puertos de servicios para FastAPI. Son una propuesta de integración, no endpoints implementados ni validadores de JSON.

## Límite de seguridad

Ambos perfiles son públicos y cualquiera puede cambiar entre ellos. Las guardas y la cookie no constituyen autenticación ni autorización para una empresa real. No cargar información privada en este prototipo público.

La implementación conectada deberá verificar sesión y permisos en FastAPI para cada operación, restringir también las fuentes del chatbot y exportaciones, invalidar sesiones y conservar credenciales del backend exclusivamente en el servidor. Los permisos enviados desde el navegador no son confiables. Los tipos de respuesta no equivalen a validación de JSON.

`src/env.ts` utiliza la configuración de variables de SvelteKit 3. `APP_MODE` es privado y se lee al arrancar. Por defecto es `demo`. Cualquier otro valor devuelve acceso no disponible: el dashboard responde 503 y la selección de perfiles queda bloqueada. No se cambia silenciosamente a datos de ejemplo en un modo conectado. Todavía no existe un modo conectado operativo ni una pantalla de login real.

No se implementó `hooks.server.ts` con una sesión ficticia. Se incorporará cuando haya autenticación real que validar. Tampoco hay un proxy `/api` que aparente hablar con FastAPI.

## Permisos efectivos de demostración

| Permiso        | Administradora | Trabajador |
| -------------- | -------------- | ---------- |
| dashboard:read | Sí             | Sí         |
| sales:read     | Sí             | Sí         |
| inventory:read | Sí             | Sí         |
| chat:use       | Sí             | Sí         |
| forecasts:read | Sí             | No         |
| reports:export | Sí             | No         |
| users:manage   | Sí             | No         |
| data:manage    | Sí             | No         |
| imports:read   | Sí             | No         |

El trabajador recibe estos permisos como un ejemplo fijo; no hay un editor de permisos operativo todavía. En el backend se podrán conceder consultas de predicciones y exportaciones expresamente, pero nunca permisos administrativos a un trabajador. La futura gestión de usuarios deberá impedir desactivar la última administradora activa.

## Rutas

| Ruta                                | Estado                                              |
| ----------------------------------- | --------------------------------------------------- |
| /                                   | Dashboard demostrativo según perfil                 |
| /perfiles                           | Selección pública de perfil de ejemplo              |
| /informacion                        | Alcance y limitaciones                              |
| /ventas, /predicciones, /inventario | Espacios preparados; consultas completas en fase 2  |
| /asistente, /reportes               | Espacios preparados; operación en fase 5            |
| /administracion/usuarios            | Espacio preparado; operación en fase 4              |
| /administracion/datos               | Explicación del flujo Excel/CSV; todavía sin cargas |
| /administracion/importaciones       | Espacio preparado; todavía sin historial persistido |

Las páginas de módulos explican su estado y tienen enlaces útiles. No presentan controles que prometan operaciones inexistentes.

## Arquitectura y contratos

- `types/access.ts`: roles, permisos, usuario y unión de acceso demo/no disponible.
- `types/api/common.ts`: importes decimales exactos, períodos, procedencia, paginación y errores.
- `types/api/auth.ts`: solicitudes de sesión y gestión de trabajadores.
- `types/api/commercial.ts`: ventas, pronóstico mensual, inventario y estado de datos.
- `types/api/imports.ts`: validación, incidencias por fila, vista previa, confirmación y registro de importación.
- `types/api/assistant.ts`: consultas, referencias, tablas y exportaciones.
- `services/contracts.ts`: interfaces de servicios futuros, separadas del adaptador demostrativo actual.

Los campos propuestos usan camelCase. FastAPI podrá declararlos como aliases de Pydantic en el OpenAPI acordado. `amount` será una cadena decimal y moneda USD; el adaptador convertirá a número únicamente para dibujar gráficos, sin realizar contabilidad con números binarios. Fechas mensuales `YYYY-MM`, fechas de reporte `YYYY-MM-DD` e instantes ISO 8601 con zona horaria.

Una respuesta comercial incluye procedencia, versión y fechas. El backend deberá validar y ordenar los períodos, distinguir ausencia de cero y paginar los listados. El frontend conectado validará las respuestas en ejecución y mapeará los contratos al modelo visual.

La predicción se limita a `total_monthly_revenue`, con horizonte de un mes. Intervalos y evaluación son opcionales: no se inventan. Debe identificarse si la versión de datos cambió después de generar el pronóstico. El inventario es un snapshot con fecha propia; el de 2026 no se incorpora como predictor histórico de 2023–2025. Los datos reales 2023–2025 y la posible incorporación de 2022 requieren verificación; no están cargados en este proyecto.

El contexto del chatbot contiene un identificador de pronóstico, no cifras confiables aportadas por el navegador. El backend vuelve a consultar la fuente y comprueba acceso. Una respuesta fundamentada debe incluir referencias; el contrato permite distinguir ausencia de datos, pregunta fuera de alcance y servicio no disponible.

## API candidata, todavía no implementada

| Método    | Ruta FastAPI                                                 | Permiso                                        |
| --------- | ------------------------------------------------------------ | ---------------------------------------------- |
| POST      | /v1/auth/login                                               | Público, con limitación de intentos            |
| GET       | /v1/auth/session                                             | Sesión                                         |
| POST      | /v1/auth/logout                                              | Sesión                                         |
| GET       | /v1/dashboard                                                | dashboard:read y alcance de los indicadores    |
| GET       | /v1/sales/monthly                                            | sales:read                                     |
| GET       | /v1/forecasts y /v1/forecasts/{id}                           | forecasts:read                                 |
| GET       | /v1/inventory/latest y /v1/inventory/{id}/items              | inventory:read                                 |
| POST      | /v1/chat/messages                                            | chat:use más permisos de cada fuente           |
| GET       | /v1/data/status                                              | data:manage                                    |
| POST      | /v1/imports/validate                                         | data:manage                                    |
| GET       | /v1/imports/validations/{id}                                 | data:manage                                    |
| POST      | /v1/imports/{id}/confirm                                     | data:manage                                    |
| GET       | /v1/imports                                                  | imports:read                                   |
| GET, POST | /v1/users                                                    | users:manage                                   |
| PATCH     | /v1/users/{id}                                               | users:manage                                   |
| POST      | /v1/reports/exports                                          | reports:export y permiso sobre la fuente       |
| GET       | /v1/reports/exports/{id} y /v1/reports/exports/{id}/download | Mismos permisos, verificados en cada solicitud |

El futuro intermediario SvelteKit llamará a estas rutas desde el servidor. Sesión real con cookies seguras, protección CSRF en operaciones de escritura y autorización en FastAPI. No almacenar tokens en localStorage ni confiar en el rol seleccionado en esta demostración.

## Excel y CSV: contrato del siguiente módulo

Formatos previstos esenciales: `.xlsx` y `.csv`. No se presupone compatibilidad con `.xls` ni se ejecutan macros o fórmulas. El tamaño permitido y las columnas se definirán tras revisar un reporte real de la empresa.

1. La administradora elige ventas o inventario. El inventario exige fecha de reporte.
2. El backend valida formato y contenido, límites de tamaño y hojas, tipos, períodos, duplicados e inconsistencias.
3. Devuelve un identificador de validación, errores por fila, advertencias, vista previa y versión base.
4. No hay cambios comerciales hasta confirmar. Los conflictos se resuelven antes de la confirmación.
5. La confirmación lleva versión base e idempotencyKey. El backend vuelve a comprobar permisos y conflictos; aplica una transacción y registra el resultado.
6. La actualización del pronóstico se identifica como pendiente si corresponde. Importar no significa que ya se reentrenó o generó un nuevo pronóstico.

No hace falta acceso directo a la base de Mundo Hogar para importar reportes autorizados. No hay procesamiento de Excel, guardado ni entrenamiento implementados en esta fase.

## Validación de la fase

```sh
npm run check
npm run build
npm run test:e2e
npm run test:unavailable
```

Las pruebas de perfiles cubren selección y persistencia, navegación, 403 por URL, módulos pendientes, validación de perfil y origen, móvil y ausencia de errores de JavaScript. La prueba de modo no disponible usa un servidor con `APP_MODE=connected` y comprueba respuesta 503 y bloqueo del selector.

En esta máquina: prefijar los comandos de Playwright con `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium`. En otras máquinas, instalar Chromium con `npx playwright install chromium`. Ejecutar ambas suites secuencialmente: usan la misma salida generada de SvelteKit. Las capturas de la suite de modo no disponible se guardan en un directorio separado.

## Próximas fases, pendientes de aprobación

2. Consultas completas de ventas, predicciones e inventario.
3. Login, sesión y autorización conectada con FastAPI.
4. Usuarios, carga y validación de reportes, importaciones y estado de datos.
5. Chatbot fundamentado y exportaciones autorizadas.
6. Validación operativa con servicios reales y usuarios.
