<script>
  import { page } from '$app/stores';

  import { SvelteUIProvider } from '@svelteuidev/core';
  import '../app.css';
</script>

<svelte:head>
  <title>{$page.data?.title ?? 'Bombana Kopra WEBGIS'}</title>
</svelte:head>

<SvelteUIProvider>
  <slot />
</SvelteUIProvider>
