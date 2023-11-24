<script lang="ts">
	import type { Deployment } from "$lib/models";
	import { onMount } from "svelte";
	import DeploymentIcon from "./DeploymentIcon.svelte";

  export let deployment: Deployment;
</script>
<p class="font-semibold mb-1">Last deployment</p>
<div class="flex justify-start mb-2">
  <DeploymentIcon status={deployment.status}/>
  <p class="ml-2">{deployment.createdAt.toUTCString()}</p>
</div>





