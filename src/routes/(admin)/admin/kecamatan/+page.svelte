<script>
  import { Button, Container, Modal, Text } from '@svelteuidev/core';
  import FlashMessage from '$lib/component/FlashMessage.svelte';

  /** @type {import('./$types').PageServerData} */
  export let data;

  /** @type {import('./$types').ActionData} */
  export let form;

  $: ({ districts } = data);

  let addDataModalOpened = false;
  let updateDataModalOpened = false;
  let deleteConfirmOpened = false;
  let districtToUpdate;
  let districtToDelete;

  function onKey(event) {
    if (event.key === 'Escape') {
      addDataModalOpened = false;
      updateDataModalOpened = false;
      deleteConfirmOpened = false;
    }
  }

  /**
   * @param {string} name
   */
  async function getDistrictToUpdate(name) {
    let data = await fetch(`/api/district/${name}`);
    if (data.ok) {
      data = await data.json();
      districtToUpdate = data;
    }
  }

  function openDeleteConfirm(data) {
    districtToDelete = data;
    deleteConfirmOpened = true;
  }
</script>

<svelte:window on:keydown="{onKey}" />

<Container>
  <FlashMessage showOn="{form?.insertSuccess}" severity="{'OK'}">
    <p>Berhasil Menambahkan Data</p>
  </FlashMessage>
  <FlashMessage showOn="{form?.insertFailed}" severity="{'ERROR'}">
    <p>Gagal Menambahkan Data</p>
  </FlashMessage>
  <FlashMessage showOn="{form?.updateSuccess}" severity="{'OK'}">
    <p>Berhasil Memperbarui Data</p>
  </FlashMessage>
  <FlashMessage showOn="{form?.updateFailed}" severity="{'ERROR'}">
    <p>Gagal Memperbarui Data</p>
  </FlashMessage>
  <FlashMessage showOn="{form?.deleteSuccess}" severity="{'OK'}">
    <p>Berhasil Menghapus Data</p>
  </FlashMessage>
  <FlashMessage showOn="{form?.requiredIsMissing}" severity="{'ERROR'}">
    <p>Missing filed: {form?.field}</p>
  </FlashMessage>
  <Button
    class="bg-gray-800 text-gray-200"
    on:click="{() => (addDataModalOpened = !addDataModalOpened)}"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="h-4 w-4"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
    </svg>
    <Text class="px-8 text-gray-200">Tambah</Text>
  </Button>
  <div class="relative my-2 overflow-x-auto rounded-lg shadow-md">
    <table class="table-fixed text-left text-sm text-zinc-800">
      <thead class="text-xsuppercase bg-gray-400">
        <tr>
          <th class="w-1 py-2 px-6" rowspan="2">#</th>
          <th class="py-2 px-6" rowspan="2">Nama</th>
          <th class="w-full border-b border-b-gray-500 py-2 px-6 text-center" colspan="2"
            >Koordinat</th
          >
          <th class="py-2 px-6" rowspan="2"></th>
        </tr>
        <tr>
          <th class="py-2 px-6 text-center">Lat.</th>
          <th class="py-2 px-6 text-center">Long.</th>
        </tr>
      </thead>
      <tbody>
        {#each districts as district, i}
          <tr class="border-b border-gray-200 bg-white">
            <td class="w-1 whitespace-nowrap py-4 px-6 font-medium text-zinc-800">{i + 1}</td>
            <td class="whitespace-nowrap py-4 px-6 font-medium text-zinc-800">{district.name}</td>
            <td class="whitespace-nowrap py-4 px-6 text-center font-medium text-zinc-800"
              >{district?.coordinate?.lat ?? 0}</td
            >
            <td class="whitespace-nowrap py-4 px-6 text-center font-medium text-zinc-800"
              >{district?.coordinate?.long ?? 0}</td
            >
            <td class="whitespace-nowrap py-4 px-6 font-medium text-zinc-800">
              <div class="flex justify-center space-x-1">
                <button
                  class="rounded bg-slate-500 p-1 text-slate-200 hover:bg-slate-700 hover:text-slate-100"
                  on:click="{async () => {
                    await getDistrictToUpdate(district.name);
                    updateDataModalOpened = !updateDataModalOpened;
                  }}"
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
                <button
                  on:click="{() => {
                    openDeleteConfirm(district);
                  }}"
                  class="rounded border border-slate-300 p-1 text-slate-400 hover:border-red-600 hover:bg-red-400 hover:text-slate-100"
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
                      d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
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

<Modal centered opened="{addDataModalOpened}" withCloseButton="{false}">
  <form method="POST" action="?/create">
    <input
      required
      name="name"
      type="text"
      placeholder="Nama Kecamatan"
      value="{form?.name ?? ''}"
      class="mb-4 block w-full rounded-md border-2 bg-slate-200 p-2
      focus:outline-none {form?.ownerIsMissing
        ? 'border-red-500'
        : 'border-slate-200'} focus:shadow-outline focus:border-slate-400"
    />
    <p class="mb-1 block font-bold text-slate-500">Koordinat</p>
    <div class="mb-4 flex items-center justify-between space-x-2">
      <input
        required
        name="latitude"
        type="text"
        placeholder="Latitude"
        class="focus:shadow-outline w-full rounded-md border-2 border-slate-200 bg-slate-200 p-2 focus:border-slate-400 focus:outline-none"
      />
      <input
        required
        name="longitude"
        type="text"
        placeholder="Longitude"
        class="focus:shadow-outline w-full rounded-md border-2 border-slate-200 bg-slate-200 p-2 focus:border-slate-400 focus:outline-none"
      />
    </div>
    <div class="flex items-center justify-between">
      <button
        type="button"
        on:click="{() => (addDataModalOpened = !addDataModalOpened)}"
        class="mt-4 mb-1 rounded border border-red-300 bg-red-200 py-1 px-2 text-red-500 hover:border-red-400 hover:bg-red-300 hover:text-red-600"
      >
        Close
      </button>
      <button
        type="submit"
        class="mt-4 mb-1 rounded border border-slate-400 bg-slate-300 py-1 px-8 text-slate-800 hover:border-slate-500 hover:bg-slate-400 hover:text-slate-900"
      >
        Add
      </button>
    </div>
  </form>
</Modal>

<Modal centered opened="{updateDataModalOpened}" withCloseButton="{false}">
  <form method="POST" action="?/update">
    <input
      required
      name="name"
      type="text"
      placeholder="Nama Kecamatan"
      value="{districtToUpdate?.name ?? ''}"
      class="focus:shadow-outline mb-4 block w-full rounded-md border-2 border-slate-200 bg-slate-200 p-2 focus:border-slate-400 focus:outline-none"
    />
    <p class="mb-1 block font-bold text-slate-500">Koordinat</p>
    <div class="mb-4 flex space-x-2">
      <div class="w-1/2">
        <label for="latitude" class="mb-2 block font-medium text-slate-600">Latitude</label>
        <input
          required
          name="latitude"
          type="text"
          placeholder="Latitude"
          value="{districtToUpdate?.coordinate?.lat ?? ''}"
          class="focus:shadow-outline w-full rounded-md border-2 border-slate-200 bg-slate-200 p-2 focus:border-slate-400 focus:outline-none"
        />
      </div>
      <div class="w-1/2">
        <label for="longitude" class="mb-2 block font-medium text-slate-600">Longitude</label>
        <input
          required
          name="longitude"
          type="text"
          placeholder="Longitude"
          value="{districtToUpdate?.coordinate?.long ?? ''}"
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

<Modal centered opened="{deleteConfirmOpened}" withCloseButton="{false}">
  <form method="POST" action="?/delete">
    <input type="hidden" name="name" value="{districtToDelete.name}" />
    <h4 class="w-full text-center text-lg font-semibold">Data Berikut akan dihapus</h4>
    <div class="my-4 grid grid-cols-2 gap-2">
      <div class="font-light">Kecamatan</div>
      <div class="font-medium">{districtToDelete.name}</div>
      <div class="font-light">Latitude</div>
      <div class="font-medium">{districtToDelete.coordinate.lat ?? ''}</div>
      <div class="font-light">Longitude</div>
      <div class="font-medium">{districtToDelete.coordinate.long ?? ''}</div>
    </div>
    <div class="mt-2 flex flex-col space-y-1">
      <button
        type="button"
        on:click="{() => (deleteConfirmOpened = !deleteConfirmOpened)}"
        class="w-full rounded border border-red-300 bg-red-200 py-1 text-red-500 hover:border-red-400 hover:bg-red-300 hover:text-red-600"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="w-full rounded border border-slate-400 bg-slate-300 py-1 text-slate-800 hover:border-slate-500 hover:bg-slate-400 hover:text-slate-900"
      >
        Continue
      </button>
    </div>
  </form>
</Modal>
