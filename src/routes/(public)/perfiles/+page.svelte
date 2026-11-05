<script lang="ts">
	import Brand from '#lib/components/ui/Brand.svelte';
	import { demoProfiles } from '#lib/demo/profiles.js';
	import type { PageProps } from './$types';
	let { data, form }: PageProps = $props();
</script>

<svelte:head><title>Perfiles de demostración | Mundo Hogar</title></svelte:head>
<main class="profile-page">
	<a class="profile-brand" href="/" aria-label="Mundo Hogar, inicio"><Brand /></a>
	<p class="eyebrow">EXPLORA LA APLICACIÓN</p>
	<h1>Un espacio para cada perfil</h1>
	<p class="profile-intro">
		Elige cómo quieres recorrer esta demostración. No necesitas una cuenta ni una contraseña.
	</p>
	<div class="demo-banner" role="note">
		<div>
			<strong>Esto no es un inicio de sesión</strong>
			<p>
				Los perfiles son ejemplos para revisar la interfaz y la navegación. No protegen datos reales
				ni representan cuentas de la empresa. La autenticación se implementará con el backend.
			</p>
		</div>
	</div>
	{#if form?.message}<p class="form-error" role="alert">
			{form.message}
		</p>{/if}{#if data.access.mode !== 'demo'}<p role="alert">
			El acceso conectado no está disponible. No se puede crear una sesión desde esta pantalla.
		</p>{/if}
	<div class="profile-grid">
		{#each Object.values(demoProfiles) as profile}<article class="panel profile-option">
				<span class="phase-label">Perfil demostrativo</span>
				<h2>{profile.role === 'administrator' ? 'Administradora' : 'Trabajador'}</h2>
				<p>
					{profile.role === 'administrator'
						? 'Vista completa del negocio y acceso a los espacios de administración.'
						: 'Vista simplificada para consultar ventas, inventario y el alcance del asistente.'}
				</p>
				<ul>
					{#if profile.role === 'administrator'}<li>Dashboard y predicciones de ejemplo</li>
						<li>Espacios de usuarios, datos e importaciones</li>
						<li>Acceso previsto a reportes comerciales</li>{:else}<li>
							Resumen de ventas sin predicciones
						</li>
						<li>Acceso de consulta a módulos autorizados</li>
						<li>Sin administración ni exportaciones</li>{/if}
				</ul>
				<form method="POST">
					<input type="hidden" name="profile" value={profile.role} /><button
						class="button"
						disabled={data.access.mode !== 'demo'}
						>Explorar como {profile.role === 'administrator'
							? 'administradora'
							: 'trabajador'}</button
					>
				</form>
			</article>{/each}
	</div>
	<a class="secondary-link" href="/">Volver al dashboard</a>
</main>
