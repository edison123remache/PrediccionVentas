<script lang="ts">
	import type { Snippet } from 'svelte';
	import Brand from '#lib/components/ui/Brand.svelte';
	let { children }: { children: Snippet } = $props();
	let menuOpen = $state(false);
	const upcoming = [
		'Historial de ventas',
		'Predicción de ventas',
		'Inventario',
		'Asistente inteligente',
		'Información'
	];
</script>

<a class="skip-link" href="#contenido">Saltar al contenido</a>
<div class="app-shell">
	<aside class="sidebar">
		<a class="brand" href="/" aria-label="Mundo Hogar, inicio"><Brand /></a>
		<p class="brand-subtitle">ASISTENTE COMERCIAL</p>
		<button
			class="menu-toggle"
			aria-expanded={menuOpen}
			aria-controls="navegacion"
			onclick={() => (menuOpen = !menuOpen)}>{menuOpen ? 'Cerrar menú' : 'Abrir menú'}</button
		>
		<nav id="navegacion" class:open={menuOpen} aria-label="Navegación principal">
			<p class="nav-label">ESPACIO DE TRABAJO</p>
			<a class="nav-link active" href="/" aria-current="page" onclick={() => (menuOpen = false)}
				><span aria-hidden="true">▦</span> Inicio</a
			>
			{#each upcoming as item}<div class="nav-pending">
					<span>{item}</span><small>Próximamente</small>
				</div>{/each}
		</nav>
		<div class="sidebar-note">
			<span class="status-dot"></span> Prototipo de tesis
			<p>Riobamba · Ecuador</p>
		</div>
	</aside>
	<div class="workspace">
		<header class="topbar">
			<span class="topbar-trail"
				>Tu espacio de trabajo <span aria-hidden="true">/</span> <strong>Inicio</strong></span
			><span class="prototype-badge">Versión demostrativa</span>
		</header>
		<main id="contenido" tabindex="-1">{@render children()}</main>
		<footer>Mundo Hogar · Apoyo para tus decisiones comerciales</footer>
	</div>
</div>
