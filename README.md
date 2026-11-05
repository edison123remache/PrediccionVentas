# PrediccionVentas

Frontend base con SvelteKit, Svelte y TypeScript.

## Requisitos

Node.js 24 LTS y npm. Las dependencias se fijan en `package-lock.json`.

## Desarrollo

```sh
npm ci
npm run dev -- --host 0.0.0.0
```

La pantalla inicial está en `src/routes/+page.svelte`.

## Validación

```sh
npm run check
npm run build
```

`npm run preview` permite comprobar la compilación localmente. El adaptador de despliegue se seleccionará cuando se defina el proveedor de alojamiento.

Este proyecto base no requiere claves ni servicios externos.

## Dashboard demostrativo

El primer incremento incluye el layout adaptable y el resumen comercial. Todos los datos son de ejemplo y no representan ventas ni pronósticos reales de Mundo Hogar. Las demás secciones están pendientes.

Consulta [la documentación del frontend](docs/frontend.md) para componentes, contratos e integración futura con FastAPI.

Pruebas de navegador:

```sh
npx playwright install chromium
npm run test:e2e
```

El dashboard permite explorar rangos de 3, 6 y 12 meses, alternar líneas y barras, mostrar u ocultar la estimación y seleccionar un mes para actualizar el resumen. Incluye transiciones, contadores animados y soporte para movimiento reducido. La identidad visual roja y el logotipo vectorial provisional se basan en la referencia de Mundo Hogar.
