<script lang="ts">
	import type { Project } from '$lib/models';
	import RefreshButton from './RefreshButton.svelte';

	export let projects: Project[] = [];
	export let selectedProjectId: string = '';
</script>

<div class="flex justify-center">
	{#if projects.length}
		<select
			bind:value={selectedProjectId}
			class="block w-1/2 bg-slate-800 border border-gray-200 text-gray-300 py-2 px-2 pr-8 leading-tight focus:outline-none focus:border-slate-700"
		>
			<option selected value="">Select a project</option>
			{#each projects as project (project.id)}
				<option value={project.id}>{project.name}</option>
			{/each}
		</select>
		<RefreshButton on:click />
	{/if}
</div>
