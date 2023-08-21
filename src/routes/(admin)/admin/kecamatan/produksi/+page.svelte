<script>
  import { Button, Container, Menu, Modal, Text } from '@svelteuidev/core';
  import FlashMessage from '$lib/component/FlashMessage.svelte';

  /** @type {import('./$types').PageData} */
  export let data;

  /** @type {import('./$types').ActionData} */
  export let form;

  $: ({ districts, productionYear } = data);
  $: productionYearLabel = productionYear[0].year;

  /**
   * @param {number} year
   */
  async function getProductionOnYear(year) {
    let production = await fetch(`/api/district/production/${year}`);
    if (production.ok) {
      production = await production.json();
      districts = production;
    }
  }

  let districtProduction;

  /**
   * @param {string} name
   * @param {number} year
   */
  async function getDistrictProductionToUpdate(name, year) {
    let data = await fetch(`/api/district/${name}/production/${year}`);
    if (data.ok) {
      data = await data.json();
      districtProduction = data;
    }
  }

  let updateDataModalOpened = false;

  function onKey(event) {
    if (event.key === 'Escape') {
      updateDataModalOpened = false;
    }
  }
</script>

<svelte:window on:keydown="{onKey}" />

<Container>
  <FlashMessage showOn="{form?.updateSuccess}" severity="{'OK'}">
    <p>Berhasil Memperbarui Data</p>
  </FlashMessage>
  <FlashMessage showOn="{form?.updateFailed}" severity="{'ERROR'}">
    <p>Gagal Memperbaui Data</p>
    {#if form?.reason}
      <p class="text-xs font-bold">{form.reason}</p>
    {/if}
  </FlashMessage>
  <div class="flex flex-row space-x-2">
    <Menu>
      <Button slot="control" class="space-x-2 bg-gray-500 text-gray-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-4 w-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
          ></path>
        </svg>

        <Text class="text-gray-200">{productionYearLabel}</Text>
      </Button>
      {#each productionYear as p}
        <Menu.Item
          on:click="{() => {
            if (p.year == productionYearLabel) {
              return;
            }

            productionYearLabel = p.year;
            getProductionOnYear(p.year);
          }}">{p.year}</Menu.Item
        >
      {/each}
    </Menu>
  </div>
  <div class="relative my-2 overflow-x-auto rounded-lg shadow-md">
    <table class="w-full text-left text-sm text-zinc-800">
      <thead class="text-xsuppercase bg-gray-400">
        <tr>
          <th class="py-3 px-6">#</th>
          <th class="py-3 px-6">Kecamatan</th>
          <th class="py-3 px-6 text-right">Lahan (ha)</th>
          <th class="py-3 px-6 text-right">Kapasitas (ton/ha)</th>
          <th class="py-3 px-6 text-right">Kelapa (ton)</th>
          <th class="py-3 px-6 text-right">Kopra (ton)</th>
          <th class="py-3 px-6"></th>
        </tr>
      </thead>
      <tbody>
        {#each districts as district, i}
          <tr class="border-b border-gray-200 bg-white">
            <td class="whitespace-nowrap py-4 px-6 font-medium text-zinc-800">{i + 1}</td>
            <td class="whitespace-nowrap py-4 px-6 font-medium text-zinc-800">{district.name}</td>
            <td class="whitespace-nowrap py-4 px-6 text-right font-medium text-zinc-800">
              {district?.production?.land_area ?? 0}</td
            >
            <td class="whitespace-nowrap py-4 px-6 text-right font-medium text-zinc-800">
              {district?.production?.production_cap ?? 0}</td
            >
            <td class="whitespace-nowrap py-4 px-6 text-right font-medium text-zinc-800">
              {district?.production?.coconut ?? 0}</td
            >
            <td class="whitespace-nowrap py-4 px-6 text-right font-medium text-zinc-800">
              {district?.production?.kopra ?? 0}</td
            >
            <td class="whitespace-nowrap py-4 px-6 font-medium text-zinc-800">
              <div class="flex justify-center space-x-1">
                <button
                  on:click="{async () => {
                    await getDistrictProductionToUpdate(district.name, productionYearLabel);
                    updateDataModalOpened = !updateDataModalOpened;
                  }}"
                  class="rounded bg-slate-500 p-1 text-slate-200 hover:bg-slate-700 hover:text-slate-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="h-4 w-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    ></path>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</Container>

<Modal centered opened="{updateDataModalOpened}" withCloseButton="{false}">
  <form method="POST" action="?/update">
    <input required name="name" type="hidden" value="{districtProduction?.name ?? ''}" />
    <input
      type="hidden"
      name="year"
      value="{districtProduction?.production?.[0]?.year ?? productionYearLabel}"
    />
    <p class="mb-1 block font-bold text-slate-500">Produksi</p>
    <p class="mb-1 block text-slate-500">
      Kecamatan : <span class="font-bold text-slate-700">{districtProduction?.name ?? ''}</span>
    </p>
    <p class="mb-1 block text-slate-500">
      Tahun : <span class="font-bold text-slate-700">{productionYearLabel}</span>
    </p>
    <div class="mb-4 flex space-x-2">
      <div class="w-1/3">
        <label for="area" class="mb-2 block font-medium text-slate-600">Luas Lahan</label>
        <input
          required
          name="area"
          type="text"
          placeholder="Luas Lahan"
          value="{districtProduction?.production?.[0]?.land_area ?? 0}"
          class="focus:shadow-outline w-full rounded-md border-2 border-slate-200 bg-slate-200 p-2 focus:border-slate-400 focus:outline-none"
        />
      </div>
      <div class="w-1/3">
        <label for="cap" class="mb-2 block font-medium text-slate-600">Kapasitas</label>
        <input
          required
          name="cap"
          type="text"
          placeholder="Kapasitas Produksi"
          value="{districtProduction?.production?.[0]?.production_cap ?? 0}"
          class="focus:shadow-outline w-full rounded-md border-2 border-slate-200 bg-slate-200 p-2 focus:border-slate-400 focus:outline-none"
        />
      </div>
      <div class="w-1/3">
        <label for="coconut" class="mb-2 block font-medium text-slate-600">Kelapa</label>
        <input
          required
          name="coconut"
          type="text"
          placeholder="Produksi Kelapa"
          value="{districtProduction?.production?.[0]?.coconut ?? 0}"
          class="focus:shadow-outline w-full rounded-md border-2 border-slate-200 bg-slate-200 p-2 focus:border-slate-400 focus:outline-none"
        />
      </div>
    </div>
    <div class="flex items-center justify-between">
      <button
        type="button"
        on:click="{() => (updateDataModalOpened = !updateDataModalOpened)}"
        class="mt-4 mb-1 rounded border border-red-300 bg-red-200 py-1 px-2 text-red-500 hover:border-red-400 hover:bg-red-300 hover:text-red-600"
      >
        Close
      </button>
      <button
        type="submit"
        class="mt-4 mb-1 rounded border border-slate-400 bg-slate-300 py-1 px-8 text-slate-800 hover:border-slate-500 hover:bg-slate-400 hover:text-slate-900"
      >
        Update
      </button>
    </div>
  </form>
</Modal>
