<script>
  import { Container, Menu } from '@svelteuidev/core';
  import Leaflet from './map/Leaflet.svelte';
  import { polygon } from '$db/local/polygon';
  import { point } from '$db/local/point';
  import { kecamatan } from '$db/local/kecamatan';
  import SearchBar from './SearchBar.svelte';
  import { productionYear } from '$lib/stores';

  /** @type {string} */
  let type;

  /** @type {{ kecamatan: string, pabrik: string }} */
  const pointType = {
    kecamatan: 'Kecamatan',
    pabrik: 'Pabrik'
  };

  const productionYears = [2020, 2021];

  /** @type {string} */
  let inputValue;
</script>

<Container>
  <div class="mb-4 flex items-center justify-center space-x-2">
    <div class="flex-none">
      <Menu class="z-20">
        <button
          slot="control"
          class="rounded-lg bg-gray-200 p-3 text-gray-500 shadow-lg hover:bg-gray-50 hover:text-gray-800 active:bg-slate-100"
        >
          {pointType[type] ?? 'Jenis Titik'}
        </button>
        <Menu.Item
          on:click="{() => {
            type = 'pabrik';
          }}">Pabrik</Menu.Item
        >
        <Menu.Item
          on:click="{() => {
            type = 'kecamatan';
          }}">Kecamatan</Menu.Item
        >
      </Menu>
    </div>
    <div class="flex-none">
      <Menu class="z-20">
        <button
          slot="control"
          class="rounded-lg bg-gray-200 p-3 text-gray-500 shadow-lg hover:bg-gray-50 hover:text-gray-800 active:bg-slate-100"
        >
          {$productionYear > 0 ? $productionYear : 'Tahun'}
        </button>
        {#each productionYears as year}
          <Menu.Item
            on:click="{() => {
              productionYear.set(year);
            }}">{year}</Menu.Item
          >
        {/each}
      </Menu>
    </div>
    <div class="flex-auto">
      <SearchBar bind:value="{inputValue}" />
    </div>
  </div>
  <Leaflet
    markerFeature="{point}"
    geoJsonFeature="{polygon}"
    searchTerm="{inputValue}"
    kecamatan="{kecamatan}"
    type="{type}"
  />
</Container>
