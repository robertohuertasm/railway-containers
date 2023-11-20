<script lang="ts">
	import type { Api } from "$lib/api";
	import type { Project } from "$lib/models";
	import { createEventDispatcher, onMount } from "svelte";
	import RefreshButton from "./RefreshButton.svelte";

  const dispatch = createEventDispatcher();
  export let api: Api

  let projects: Project[] = [];
  let selectedProject: string = '';
  let token = api.token;

  async function loadProjects(force = false) {
    const result = await api?.getProjects(force) ?? [];
    projects = result.sort((a, b) => a.name.localeCompare(b.name));
  }

  $: {
      projectSelected(selectedProject);
  }

  $: {
    if ($token) {
      loadProjects();
    } {
      projects = [];
      selectedProject = '';
    }
  }

  function projectSelected(projectId: string) {
    dispatch('onProjectSelected', projectId);
  }
</script>


<div class="flex justify-center">
  {#if projects.length}
    <select bind:value={selectedProject} class="block w-1/2 bg-slate-800 border border-gray-200 text-gray-300 py-2 px-2 pr-8 leading-tight focus:outline-none  focus:border-slate-700">
      <option selected value="">Select a project</option>
      {#each projects as project (project.id)}
      <option value={project.id}>{project.name}</option>
      {/each}
    </select>
    <RefreshButton on:click={() => loadProjects(true)} />
  {:else if $token}
    <p>Loading projects...</p>
  {/if}
</div>



