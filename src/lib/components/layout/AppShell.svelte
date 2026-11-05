<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	let interactive = $state(false);
	onMount(() => {
		interactive = true;
	});
	import { page } from '$app/state';
	import Brand from '#lib/components/ui/Brand.svelte';
	import { navigation, can, roleLabels } from '#lib/access/policy.js';
	import type { AppAccess } from '#lib/types/access.js';
	let { children, access }: { children: Snippet; access: AppAccess } = $props();
	let menuOpen = $state(false);
	let available = $derived(navigation.filter((item) => can(access, item.permission)));
	let currentLabel = $derived(
		navigation.find((item) => item.href === page.url.pathname)?.label ??
			(page.url.pathname === '/informacion' ? 'Información' : 'Aplicación')
	);
</script>

<a class="skip-link" href="#contenido">Saltar al contenido</a>
<div class="app-shell">
	<aside class="sidebar">
		<a class="brand" href="/" aria-label="Mundo Hogar, inicio"><Brand /></a>
		<p class="brand-subtitle">ASISTENTE COMERCIAL</p>
		<button
			class="menu-toggle"
			disabled={!interactive}
			aria-expanded={menuOpen}
			aria-controls="navegacion"
			onclick={() => (menuOpen = !menuOpen)}>{menuOpen ? 'Cerrar menú' : 'Abrir menú'}</button
		>
		<nav id="navegacion" class:open={menuOpen} aria-label="Navegación principal">
			{#each ['commercial', 'administration'] as group}{#if available.some((item) => item.group === group)}<p
						class="nav-label"
					>
						{group === 'commercial' ? 'ESPACIO DE TRABAJO' : 'ADMINISTRACIÓN'}
					</p>
					{#each available.filter((item) => item.group === group) as item}<a
							class="nav-link"
							class:active={page.url.pathname === item.href}
							href={item.href}
							aria-current={page.url.pathname === item.href ? 'page' : undefined}
							onclick={() => (menuOpen = false)}
							><span>{item.label}</span>{#if item.href !== '/'}<small class="nav-phase"
									>En preparación</small
								>{/if}</a
						>{/each}{/if}{/each}<a
				class="nav-link information-link"
				class:active={page.url.pathname === '/informacion'}
				href="/informacion"
				aria-current={page.url.pathname === '/informacion' ? 'page' : undefined}
				onclick={() => (menuOpen = false)}>Información</a
			>
		</nav>
		<div class="sidebar-note">
			<span class="status-dot"></span> Prototipo de tesis
			<p>Perfiles de demostración · sin cuentas reales</p>
		</div>
	</aside>
	<div class="workspace">
		<header class="topbar">
			<span class="topbar-trail"
				>Tu espacio <span aria-hidden="true">/</span><strong>{currentLabel}</strong></span
			>
			<div class="profile-toolbar">
				<span class="prototype-badge">Demostración</span>{#if access.user}<span
						class="current-profile"
						>{roleLabels[access.user.role]}<small>Perfil de ejemplo</small></span
					>{/if}<a class="profile-change" href="/perfiles">Cambiar perfil</a>
			</div>
		</header>
		<main id="contenido" tabindex="-1">{@render children()}</main>
		<footer>
			Mundo Hogar · Demostración de interfaz. Los permisos reales se verificarán en el backend.
		</footer>
	</div>
</div>
