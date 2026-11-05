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
