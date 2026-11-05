<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Chart,
		LineController,
		LineElement,
		BarController,
		BarElement,
		PointElement,
		CategoryScale,
		LinearScale,
		Tooltip,
		Filler
	} from 'chart.js';
	import type { ChartConfiguration } from 'chart.js';
	import type { DashboardData } from '#lib/types/dashboard.js';
	import { money, month } from '#lib/utils/format.js';
	let {
		data,
		mode = 'line',
		showForecast = true,
		onSelect
	}: {
		data: DashboardData;
		mode?: 'line' | 'bar';
		showForecast?: boolean;
		onSelect?: (period: string) => void;
	} = $props();
	let canvas: HTMLCanvasElement;
	let failed = $state(false);
	let mounted = $state(false);
	let chart: Chart | undefined;
	onMount(() => {
		Chart.register(
			LineController,
			LineElement,
			BarController,
			BarElement,
			PointElement,
			CategoryScale,
			LinearScale,
			Tooltip,
			Filler
		);
		mounted = true;
		return () => chart?.destroy();
	});
	$effect(() => {
		if (!mounted) return;
		const sales = data.sales;
		const forecast = showForecast ? data.forecast : null;
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const periods = [...sales.map((s) => s.period), ...(forecast ? [forecast.period] : [])];
		const datasets: ChartConfiguration['data']['datasets'] = [
			{
				label: 'Ventas de ejemplo',
				data: [...sales.map((s) => s.revenue), ...(forecast ? [null] : [])],
				borderColor: '#bd2532',
				backgroundColor: mode === 'line' ? 'rgba(189,37,50,0.07)' : '#bd2532',
				borderWidth: 3,
				...(mode === 'line'
					? { tension: 0.35, pointRadius: 4, pointHoverRadius: 7, fill: true }
					: { borderRadius: 6 })
			},
			...(forecast
				? [
						{
							label: 'Estimación ilustrativa',
							data: [
								...sales.map((s, i) =>
									mode === 'line' && i === sales.length - 1 ? s.revenue : null
								),
								forecast.revenue
							],
							borderColor: '#536b99',
							backgroundColor: '#536b99',
							borderWidth: 3,
							...(mode === 'line'
								? { borderDash: [6, 6], pointRadius: 5, tension: 0.35 }
								: { borderRadius: 6 })
						}
					]
				: [])
		];
		try {
			failed = false;
			const config: ChartConfiguration = {
				type: mode,
				data: { labels: periods.map((p) => month(p, true)), datasets },
				options: {
					animation: reduced ? false : { duration: 650 },
					responsive: true,
					maintainAspectRatio: false,
					interaction: { mode: 'index', intersect: false },
					onClick: (_event, elements) => {
						const item = elements[0];
						if (item && item.index < sales.length) onSelect?.(sales[item.index].period);
					},
					onHover: (event, elements) => {
						const target = event.native?.target as HTMLCanvasElement | undefined;
						if (target)
							target.style.cursor = elements.some((e) => e.index < sales.length)
								? 'pointer'
								: 'default';
					},
					plugins: {
						tooltip: {
							backgroundColor: '#2a2024',
							padding: 14,
							cornerRadius: 9,
							callbacks: { label: (item) => `${item.dataset.label}: ${money(Number(item.raw))}` }
						}
					},
					scales: {
						y: {
							beginAtZero: true,
							ticks: { callback: (v) => money(Number(v)), maxTicksLimit: 6, color: '#817579' },
							grid: { color: '#f0eaeb' },
							border: { display: false }
						},
						x: {
							grid: { display: false },
							ticks: { color: '#817579', maxRotation: 45 },
							border: { display: false }
						}
					}
				}
			};
			if (chart && 'type' in chart.config && chart.config.type === mode) {
				chart.data = config.data;
				chart.options = config.options!;
				chart.update();
			} else {
				chart?.destroy();
				chart = new Chart(canvas, config);
			}
		} catch {
			failed = true;
		}
	});
</script>

{#if failed}<p role="alert">
		No se pudo mostrar el gráfico. Puedes consultar la tabla a continuación.
	</p>{/if}
<div class="chart-wrap">
	<canvas
		bind:this={canvas}
		aria-label="Evolución mensual de ingresos. Selecciona el mes del resumen con el control accesible o consulta la tabla inferior."
	></canvas>
</div>
<div class="chart-legend">
	<span><i class="legend-real"></i>Ventas de ejemplo</span>{#if showForecast && data.forecast}<span
			><i class="legend-forecast"></i>Estimación ilustrativa</span
		>{/if}
</div>
<details class="data-details">
	<summary>Consultar valores en tabla</summary>
	<div class="table-scroll">
		<table>
			<caption>Ingresos mensuales demostrativos · vista seleccionada</caption><thead
				><tr><th scope="col">Período</th><th scope="col">Tipo</th><th scope="col">Ingresos</th></tr
				></thead
			><tbody
				>{#each data.sales as sale}<tr
						><th scope="row">{month(sale.period)}</th><td>Venta de ejemplo</td><td
							>{money(sale.revenue)}</td
						></tr
					>{/each}{#if showForecast && data.forecast}<tr
						><th scope="row">{month(data.forecast.period)}</th><td>Estimación ilustrativa</td><td
							>{money(data.forecast.revenue)}</td
						></tr
					>{/if}</tbody
			>
		</table>
	</div>
</details>
