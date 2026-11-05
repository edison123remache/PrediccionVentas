<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head
	><title>{page.status === 403 ? 'Acceso limitado' : 'Servicio no disponible'} | Mundo Hogar</title
	></svelte:head
>
<section class="panel phase-state" role="alert">
	<span class="eyebrow"
		>{page.status === 403 ? 'PERFIL DEMOSTRATIVO' : 'SERVICIO NO DISPONIBLE'}</span
	>
	<h1>
		{page.status === 403 ? 'Esta sección requiere otro permiso' : 'No podemos abrir esta sección'}
	</h1>
	<p>{page.error?.message ?? 'Intenta de nuevo en unos momentos.'}</p>
	<div class="phase-actions">
		<a class="button" href="/">Volver al inicio</a><a class="secondary-link" href="/perfiles"
			>Revisar perfiles de demostración</a
		>
	</div>
</section>
