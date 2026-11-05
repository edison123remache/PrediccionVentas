<script lang="ts">
	import type { NavigationItem } from '#lib/access/policy.js';
	let { module }: { module: NavigationItem } = $props();
</script>

<svelte:head><title>{module.label} | Mundo Hogar</title></svelte:head>
<div class="page-heading">
	<div>
		<p class="eyebrow">APLICACIÓN EMPRESARIAL · DEMOSTRACIÓN</p>
		<h1>{module.label}</h1>
	</div>
	<span class="tag">{module.phase}</span>
</div>
<section class="panel phase-state">
	<span class="phase-label">Módulo planificado</span>
	<h2>Este espacio está preparado para el siguiente incremento</h2>
	<p>{module.description}</p>
	<p class="muted">
		La navegación y los permisos de demostración ya están definidos. Las consultas, cargas o cambios
		de este módulo todavía no están implementados.
	</p>
	{#if module.href === '/administracion/datos'}<div class="import-roadmap">
			<h3>Así se cargarán los reportes</h3>
			<ol>
				<li>Elegir ventas o inventario y seleccionar un archivo Excel (.xlsx) o CSV.</li>
				<li>Validar columnas, fechas, importes y posibles duplicados.</li>
				<li>Revisar una vista previa y confirmar la importación.</li>
				<li>Consultar el resultado y el estado del pronóstico.</li>
			</ol>
			<p>
				No se requiere conexión directa a la base de datos de la empresa. No se procesa ni guarda
				ningún archivo en esta fase.
			</p>
		</div>{/if}
	<div class="phase-actions">
		<a class="button" href="/">Volver al inicio</a><a class="secondary-link" href="/informacion"
			>Conocer el alcance de esta versión</a
		>
	</div>
</section>
