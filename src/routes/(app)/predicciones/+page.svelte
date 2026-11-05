<script lang="ts">
	import PlannedModule from '#lib/components/ui/PlannedModule.svelte';
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<PlannedModule module={data.module} />
