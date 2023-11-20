<script lang="ts">
	import type { Deployment } from "$lib/models";
  import FeatherIcon from "../FeatherIcon.svelte";

  export let status: Deployment['status'];

  $: featherIcon = toFeatherIcon(status);

  function toFeatherIcon(status: Deployment['status']): [string, string] {
    switch (status) {
      case 'SUCCESS':
        return ['check-circle', 'text-green-700'];
      case "CRASHED":
      case "FAILED":
        return ['x-circle', 'text-red-900'];
      case "BUILDING":
      case "DEPLOYING":
      case "INITIALIZING":
      case "QUEUED":
      case "WAITING":
      case "REMOVING":
        return ['clock', 'text-gray-900'];
      case "REMOVED":
      case "SKIPPED":
        return ['slash', 'text-gray-900'];
      case "UNKNOWN":
        return ['help-circle', 'text-blue-900'];
      default:
        return ['alert-circle', 'text-red-900'];
    }
  }
</script>

<FeatherIcon icon={featherIcon[0]} css={featherIcon[1]} />
