<script lang="ts">
	import { API_CONTEXT_KEY } from "$lib";
	import { Api } from "$lib/api";
  import "../app.css";
	import { setContext } from "svelte";
	import AppHeader from "../components/AppHeader.svelte";
  import { page } from "$app/stores";
	import type { Project } from "$lib/models";
	import { goto } from "$app/navigation";

  const api = new Api();
  setContext(API_CONTEXT_KEY, api);

  let { token } = api;
  let selectedProjectId: string = $page.params.id ?? '';
  let projects: Project[] = [];

  $: if (!$token) {
    selectedProjectId = '';
    projects = [];
    goto('/');
  } else {
    loadProjects();
  }

  $: if (selectedProjectId) {
    goto(`/project/${selectedProjectId}`);
  } else {
    goto('/');
  }

  function setToken(value?: string) {
    token.set(value);
  }

   async function loadProjects(force = false) {
    const result = await api?.getProjects(force) ?? [];
    projects = result.sort((a, b) => a.name.localeCompare(b.name));
  }
</script>

<svelte:head>
    <title>Railway Containers</title> 
</svelte:head>
 
<div class="flex flex-col h-screen">
  <AppHeader 
    projects={projects} 
    token={$token}
    bind:selectedProjectId 
    on:clearToken={()=> setToken()} 
    on:refresh={() => loadProjects(true)} 
    on:setToken={(e)=> setToken(e.detail)}  />
  <div class="flex flex-1">
    <main class="flex-1 bg-white px-6 py-4">
      <slot />
    </main>
  </div>
  <footer class="flex bg-gray-800 text-white py-4 px-6 items-center justify-center">Made with love &lt;3 - 2023</footer>
</div>

