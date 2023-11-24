<script lang="ts">
	import FeatherIcon from './FeatherIcon.svelte';

	export let mode: 'light' | 'dark' = 'light';

	$: modeClasses = mode === 'light' ? 'text-white' : 'text-black';
</script>

<button class="{modeClasses} font-bold py-2 px-4 hover:text-slate-400" on:click>
	<FeatherIcon icon="refresh-cw" />
</button>
