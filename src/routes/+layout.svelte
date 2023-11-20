<script lang="ts">
	import { API_CONTEXT_KEY } from "$lib";
	import { Api } from "$lib/api";
  import { selectedProjectId } from "$lib/stores";
  import "../app.css";
	import { setContext } from "svelte";
	import AppHeader from "../components/AppHeader.svelte";

  const api = new Api();
  setContext(API_CONTEXT_KEY, api);

  $: if (!api.token) {
    selectedProjectId.set(undefined);
  }

  function onProjectSelected(event: CustomEvent<string>) {
    selectedProjectId.set(event.detail);
  }

</script>

 
<div class="flex flex-col h-screen">
  <AppHeader api={api} on:onProjectSelected={onProjectSelected} />
  <div class="flex flex-1">
    <!-- <aside class="bg-gray-200 w-64 px-4 py-6">
      <ul class="list-reset">
        <li class="mb-4"><a href="#" class="text-gray-700 hover:text-gray-900 font-semibold">Widget 1</a></li>
        <li class="mb-4"><a href="#" class="text-gray-700 hover:text-gray-900 font-semibold">Widget 2</a></li>
        <li class="mb-4"><a href="#" class="text-gray-700 hover:text-gray-900 font-semibold">Widget 3</a></li>
      </ul>
    </aside> -->
    <main class="flex-1 bg-white px-6 py-4">
      <slot />
    </main>
  </div>
  <footer class="flex bg-gray-800 text-white py-4 px-6 items-center justify-center">Made with love &lt;3 - 2023</footer>
</div>

