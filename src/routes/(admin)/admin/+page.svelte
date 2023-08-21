<script>
  import { Button, Container, Modal, Text } from '@svelteuidev/core';
  import FlashMessage from '$lib/component/FlashMessage.svelte';

  /** @type {import('./$types').PageServerData} */
  export let data;

  /** @type {import('./$types').ActionData} */
  export let form;

  $: ({ factories, districts } = data);

  let factoryToUpdate;
  let factoryToDelete;
  let addDataModalOpened = false;
  let updateDataModalOpened = false;
  let deleteConfirmOpened = false;

  /**
   * @param {KeyboardEvent} event
   */
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
  async function getFactoryToUpdate(name) {
    let data = await fetch(`/api/factory/${name}`);
    if (data.ok) {
      data = await data.json();
      factoryToUpdate = data;
    }
  }

  function openDeleteConfirm(data) {
    factoryToDelete = data;
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
  <div class="relative my-2 overflow-x-scroll rounded-lg shadow-md">
    <table class="w-full text-left text-sm text-zinc-800">
      <thead class="text-xsuppercase bg-gray-400">
        <tr>
          <th class="py-3 px-6">#</th>
          <th class="py-3 px-6">Pemilik</th>
          <th class="py-3 px-6">Kecamatan</th>
          <th class="py-3 px-6 text-right">Telepon</th>
          <th class="py-3 px-6">Jenis Kopra</th>
          <th class="py-3 px-6 text-right">Harga</th>
          <th class="py-3 px-6"></th>
        </tr>
      </thead>
      <tbody>
        {#each factories as factory, i}
          <tr class="border-b border-gray-200 bg-white">
            <td class="whitespace-nowrap py-4 px-6 font-medium text-zinc-800">{i + 1}</td>
            <td class="whitespace-nowrap py-4 px-6 font-medium text-zinc-800"
              >{factory.owner.name}</td
            >
            <td class="whitespace-nowrap py-4 px-6 font-medium text-zinc-800"
              >{factory?.location?.district ?? ''}</td
            >
            <td class="whitespace-nowrap py-4 px-6 text-right font-mono font-medium text-zinc-800"
              >{factory?.owner?.contact?.telp ?? 0}</td
            >
            <td class="whitespace-nowrap py-4 px-6 font-medium text-zinc-800">
              {#if factory?.type?.white && factory?.type?.black}
                Putih & Hitam
              {:else if factory?.type?.white}
                Putih
              {:else if factory?.type?.black}
                Hitam
              {/if}
            </td>
            <td class="whitespace-nowrap py-4 px-6 text-right font-mono font-medium text-zinc-800"
              >{#each factory?.price ?? [] as price}
                Rp. {price}
                <p></p>
              {/each}
            </td>
            <td class="whitespace-nowrap py-4 px-6 font-medium text-zinc-800">
              <div class="flex justify-center space-x-1">
                <button
                  class="rounded bg-slate-500 p-1 text-slate-200 hover:bg-slate-700 hover:text-slate-100"
                  on:click="{async () => {
                    await getFactoryToUpdate(factory.owner.name);
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
                    openDeleteConfirm(factory);
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

<Modal centered size="lg" opened="{addDataModalOpened}" withCloseButton="{false}">
  <form method="POST" action="?/create">
    <input
      name="owner"
      type="text"
      placeholder="Nama Pemilik"
      value="{form?.name ?? ''}"
      class="mb-4 block w-full rounded-md border-2 bg-slate-200 p-2
      focus:outline-none {form?.ownerIsMissing
        ? 'border-red-500'
        : 'border-slate-200'} focus:shadow-outline focus:border-slate-400"
    />
    <p class="mb-1 block font-bold text-slate-500">Koordinat</p>
    <div class="mb-4 flex items-center justify-between space-x-2">
      <input
        name="latitude"
        type="text"
        placeholder="Latitude"
        class="focus:shadow-outline w-full rounded-md border-2 border-slate-200 bg-slate-200 p-2 focus:border-slate-400 focus:outline-none"
      />
      <input
        name="longitude"
        type="text"
        placeholder="Longitude"
        class="focus:shadow-outline w-full rounded-md border-2 border-slate-200 bg-slate-200 p-2 focus:border-slate-400 focus:outline-none"
      />
    </div>
    <p class="mb-1 block font-bold text-slate-500">Lokasi</p>
    <p class="mb-1 block font-bold text-slate-500">Kecamtan</p>
    <select
      name="district"
      class="focus:shadow-outline mb-2 w-full rounded-md border-2 border-slate-200 bg-slate-200 p-2 text-slate-600 focus:border-slate-400 focus:outline-none"
    >
      {#each districts as { name }}
        <option>{name}</option>
      {/each}
    </select>
    <div class="mb-4 flex items-center justify-between space-x-2">
      <input
        name="subdistrict"
        type="text"
        placeholder="Kelurahan"
        class="focus:shadow-outline w-full rounded-md border-2 border-slate-200 bg-slate-200 p-2 focus:border-slate-400 focus:outline-none"
      />
      <input
        name="street"
        type="text"
        placeholder="Jalan"
        class="focus:shadow-outline w-full rounded-md border-2 border-slate-200 bg-slate-200 p-2 focus:border-slate-400 focus:outline-none"
      />
    </div>
    <p class="mb-1 block font-bold text-slate-500">Kontak</p>
    <div class="mb-4 flex items-center justify-between space-x-2">
      <input
        name="email"
        type="email"
        placeholder="Alamat Email"
        class="focus:shadow-outline w-full rounded-md border-2 border-slate-200 bg-slate-200 p-2 focus:border-slate-400 focus:outline-none"
      />
      <input
        name="telp"
        type="text"
        placeholder="Nomor Telepon"
        class="focus:shadow-outline w-full rounded-md border-2 border-slate-200 bg-slate-200 p-2 focus:border-slate-400 focus:outline-none"
      />
    </div>
    <p class="mb-1 block font-bold text-slate-500">Jenis Produksi Kopra</p>
    <div class="mb-4 flex items-center space-x-2">
      <label class="block">
        <input
          name="white"
          type="checkbox"
          class="focus:shadow-outline mr-2 rounded-md border border-slate-200 bg-slate-200 focus:border-slate-400 focus:outline-none"
        /><span class="text-slate-600">Putih</span>
      </label>
      <label class="block">
        <input
          name="black"
          type="checkbox"
          class="focus:shadow-outline mr-2 rounded-md border border-slate-200 bg-slate-200 focus:border-slate-400 focus:outline-none"
        /><span class="text-slate-600">Hitam</span>
      </label>
    </div>
    <input
      name="prices"
      type="text"
      placeholder="Harga"
      class="focus:shadow-outline mb-2 block w-full rounded-md border-2 border-slate-200 bg-slate-200 p-2 focus:border-slate-400 focus:outline-none"
    />
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

<Modal centered size="lg" opened="{updateDataModalOpened}" withCloseButton="{false}">
  <form method="POST" action="?/update">
    <input
      name="owner"
      type="text"
      placeholder="Nama Pemilik"
      value="{factoryToUpdate.owner.name}"
      class="mb-4 block w-full rounded-md border-2 bg-slate-200 p-2
      focus:outline-none {form?.ownerIsMissing
        ? 'border-red-500'
        : 'border-slate-200'} focus:shadow-outline focus:border-slate-400"
    />
    <p class="mb-1 block font-bold text-slate-500">Koordinat</p>
    <div class="mb-4 flex items-center justify-between space-x-2">
      <input
        name="latitude"
        type="text"
        placeholder="Latitude"
        value="{factoryToUpdate?.coordinate?.lat ?? ''}"
        class="focus:shadow-outline w-full rounded-md border-2 border-slate-200 bg-slate-200 p-2 focus:border-slate-400 focus:outline-none"
      />
      <input
        name="longitude"
        type="text"
        placeholder="Longitude"
        value="{factoryToUpdate?.coordinate?.long ?? ''}"
        class="focus:shadow-outline w-full rounded-md border-2 border-slate-200 bg-slate-200 p-2 focus:border-slate-400 focus:outline-none"
      />
    </div>
    <p class="mb-1 block font-bold text-slate-500">Lokasi</p>
    <p class="mb-1 block font-bold text-slate-500">Kecamtan</p>
    <select
      name="district"
      class="focus:shadow-outline mb-2 w-full rounded-md border-2 border-slate-200 bg-slate-200 p-2 text-slate-600 focus:border-slate-400 focus:outline-none"
    >
      {#each districts as { name }}
        {#if name === factoryToUpdate?.location?.district}
          <option selected>{name}</option>
        {:else}
          <option>{name}</option>
        {/if}
      {/each}
    </select>
    <div class="mb-4 flex items-center justify-between space-x-2">
      <input
        name="subdistrict"
        type="text"
        placeholder="Kelurahan"
        value="{factoryToUpdate?.location?.subdistrict ?? ''}"
        class="focus:shadow-outline w-full rounded-md border-2 border-slate-200 bg-slate-200 p-2 focus:border-slate-400 focus:outline-none"
      />
      <input
        name="street"
        type="text"
        placeholder="Jalan"
        value="{factoryToUpdate?.location?.street ?? ''}"
        class="focus:shadow-outline w-full rounded-md border-2 border-slate-200 bg-slate-200 p-2 focus:border-slate-400 focus:outline-none"
      />
    </div>
    <p class="mb-1 block font-bold text-slate-500">Kontak</p>
    <div class="mb-4 flex items-center justify-between space-x-2">
      <input
        name="email"
        type="email"
        placeholder="Alamat Email"
        value="{factoryToUpdate?.owner?.contact?.email ?? ''}"
        class="focus:shadow-outline w-full rounded-md border-2 border-slate-200 bg-slate-200 p-2 focus:border-slate-400 focus:outline-none"
      />
      <input
        name="telp"
        type="text"
        placeholder="Nomor Telepon"
        value="{factoryToUpdate?.owner?.contact?.telp ?? ''}"
        class="focus:shadow-outline w-full rounded-md border-2 border-slate-200 bg-slate-200 p-2 focus:border-slate-400 focus:outline-none"
      />
    </div>
    <p class="mb-1 block font-bold text-slate-500">Jenis Produksi Kopra</p>
    <div class="mb-4 flex items-center space-x-2">
      <label class="block">
        <input
          name="white"
          type="checkbox"
          checked="{factoryToUpdate?.type?.white}"
          class="focus:shadow-outline mr-2 rounded-md border border-slate-200 bg-slate-200 focus:border-slate-400 focus:outline-none"
        /><span class="text-slate-600">Putih</span>
      </label>
      <label class="block">
        <input
          name="black"
          type="checkbox"
          checked="{factoryToUpdate?.type?.black}"
          class="focus:shadow-outline mr-2 rounded-md border border-slate-200 bg-slate-200 focus:border-slate-400 focus:outline-none"
        /><span class="text-slate-600">Hitam</span>
      </label>
    </div>
    <input
      name="prices"
      type="text"
      placeholder="Harga"
      value="{factoryToUpdate?.price?.join(' ')}"
      class="focus:shadow-outline mb-2 block w-full rounded-md border-2 border-slate-200 bg-slate-200 p-2 focus:border-slate-400 focus:outline-none"
    />
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
    <input type="hidden" name="name" value="{factoryToDelete.owner.name}" />
    <h4 class="w-full text-center text-lg font-semibold">Data Berikut akan dihapus</h4>
    <div class="my-4 grid grid-cols-2 gap-2">
      <div class="text-right font-light">Pabrik</div>
      <div class="font-medium">{factoryToDelete.owner.name}</div>
      <div class="text-right font-light">Kecamatan</div>
      <div class="font-medium">{factoryToDelete.location?.district ?? ''}</div>
      <div class="text-right font-light">Kelurahan</div>
      <div class="font-medium">{factoryToDelete.location?.subdistrict ?? ''}</div>
      <div class="text-right font-light">Jalan</div>
      <div class="font-medium">{factoryToDelete.location?.street ?? ''}</div>
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
