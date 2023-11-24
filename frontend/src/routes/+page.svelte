<script lang="ts">
	import { API_CONTEXT_KEY } from '$lib';
	import type { Api } from '$lib/api';
	import { getContext } from 'svelte';

	let api: Api = getContext(API_CONTEXT_KEY);
	let { token } = api;
</script>

{#if $token}
	<h2 class="text-lg font-semibold my-4">Welcome!</h2>
	<p>Please, select a project.</p>
{:else}
	<h2 class="text-lg font-semibold my-4">Please, log in.</h2>
	<p>
		You must use a <a
			class="text-blue-500 hover:text-blue-700"
			target="_blank"
			href="https://docs.railway.app/deploy/integrations#project-tokens">Railway token</a
		> to log in.
	</p>
{/if}
