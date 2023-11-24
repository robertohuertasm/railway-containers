<style lang="postcss">
  :global(html) {
    background-color: theme(colors.gray.100);
  }
</style>

<script lang="ts">
	import { API_CONTEXT_KEY } from "$lib";
	import type { Api } from "$lib/api";
	import type { ProjectInfo, Service } from "$lib/models";
	import { getContext, onDestroy, onMount } from "svelte";
	import Loading from "../../../components/Loading.svelte";
  import ServiceItem from "../../../components/service/Service.svelte";
	import RefreshButton from "../../../components/RefreshButton.svelte";
	import AddImageModal from "../../../components/AddImageModal.svelte";
	import { page } from "$app/stores";

  let api: Api = getContext(API_CONTEXT_KEY);
  let { token } = api;
  let projectInfo: ProjectInfo | undefined;
  let refreshInterval: number | undefined;
  let showAddImageModal = false;
  
  $: projectId = $page.params.id;

  $: {
    if (projectId) {
      loadProjectInfo(projectId);
    } else {
      projectInfo = undefined;
    }
  }

  onMount(() => {
   refreshInterval = setInterval(() => {
      if (projectInfo && !projectInfo.services.some(s => s.isBeingDeleted)) {
        loadProjectInfo(projectInfo.id, true);
      }
    }, 10000) as unknown as number;
  });

  onDestroy(() => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }
  });

  async function loadProjectInfo(projectId: string, force = false) {
    try {
      projectInfo = await api.getInfoByProjectId(projectId, force);
    } catch (error) {
      // TODO: (ROB) warn the user properly
      console.error(error);
      projectInfo = undefined;
    }
  }

  async function onDeleteService(event: CustomEvent<Service>) {
    const service = event.detail;
    
    let serviceToModify = projectInfo?.services.find(s => s.id === service.id);
    if (serviceToModify) {
      serviceToModify.isBeingDeleted = true;
      projectInfo = projectInfo;
    }

    const result = await api.deleteService(service.id, service.projectId);
    // reload project info: the previous method will have handled the cache invalidation
    loadProjectInfo(service.projectId);
    if(!result) {
      // TODO: (ROB) warn the user properly
      console.error(`Failed to delete service ${service.id}`);
      if (serviceToModify) {
        serviceToModify.isBeingDeleted = false;
        projectInfo = projectInfo;
      }
    }
  }

  async function onRefresh() {
    if (projectInfo) {
      await loadProjectInfo(projectInfo.id, true);
    }
  }

  async function createService(event: CustomEvent<string>) {
    const image = event.detail;
    if (!image) {
      return;
    }
    if (projectInfo) {
      const result = await api.createContainer(projectInfo.id, image);
      if (result) {
        await loadProjectInfo(projectInfo.id);
      } else {
        // TODO: (ROB) warn the user properly
        console.error('Failed to create service');
      }
    }
  }

</script>

{#if projectInfo}
  <div class="flex mb-4 items-center">
    <h2 class="text-lg font-semibold ">Project Information</h2> 
    <RefreshButton on:click={onRefresh} mode="dark"/>
    <button on:click={() => (showAddImageModal = true)} class="ml-auto text-gray-500 hover:text-gray-800 focus:outline>">+ ADD IMAGE</button>
  </div>
  <p><b>Name</b>: {projectInfo.name}</p>
  <p><b>Description</b>: {projectInfo.description}</p>
  <h2 class="text-lg font-semibold my-4">Services</h2>
  <div class="flex flex-wrap gap-8">
    {#if projectInfo.services.length}
      {#each projectInfo.services as service (service.id)}
      <ServiceItem service={service} on:deleteService={onDeleteService}/>
      {/each}
    {:else}
      <p class="text-gray-600 font-semibold mb-1">No services</p>
    {/if}
  </div>
{:else if $token && projectId}
  <Loading/>
{/if}

<AddImageModal bind:showModal={showAddImageModal} on:createService={createService}/>
