<script lang="ts">
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { money } from '#lib/utils/format.js';
	let {
		label,
		amount,
		detail,
		accent = false,
		percentage = false,
		series = []
	}: {
		label: string;
		amount: number | null;
		detail: string;
		accent?: boolean;
		percentage?: boolean;
		series?: number[];
	} = $props();
	const counter = new Tween(0, { duration: 850, easing: cubicOut });
	$effect(() => {
		void counter.set(amount ?? 0, {
			duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 850
		});
	});
	const format = (n: number) =>
		percentage
			? `${n > 0 ? '+' : ''}${n.toLocaleString('es-EC', { maximumFractionDigits: 1 })} %`
			: money(n);
	let points = $derived.by(() => {
		if (series.length < 2) return '';
		const min = Math.min(...series),
			spread = Math.max(...series) - min || 1;
		return series
			.map((v, i) => `${(i / (series.length - 1)) * 110},${35 - ((v - min) / spread) * 28}`)
			.join(' ');
	});
</script>

<article class:accent class="metric">
	<div class="metric-top">
		<p class="eyebrow">{label}</p>
		<span class="metric-symbol" aria-hidden="true"
			>{#if percentage}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
					><path d="M5 17 18 4M6 4h12v12" /></svg
				>{:else}${/if}</span
		>
	</div>
	<p class="metric-value">
		<span class="sr-only">{amount === null ? 'No disponible' : format(amount)}</span><span
			aria-hidden="true">{amount === null ? 'No disponible' : format(counter.current)}</span
		>
	</p>
	<div class="metric-bottom">
		<p class="muted">{detail}</p>
		{#if points}<svg class="sparkline" viewBox="0 0 112 40" aria-hidden="true"
				><polyline
					{points}
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/></svg
			>{/if}
	</div>
</article>
