<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	import { can } from '#lib/access/policy.js';
	let { data: pageData }: PageProps = $props();
	let worker = $derived(pageData.access.user?.role === 'worker');
	let allowedForecast = $derived(can(pageData.access, 'forecasts:read'));

	import { slide } from 'svelte/transition';
	import MetricCard from '#lib/components/ui/MetricCard.svelte';
	import DataState from '#lib/components/ui/DataState.svelte';
	import SalesChart from '#lib/components/charts/SalesChart.svelte';
	import { salesService } from '#lib/services/sales.js';
	import type { DashboardData } from '#lib/types/dashboard.js';
	import { money, month, date, variation, consecutive } from '#lib/utils/format.js';
	let data = $state<DashboardData | null>(null);
	let status = $state<'loading' | 'ready' | 'empty' | 'error'>('loading');
	let selectedPeriod = $state('');
	let range = $state(6);
	let chartMode = $state<'line' | 'bar'>('line');
	let showForecast = $state(true);
	let reduced = $state(false);
	let controller: AbortController;
	async function load() {
		controller?.abort();
		controller = new AbortController();
		const signal = controller.signal;
		status = 'loading';
		try {
			const result = await salesService.getDashboard(
				signal,
				pageData.access.user?.permissions ?? []
			);
			if (signal.aborted) return;
			data = result;
			selectedPeriod = result.sales.at(-1)?.period ?? '';
			status = result.sales.length ? 'ready' : 'empty';
		} catch {
			if (!signal.aborted) status = 'error';
		}
	}
	onMount(() => {
		const media = window.matchMedia('(prefers-reduced-motion: reduce)');
		reduced = media.matches;
		const update = () => (reduced = media.matches);
		media.addEventListener('change', update);
		void load();
		return () => {
			controller?.abort();
			media.removeEventListener('change', update);
		};
	});
	let visibleSales = $derived(data?.sales.slice(-range) ?? []);
	let visibleData = $derived(data ? { ...data, sales: visibleSales } : null);
	let selectedIndex = $derived(data?.sales.findIndex((s) => s.period === selectedPeriod) ?? -1);
	let latest = $derived(data?.sales[selectedIndex]);
	let previous = $derived(data?.sales[selectedIndex - 1]);
	let change = $derived(
		latest && previous && consecutive(previous.period, latest.period)
			? variation(latest.revenue, previous.revenue)
			: null
	);
	let lastSale = $derived(data?.sales.at(-1));
	let forecast = $derived(
		data?.forecast && lastSale && consecutive(lastSale.period, data.forecast.period)
			? data.forecast
			: null
	);
	let periodTotal = $derived(visibleSales.reduce((sum, s) => sum + s.revenue, 0));
	let periodAverage = $derived(visibleSales.length ? periodTotal / visibleSales.length : 0);
	let comparisonMax = $derived(Math.max(latest?.revenue ?? 0, previous?.revenue ?? 0, 1));
	let showAssistantInfo = $state(false);
	function setRange(value: number) {
		range = value;
		const available = data?.sales.slice(-value) ?? [];
		if (!available.some((s) => s.period === selectedPeriod))
			selectedPeriod = available.at(-1)?.period ?? '';
	}
</script>

<svelte:head
	><title>Inicio | Mundo Hogar</title><meta
		name="description"
		content="Panel comercial demostrativo de Mundo Hogar: explora ventas y estimaciones de ejemplo."
	/></svelte:head
>
<div class="page-heading">
	<div>
		<p class="eyebrow">MUNDO HOGAR · PANEL COMERCIAL</p>
		<h1>Una mirada a tu negocio<span class="heading-dot">.</span></h1>
		<p class="muted">Explora tus ventas. Compara períodos. Mira hacia adelante.</p>
	</div>
	<button class="refresh-button" onclick={load} disabled={status === 'loading'}
		><svg
			class:spinning={status === 'loading'}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="1.7"
			aria-hidden="true"
			><path d="M20 7v5h-5M4 17v-5h5M5.5 8a7 7 0 0 1 11-3L20 8M4 16l3.5 3A7 7 0 0 0 18.5 16" /></svg
		>Recargar ejemplo</button
	>
</div>
<div class="demo-banner" role="note">
	<span class="demo-icon" aria-hidden="true">i</span>
	<div>
		<strong>Estás viendo datos de demostración</strong>
		<p>
			Explora con libertad: las ventas y la estimación son inventadas para probar la interfaz. No
			representan resultados reales ni un modelo conectado.
		</p>
	</div>
	<span class="demo-pill">MODO DEMO</span>
</div>
{#if status !== 'ready'}<DataState kind={status} retry={load} />
{:else if data && latest}
	<div class="section-meta">
		<span class="section-title"><span class="status-dot"></span>Tu resumen de ventas</span><span
			>Actualización del ejemplo: {date(data.metadata.updatedAt)}</span
		>
	</div>
	<div class="metrics-grid" class:worker-metrics={worker}>
		<MetricCard
			label="Ventas del mes seleccionado"
			amount={latest.revenue}
			detail={`${month(latest.period)} · ejemplo`}
			series={visibleSales.map((s) => s.revenue)}
		/>
		{#if allowedForecast}
			<MetricCard
				label="Estimación del próximo mes"
				amount={forecast?.revenue ?? null}
				detail={forecast ? `${month(forecast.period)} · ilustrativa` : 'Sin estimación disponible'}
				series={lastSale && forecast ? [lastSale.revenue, forecast.revenue] : []}
				accent
			/>
		{/if}
		<MetricCard
			label="Variación de ventas"
			amount={change}
			percentage
			detail={previous
				? `Frente a ${month(previous.period)} · ejemplo`
				: 'Sin mes anterior comparable'}
			series={visibleSales.map((s) => s.revenue)}
		/>
	</div>
	<div class="dashboard-grid" class:worker-dashboard={worker}>
		{#if !worker}
			<section class="panel chart-panel">
				<div class="panel-heading">
					<div>
						<span class="eyebrow">EL PULSO DE TUS VENTAS</span>
						<h2>Evolución de ingresos</h2>
						<p class="muted">Selecciona un mes en el gráfico para explorar su resumen.</p>
					</div>
					<div class="segmented range-control" role="group" aria-label="Período del gráfico">
						{#each [3, 6, 12] as n}<button aria-pressed={range === n} onclick={() => setRange(n)}
								>{n} meses</button
							>{/each}
					</div>
				</div>
				<div class="chart-overview">
					<div>
						<p class="chart-total">{money(periodTotal)}<span>USD</span></p>
						<p class="muted">Ventas de ejemplo · {visibleSales.length} meses seleccionados</p>
					</div>
					<div class="chart-average">
						<span>Promedio mensual</span><strong>{money(periodAverage)}</strong>
					</div>
				</div>
				<div class="chart-toolbar">
					<div class="segmented" role="group" aria-label="Tipo de gráfico">
						<button aria-pressed={chartMode === 'line'} onclick={() => (chartMode = 'line')}
							>Líneas</button
						><button aria-pressed={chartMode === 'bar'} onclick={() => (chartMode = 'bar')}
							>Barras</button
						>
					</div>
					<label class="forecast-switch"
						><input type="checkbox" bind:checked={showForecast} />Mostrar estimación</label
					>
				</div>
				{#if visibleData}<SalesChart
						data={visibleData}
						mode={chartMode}
						{showForecast}
						onSelect={(p) => (selectedPeriod = p)}
					/>{/if}
			</section>
		{:else}
			<section class="panel worker-welcome">
				<span class="eyebrow">TU ESPACIO DE CONSULTA</span>
				<h2>Lo esencial para tu jornada</h2>
				<p>
					Este perfil muestra ventas de ejemplo y accesos de consulta. No permite administrar
					usuarios, importar archivos ni exportar reportes.
				</p>
				<div class="worker-links">
					{#each [{ href: '/ventas', label: 'Consultar ventas', permission: 'sales:read' as const }, { href: '/inventario', label: 'Consultar inventario', permission: 'inventory:read' as const }, { href: '/asistente', label: 'Conocer el asistente', permission: 'chat:use' as const }] as link}{#if can(pageData.access, link.permission)}<a
								class="worker-link"
								href={link.href}
								>{link.label}<span aria-hidden="true">→</span><small>Módulo en preparación</small
								></a
							>{/if}{/each}
				</div>
				<p class="muted">
					Las cifras son demostrativas. Estas opciones no representan permisos de una cuenta real.
				</p>
			</section>
		{/if}
		<section class="panel summary-panel">
			<div class="summary-heading">
				<span class="eyebrow">MES A MES</span><span class="summary-icon" aria-hidden="true"
					><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
						><path d="m4 17 6-6 4 3 6-10M14 4h6v6" /></svg
					></span
				>
			</div>
			<h2>Los detalles, más claros</h2>
			<label class="month-label" for="summary-month">Mes del resumen</label><select
				id="summary-month"
				bind:value={selectedPeriod}
				>{#each visibleSales as sale}<option value={sale.period}>{month(sale.period)}</option
					>{/each}</select
			>
			<div class="month-reading" aria-live="polite">
				<p class="reading-label">Ventas de ejemplo</p>
				<p class="reading-amount">{money(latest.revenue)}</p>
				{#if change !== null}<span class:negative={change < 0} class="change-pill"
						>{change >= 0 ? '↑' : '↓'}
						{Math.abs(change).toLocaleString('es-EC', { maximumFractionDigits: 1 })} % frente al mes anterior</span
					>{:else}<p class="muted">Sin mes anterior comparable.</p>{/if}
			</div>
			{#if previous && change !== null}<div
					class="comparison-bars"
					aria-label="Comparación de ingresos"
				>
					<div>
						<span>{month(previous.period, true)}</span><strong>{money(previous.revenue)}</strong>
						<div class="bar-track">
							<span
								class="bar-previous"
								style:width={`${(previous.revenue / comparisonMax) * 100}%`}
							></span>
						</div>
					</div>
					<div>
						<span>{month(latest.period, true)}</span><strong>{money(latest.revenue)}</strong>
						<div class="bar-track">
							<span class="bar-current" style:width={`${(latest.revenue / comparisonMax) * 100}%`}
							></span>
						</div>
					</div>
				</div>{/if}
			<div class="summary-note">
				<strong>{worker ? 'Consulta sin modificar registros' : 'Una guía, no una garantía'}</strong>
				<p>
					{worker
						? 'Este perfil es de solo consulta. Los permisos de una cuenta real deberán verificarse en el backend.'
						: 'La estimación es ilustrativa. No hay un modelo conectado ni métricas de precisión disponibles.'}
				</p>
			</div>
		</section>
	</div>
	{#if !worker && can(pageData.access, 'chat:use')}
		<section class="assistant-card">
			<div class="assistant-orb" aria-hidden="true">
				<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5"
					><path d="M16 5l2.8 8.2L27 16l-8.2 2.8L16 27l-2.8-8.2L5 16l8.2-2.8L16 5Z" /></svg
				>
			</div>
			<div class="assistant-copy">
				<span class="eyebrow">TU PRÓXIMO ALIADO COMERCIAL</span>
				<h2>Menos dudas. Más claridad.</h2>
				<p>Un asistente para conversar sobre tus ventas y pronósticos, con palabras sencillas.</p>
			</div>
			<button
				class="button"
				aria-expanded={showAssistantInfo}
				aria-controls="assistant-info"
				onclick={() => (showAssistantInfo = !showAssistantInfo)}
				>{showAssistantInfo ? 'Ocultar detalles' : 'Conocer el asistente'}<span aria-hidden="true"
					>→</span
				></button
			>{#if showAssistantInfo}<div
					id="assistant-info"
					class="assistant-info"
					role="status"
					transition:slide={{ duration: reduced ? 0 : 220 }}
				>
					<strong>El asistente se desarrollará en un próximo incremento.</strong>
					<p>
						Aún no está conectado a un servicio de respuestas. No genera cifras ni predicciones.
						Aquí podrás consultar tus datos cuando se integre la API.
					</p>
				</div>{/if}
		</section>
	{/if}
	<p class="source-note">
		Fuente: {data.metadata.source}. Cobertura del ejemplo: enero–diciembre de 2025.
		{#if allowedForecast}Estimación ilustrativa: enero de 2026.{/if} Las interacciones solo cambian la
		visualización de estos datos.
	</p>
{/if}
