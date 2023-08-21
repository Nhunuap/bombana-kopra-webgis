<script>
  import { createEventDispatcher } from 'svelte';

  /** @type {string|undefined} */
  export let value;

  /** @type {string} */
  export let placeholder = 'Search…';

  /** @type {string} */
  export let name = 'search';

  const dispatch = createEventDispatcher();
  const input = () => dispatch('input');
</script>

<div class="relative w-full text-gray-600 focus-within:text-gray-400">
  <span class="absolute inset-y-0 left-0 flex items-center pl-2">
    <button type="submit" class="focus:shadow-outline p-1 focus:outline-none">
      <svg
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        class="h-5 w-5"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg
      >
    </button>
  </span>
  <input
    bind:value="{value}"
    on:input="{input}"
    name="{name}"
    placeholder="{placeholder}"
    type="search"
    class="w-full rounded-md bg-gray-200 py-3 pl-10 text-sm text-gray-600 shadow-lg focus:bg-white focus:text-gray-900 focus:shadow-sm focus:outline-none"
    autocomplete="off"
  />
</div>
