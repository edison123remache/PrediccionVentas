<script lang="ts">
	import { onMount } from 'svelte';
	import MetricCard from '#lib/components/ui/MetricCard.svelte';
	import DataState from '#lib/components/ui/DataState.svelte';
	import SalesChart from '#lib/components/charts/SalesChart.svelte';
	import { salesService } from '#lib/services/sales.js';
	import type { DashboardData } from '#lib/types/dashboard.js';
	import { money, month, date, variation, consecutive } from '#lib/utils/format.js';
	let data = $state<DashboardData | null>(null);
	let status = $state<'loading' | 'ready' | 'empty' | 'error'>('loading');
	let controller: AbortController;
	async function load() {
		controller?.abort();
		controller = new AbortController();
		const signal = controller.signal;
		status = 'loading';
		try {
			const result = await salesService.getDashboard(signal);
			if (signal.aborted) return;
			data = result;
			status = result.sales.length ? 'ready' : 'empty';
		} catch {
			if (!signal.aborted) status = 'error';
		}
	}
	onMount(() => {
		void load();
		return () => controller?.abort();
	});
	let latest = $derived(data?.sales.at(-1));
	let previous = $derived(data?.sales.at(-2));
	let change = $derived(
		latest && previous && consecutive(previous.period, latest.period)
			? variation(latest.revenue, previous.revenue)
			: null
	);
	let forecast = $derived(
		data?.forecast && latest && consecutive(latest.period, data.forecast.period)
			? data.forecast
			: null
	);
	let showAssistantInfo = $state(false);
</script>

<svelte:head
	><title>Inicio | Mundo Hogar</title><meta
		name="description"
		content="Prototipo demostrativo del panel comercial de Mundo Hogar."
	/></svelte:head
>
<div class="page-heading">
	<div>
		<p class="eyebrow">TU NEGOCIO, EN PERSPECTIVA</p>
		<h1>Resumen comercial</h1>
		<p class="muted">Una mirada sencilla a las ventas y al próximo mes.</p>
	</div>
	<span class="location">Riobamba, Ecuador</span>
</div>
<div class="demo-banner" role="note">
	<span class="demo-icon" aria-hidden="true">i</span>
	<div>
		<strong>Estás viendo datos de demostración</strong>
		<p>
			Las cifras y la estimación son ejemplos para probar la interfaz. No son ventas reales de Mundo
			Hogar ni resultados de un modelo.
		</p>
	</div>
</div>
{#if status !== 'ready'}<DataState kind={status} retry={load} />
{:else if data && latest}
	<div class="section-meta">
		<span>Vista general · {month(latest.period)}</span><span
			>Actualización del ejemplo: {date(data.metadata.updatedAt)}</span
		>
	</div>
	<div class="metrics-grid">
		<MetricCard
			label="Ventas del último mes"
			value={money(latest.revenue)}
			detail={`${month(latest.period)} · datos de ejemplo`}
		/>
		<MetricCard
			label="Estimación del próximo mes"
			value={forecast ? money(forecast.revenue) : 'No disponible'}
			detail={forecast
				? `${month(forecast.period)} · ejemplo ilustrativo`
				: 'Sin estimación para el siguiente mes'}
			accent
		/>
		<MetricCard
			label="Variación de ventas"
			value={change === null
				? 'No disponible'
				: `${change > 0 ? '+' : ''}${change.toLocaleString('es-EC', { maximumFractionDigits: 1 })} %`}
			detail={previous
				? `Frente a ${month(previous.period)} · ejemplo`
				: 'Se necesitan dos meses consecutivos'}
		/>
	</div>
	<div class="dashboard-grid">
		<section class="panel chart-panel">
			<div class="panel-heading">
				<div>
					<h2>Evolución de ingresos</h2>
					<p class="muted">Ventas de ejemplo y estimación ilustrativa, en USD.</p>
				</div>
				<span class="tag">Vista mensual</span>
			</div>
			<SalesChart {data} />
		</section>
		<section class="panel summary-panel">
			<span class="eyebrow">LECTURA DEL MES</span>
			<h2>¿Qué nos dice este ejemplo?</h2>
			<p>
				En {month(latest.period)}, las ventas de ejemplo suman
				<strong>{money(latest.revenue)}</strong>.
			</p>
			{#if change !== null}<p>
					Esto representa {change >= 0 ? 'un aumento' : 'una disminución'} del
					<strong>{Math.abs(change).toLocaleString('es-EC', { maximumFractionDigits: 1 })} %</strong
					> frente al mes anterior.
				</p>{/if}
			<div class="summary-note">
				<strong>Una guía, no una garantía</strong>
				<p>
					La estimación mostrada es ilustrativa. Todavía no hay un modelo predictivo conectado ni
					métricas de precisión disponibles.
				</p>
			</div>
		</section>
	</div>
	<section class="assistant-card">
		<div>
			<span class="eyebrow">ASISTENTE INTELIGENTE</span>
			<h2>Las respuestas, más cerca de ti</h2>
			<p>Un espacio previsto para consultar ventas y pronósticos con preguntas sencillas.</p>
		</div>
		<button
			class="button"
			aria-expanded={showAssistantInfo}
			aria-controls="assistant-info"
			onclick={() => (showAssistantInfo = !showAssistantInfo)}
			>{showAssistantInfo ? 'Ocultar detalles' : 'Conocer el asistente'}
			<span aria-hidden="true">↗</span></button
		>{#if showAssistantInfo}<p id="assistant-info" class="assistant-info" role="status">
				El asistente se desarrollará en un próximo incremento. Aún no está conectado a un servicio
				de respuestas. No genera cifras ni predicciones.
			</p>{/if}
	</section>
	<p class="source-note">
		Fuente: {data.metadata.source}. Cobertura del ejemplo: julio–diciembre de 2025; estimación
		ilustrativa: enero de 2026.
	</p>
{/if}
