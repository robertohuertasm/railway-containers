<script lang="ts">
	import ProjectList from './ProjectList.svelte';
	import type { Project } from '$lib/models';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let selectedProjectId: string;
	export let projects: Project[] = [];
	export let token = '';

	$: tmpToken = token;

	function onSetToken() {
		dispatch('setToken', tmpToken);
	}

	function onClearToken() {
		dispatch('clearToken');
	}

	function onRefresh() {
		dispatch('refresh');
	}
</script>

<header class="bg-gray-800 text-white py-4 px-6 flex items-center justify-between">
	<div class="flex items-center">
		<svg
			class="rounded-full logo w-6 h-6 md:w-8 md:h-8 mr-2"
			aria-label="Railway Logo"
			width="1024"
			height="1024"
			viewBox="0 0 1024 1024"
			fill="none"
			><path
				d="M4.756 438.175A520.713 520.713 0 0 0 0 489.735h777.799c-2.716-5.306-6.365-10.09-10.045-14.772-132.97-171.791-204.498-156.896-306.819-161.26-34.114-1.403-57.249-1.967-193.037-1.967-72.677 0-151.688.185-228.628.39-9.96 26.884-19.566 52.942-24.243 74.14h398.571v51.909H4.756ZM783.93 541.696H.399c.82 13.851 2.112 27.517 3.978 40.999h723.39c32.248 0 50.299-18.297 56.162-40.999ZM45.017 724.306S164.941 1018.77 511.46 1024c207.112 0 385.071-123.006 465.907-299.694H45.017Z"
				fill="#fff"
			/><path
				d="M511.454 0C319.953 0 153.311 105.16 65.31 260.612c68.771-.144 202.704-.226 202.704-.226h.031v-.051c158.309 0 164.193.707 195.118 1.998l19.149.706c66.7 2.224 148.683 9.384 213.19 58.19 35.015 26.471 85.571 84.896 115.708 126.52 27.861 38.499 35.876 82.756 16.933 125.158-17.436 38.97-54.952 62.215-100.383 62.215H16.69s4.233 17.944 10.58 37.751h970.632A510.385 510.385 0 0 0 1024 512.218C1024.01 229.355 794.532 0 511.454 0Z"
				fill="#fff"
			/></svg
		>
		<h1 class="text-lg font-semibold">Railway Containers</h1>
	</div>
	<div class="items-center flex-auto">
		<ProjectList {projects} bind:selectedProjectId on:click={onRefresh} />
	</div>
	<div class="flex items-center">
		{#if token}
			<svg
				class="rounded-full logo w-6 h-6 md:w-8 md:h-8 mr-2"
				width="800px"
				height="800px"
				viewBox="0 0 24 24"
				fill="none"
			>
				<path
					d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
					stroke="#fff"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
					stroke="#fff"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/></svg
			>
			<button class="mr-4 hover:text-slate-400" on:click={onClearToken}>Sign out</button>
		{:else}
			<input
				class="p-2 bg-slate-300 placeholder:text-slate-500 text-black w-96"
				type="text"
				placeholder="Set your API key"
				bind:value={tmpToken}
			/>
			<button
				class="font-bold py-2 px-4 bg-blue-500 text-white hover:bg-blue-700"
				on:click={onSetToken}>Set Token</button
			>
		{/if}
	</div>
</header>
