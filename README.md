# PrediccionVentas

Frontend base con SvelteKit, Svelte y TypeScript.

## Requisitos

Node.js 24 LTS y npm. Las dependencias se fijan en `package-lock.json`.

## Desarrollo

```sh
npm ci
npm run dev -- --host 0.0.0.0
```

La pantalla inicial está en `src/routes/(app)/+page.svelte`.

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

## Perfiles de demostración

Usa **Cambiar perfil** para explorar como administradora o trabajador. No son cuentas reales ni un inicio de sesión. El trabajador ve un dashboard simplificado; los módulos futuros explican su estado sin simular cargas o respuestas.

La [documentación empresarial](docs/enterprise.md) describe permisos, rutas, contratos FastAPI y el flujo previsto para Excel y CSV. No hay procesamiento de archivos ni backend conectado todavía.

El modo predeterminado es `demo`; `.env.example` documenta `APP_MODE`. Cualquier otro valor bloquea el acceso conectado hasta que se implemente. Para comprobar este comportamiento, ejecuta `npm run test:unavailable` después de `npm run test:e2e`, no en paralelo.
