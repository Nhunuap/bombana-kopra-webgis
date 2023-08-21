<script>
  import { Card, Container } from '@svelteuidev/core';
  import { point } from '$db/local/point';
  import SearchBar from './SearchBar.svelte';

  /** @type {string} */
  let inputValue = '';

  let data = point;

  $: if (inputValue.length >= 3) {
    data = point.filter((e) => {
      return (
        e.pemilik.nama.toLowerCase().startsWith(inputValue.toLowerCase()) ||
        e.lokasi.kecamatan.toLowerCase().includes(inputValue.toLowerCase())
      );
    });
  } else {
    data = point;
  }
</script>

<Container>
  <h3 class="py-6 text-2xl font-bold text-zinc-800">Daftar Pabrik Kopra</h3>
  <div class="mb-4">
    <SearchBar bind:value="{inputValue}" />
  </div>
  <Card p="lg" class="rounded-lg bg-gray-200 shadow-lg">
    <Card.Section first padding="lg">
      <div class="relative my-8 mx-4 overflow-x-auto rounded-lg shadow-md">
        <table class="w-full text-left text-sm text-zinc-800">
          <thead class="text-xsuppercase bg-gray-300">
            <tr>
              <th class="py-3 px-6">Pemilik</th>
              <th class="py-3 px-6">Kecamatan</th>
              <th class="py-3 px-6">Telepon</th>
              <th class="py-3 px-6">Jenis Kopra</th>
              <th class="py-3 px-6 text-center">Harga</th>
            </tr>
          </thead>
          <tbody>
            {#each data as p}
              <tr class="border-b border-gray-200 bg-white">
                <td class="whitespace-nowrap py-4 px-6 font-medium text-zinc-800"
                  >{p.pemilik.nama}</td
                >
                <td class="whitespace-nowrap py-4 px-6 font-medium text-zinc-800"
                  >{p.lokasi.kecamatan}</td
                >
                <td class="whitespace-nowrap py-4 px-6 font-mono font-medium text-zinc-800"
                  >{p.pemilik.kontak.no_telp}</td
                >
                <td class="whitespace-nowrap py-4 px-6 font-medium text-zinc-800">
                  {#if p.jenis.putih && p.jenis.hitam}
                    Putih & Hitam
                  {:else if p.jenis.putih}
                    Putih
                  {:else if p.jenis.hitam}
                    Hitam
                  {/if}
                </td>
                <td class="whitespace-nowrap py-4 px-6 font-mono font-medium text-zinc-800">
                  Rp. {p.harga[0]} - Rp. {p.harga[1]}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </Card.Section>
  </Card>
</Container>
