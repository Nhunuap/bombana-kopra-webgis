<script>
  import { productionYear } from '$lib/stores';

  export let data;
</script>

<div class="flex-none p-4">
  <h3>{data.nama} (Produksi {$productionYear})</h3>
  <p>
    Luas Lahan: {data.luas_lahan} ha &bull; Kapasitas Produksi: {data.kapasitas_produksi} ton/ha
  </p>
  <p></p>
  <p>Produksi:</p>
  <ul>
    <li>Kelapa: {data.kelapa} ton</li>
    <li>Kopra: {data.kopra} ton, {data.jumlah_pabrik_kopra} pabrik</li>
  </ul>
</div>
