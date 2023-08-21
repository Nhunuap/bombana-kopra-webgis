<script>
  import Map from '$lib/component/Map.svelte';
  import Data from '$lib/component/Data.svelte';
  import Statistic from '$lib/component/Statistic.svelte';
  import About from '$lib/component/About.svelte';

  /** @type {import('./$types').PageData} */
  export let data;

  $: ({ kecamatan } = data);

  const sections = [
    { component: Map, id: 'map' },
    { component: Data, id: 'data' },
    { component: Statistic, id: 'statistic' },
    { component: About, id: 'about' }
  ];
</script>

{#each sections as section}
  <section id="{section.id}" class="py-4">
    <svelte:component this="{section.component}" />
  </section>
{/each}
