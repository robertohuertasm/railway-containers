
<script lang="ts">
	import type { Service } from "$lib/models";
	import ServiceDeployment from "./Deployment.svelte";
	import ServiceIcon from "./ServiceIcon.svelte";
  import DeleteModal from "./DeleteModal.svelte";
	import FeatherIcon from "../FeatherIcon.svelte";

  export let service: Service;

  let showDeleteModal = false;

  function firstInstanceSource(service: Service): string {
    return service.instances.at(0)?.repo || service.instances.at(0)?.image || '';
  }

</script>

<div class="bg-gray-100 p-6 rounded-lg shadow-md flex flex-col w-full md:w-80 min-w-min">
  <div class="w-full flex flex-row justify-start mb-5 h-1/3">
    <div class="w-16 h-16 mr-5">
      <ServiceIcon service={service}/>
    </div>
    <div class="flex flex-col">
      <p class="font-bold">{service.name}</p>
      <p>{firstInstanceSource(service)}</p>
    </div>
  </div>
  {#if service.deployments.length}
    <ServiceDeployment deployment={service.deployments[0]}/>
  {:else}
    <p class="text-gray-600 font-semibold mb-1">No deployments</p>
  {/if}
 
  <p class="font-semibold mt-4 mb-1">Service creation</p>
  <p class="mb-4">{service.createdAt.toUTCString()}</p>

  <!--Delete button-->
  {#if service.isBeingDeleted}
   Deleting... Please wait
  {:else}
    <button on:click={() => (showDeleteModal = true)}  class="text-red-900 hover:text-red-500 disabled:text-gray-600 w-0">
    <FeatherIcon icon="trash-2" />
    </button>
  {/if}
  
</div>

<DeleteModal bind:showModal={showDeleteModal} service={service} on:deleteService />
