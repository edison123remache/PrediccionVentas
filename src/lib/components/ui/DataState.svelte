<script lang="ts">
	let { kind, retry }: { kind: 'loading' | 'empty' | 'error'; retry?: () => void } = $props();
</script>

<section class="panel state" role={kind === 'error' ? 'alert' : 'status'} aria-live="polite">
	<h2>
		{kind === 'loading'
			? 'Cargando el resumen…'
			: kind === 'error'
				? 'No pudimos cargar el resumen'
				: 'Aún no hay ventas disponibles'}
	</h2>
	<p class="muted">
		{kind === 'loading'
			? 'Estamos preparando la información.'
			: kind === 'error'
				? 'Intenta nuevamente en unos momentos.'
				: 'El resumen aparecerá cuando se incorporen los registros de ventas.'}
	</p>
	{#if retry && kind !== 'loading'}<button class="button" onclick={retry}>Volver a intentar</button
		>{/if}
</section>
