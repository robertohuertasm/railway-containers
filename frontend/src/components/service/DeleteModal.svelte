<script lang="ts">
	import type { Service } from "$lib/models";
	import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

	export let showModal: boolean;
  export let service: Service;

	let dialog: HTMLDialogElement;
  let deleteValue = '';

	$: if (dialog && showModal) dialog.showModal();

	function close() {
		dialog.close();
		deleteValue = '';
	}

  function onDelete() {
		close();
    dispatch('deleteService', service)
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={close}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation>
    <h2 class="text-2xl mb-5 font-bold">Delete Service</h2>
    <p class="mb-5">Are you sure you want to delete this service?</p>

    <span class="text-sm text-slate-500">Type <p class=" text-sm font-semibold inline">{service.name}</p> to confirm</span>

    <input class="my-4  border-slate-500 w-full border-2  p-2 bg-slate-100 placeholder:text-slate-500 text-black" type="text" placeholder="{service.name}"  bind:value={deleteValue} />

    <div class="flex justify-start space-x-4">
      <button  on:click={close}>Cancel</button>
      {#if deleteValue === service.name}
        <button class="text-red-900 font-bold" on:click={onDelete}>Delete</button>
      {/if}
    </div>
	</div>
</dialog>

<style>
	dialog {
		max-width: 32em;
		border-radius: 0.2em;
		border: none;
		padding: 0;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	button {
		display: block;
	}
</style>
