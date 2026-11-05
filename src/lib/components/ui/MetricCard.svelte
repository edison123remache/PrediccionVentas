<script lang="ts">
	let {
		label,
		value,
		detail,
		accent = false
	}: { label: string; value: string; detail: string; accent?: boolean } = $props();
</script>

<article class:accent class="metric">
	<p class="eyebrow">{label}</p>
	<p class="metric-value">{value}</p>
	<p class="muted">{detail}</p>
</article>
