<script lang="ts">
  export let icon: string;
  export let css: string | undefined = undefined;

</script>

<svg class="{css ?? ''}"
  width="24"
  height="24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <use href="feather-sprite.svg#{icon}" />
</svg>
