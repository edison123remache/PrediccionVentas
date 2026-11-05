<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Chart,
		LineController,
		LineElement,
		PointElement,
		CategoryScale,
		LinearScale,
		Tooltip,
		Legend
	} from 'chart.js';
	import type { DashboardData } from '#lib/types/dashboard.js';
	import { money, month } from '#lib/utils/format.js';
	let { data }: { data: DashboardData } = $props();
	let canvas: HTMLCanvasElement;
	let failed = $state(false);
	onMount(() => {
		Chart.register(
			LineController,
			LineElement,
			PointElement,
			CategoryScale,
			LinearScale,
			Tooltip,
			Legend
		);
		const sales = data.sales;
		const forecast = data.forecast;
		const periods = [...sales.map((s) => s.period), ...(forecast ? [forecast.period] : [])];
		let chart: Chart;
		try {
			chart = new Chart(canvas, {
				type: 'line',
				data: {
					labels: periods.map((p) => month(p, true)),
					datasets: [
						{
							label: data.metadata.demonstration ? 'Ventas de ejemplo' : 'Ventas registradas',
							data: [...sales.map((s) => s.revenue), ...(forecast ? [null] : [])],
							borderColor: '#245b57',
							backgroundColor: '#245b57',
							tension: 0.25,
							pointRadius: 4
						},
						...(forecast
							? [
									{
										label: data.metadata.demonstration ? 'Estimación ilustrativa' : 'Pronóstico',
										data: [
											...sales.map((s, i) => (i === sales.length - 1 ? s.revenue : null)),
											forecast.revenue
										],
										borderColor: '#995615',
										backgroundColor: '#995615',
										borderDash: [7, 5],
										pointRadius: 5,
										tension: 0.25
									}
								]
							: [])
					]
				},
				options: {
					animation: false,
					responsive: true,
					maintainAspectRatio: false,
					interaction: { mode: 'index', intersect: false },
					plugins: {
						legend: { position: 'bottom', labels: { padding: 24, usePointStyle: true } },
						tooltip: {
							callbacks: { label: (item) => `${item.dataset.label}: ${money(Number(item.raw))}` }
						}
					},
					scales: {
						y: {
							beginAtZero: true,
							ticks: { callback: (value) => money(Number(value)) },
							grid: { color: '#edf0f0' }
						},
						x: { grid: { display: false } }
					}
				}
			});
		} catch {
			failed = true;
		}
		return () => chart?.destroy();
	});
</script>

{#if failed}<p role="alert">
		No se pudo mostrar el gráfico. Puedes consultar la tabla a continuación.
	</p>{/if}
<div class="chart-wrap">
	<canvas
		bind:this={canvas}
		aria-label="Evolución mensual de ingresos. Los valores también están disponibles en la tabla inferior."
	></canvas>
</div>
<details class="data-details">
	<summary>Consultar valores en tabla</summary>
	<div class="table-scroll">
		<table>
			<caption>Ingresos mensuales {data.metadata.demonstration ? 'demostrativos' : ''}</caption
			><thead
				><tr><th scope="col">Período</th><th scope="col">Tipo</th><th scope="col">Ingresos</th></tr
				></thead
			><tbody
				>{#each data.sales as sale}<tr
						><th scope="row">{month(sale.period)}</th><td
							>{data.metadata.demonstration ? 'Venta de ejemplo' : 'Venta registrada'}</td
						><td>{money(sale.revenue)}</td></tr
					>{/each}{#if data.forecast}<tr
						><th scope="row">{month(data.forecast.period)}</th><td
							>{data.metadata.demonstration ? 'Estimación ilustrativa' : 'Pronóstico'}</td
						><td>{money(data.forecast.revenue)}</td></tr
					>{/if}</tbody
			>
		</table>
	</div>
</details>
