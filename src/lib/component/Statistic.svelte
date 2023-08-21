<script>
  import { Card, Container, Menu } from '@svelteuidev/core';
  import { afterUpdate, onDestroy, onMount } from 'svelte';
  import Chart from 'chart.js/auto/auto';

  import { kecamatan } from '$db/local/kecamatan';
  import { productionYear, productionArea } from '$lib/stores';

  let barChart;
  let prodCapBarChart;
  let lineChart;

  let barChartElement;
  let prodCapBarChartElement;
  let lineChartElement;

  const productionYears = [2020, 2021];
  let selectedProductionYear = 2020;

  let labels = Object.keys(kecamatan).filter(
    (e) => kecamatan[e].produksi.find((e) => e.tahun === selectedProductionYear).kopra > 0
  );

  let selectedProductionArea = labels[0];
  let production = [];
  let rawProduction = [];
  let productionCapacity = [];
  Object.keys(kecamatan).forEach((e) => {
    const k = kecamatan[e];
    const p = k.produksi.find((e) => e.tahun === selectedProductionYear) ?? {};
    if (p.kopra > 0) {
      production.push(p.kopra);
      rawProduction.push(p.kelapa);
      productionCapacity.push(p.kapasitas_produksi);
    }
  });

  function updateBarChartDataset(year) {
    labels = Object.keys(kecamatan).filter(
      (e) => kecamatan[e].produksi.find((e) => e.tahun === year).kopra > 0
    );

    production = [];
    rawProduction = [];
    productionCapacity = [];
    Object.keys(kecamatan).forEach((e) => {
      const k = kecamatan[e];
      const p = k.produksi.find((e) => e.tahun === year) ?? {};
      if (p.kopra > 0) {
        production.push(p.kopra);
        rawProduction.push(p.kelapa);
        productionCapacity.push(p.kapasitas_produksi);
      }
    });
  }

  const barChartData = {
    labels: labels,
    datasets: [
      {
        label: 'Produksi Kopra (ton)',
        data: production,
        backgroundColor: '#ef4444'
      },
      {
        label: 'Produksi Kelapa (ton)',
        data: rawProduction,
        backgroundColor: '#22c55e'
      }
    ]
  };

  const prodCapBarChartData = {
    labels: labels,
    datasets: [
      {
        label: 'Kapasitas Produksi (ton/ha)',
        data: productionCapacity,
        backgroundColor: '#14b8a6'
      }
    ]
  };

  const lineChartLabel = kecamatan[selectedProductionArea].produksi.map((e) => e.tahun);
  const lineChartData = {
    labels: lineChartLabel,
    datasets: [
      {
        label: 'Produksi Kopra (ton)',
        data: kecamatan[selectedProductionArea].produksi.map((e) => e.kopra),
        backgroundColor: '#ef4444',
        borderColor: '#ef4444'
      },
      {
        label: 'Produksi Kelapa (ton)',
        data: kecamatan[selectedProductionArea].produksi.map((e) => e.kelapa),
        backgroundColor: '#22c55e',
        borderColor: '#22c55e'
      },
      {
        label: 'Kapasitas Produksi (ton/ha)',
        data: kecamatan[selectedProductionArea].produksi.map((e) => e.kapasitas_produksi),
        backgroundColor: '#14b8a6',
        borderColor: '#14b8a6'
      }
    ]
  };

  const barConfig = {
    type: 'bar',
    data: barChartData,
    options: {
      scales: { y: { beginAtZero: true } },
      plugins: {
        title: {
          display: true,
          text: `${labels.length} Kecamatan Pemroduksi Kopra`
        }
      }
    }
  };

  const prodCapBarConfig = {
    type: 'bar',
    data: prodCapBarChartData,
    options: {
      scales: { y: { beginAtZero: true } },
      plugins: {
        title: {
          display: true,
          text: `Kapasitas Produksi ${labels.length} Kecamatan Pemroduksi Kopra`
        }
      }
    }
  };

  const lineConfig = {
    type: 'line',
    data: lineChartData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: `Produktivitas Kecamatan ${selectedProductionArea}`
        }
      }
    }
  };

  const unsubscrobeProductionYear = productionYear.subscribe((v) => {
    if (v > 0) {
      selectedProductionYear = v;
      updateBarChartDataset(selectedProductionYear);
    }
  });

  const unsubscrobeProductionArea = productionArea.subscribe((v) => {
    if (v !== '') {
      selectedProductionArea = v;
    }
  });

  onMount(() => {
    const barContex = barChartElement.getContext('2d');
    const prodCapBarContext = prodCapBarChartElement.getContext('2d');
    const lineContext = lineChartElement.getContext('2d');

    barChart = new Chart(barContex, barConfig);
    prodCapBarChart = new Chart(prodCapBarContext, prodCapBarConfig);
    lineChart = new Chart(lineContext, lineConfig);
  });

  afterUpdate(() => {
    barChart.options.plugins.title.text = `${labels.length} Kecamatan Pemroduksi Kopra`;
    barChart.data.labels = labels;
    barChart.data.datasets = [
      {
        label: 'Produksi Kopra (ton)',
        data: production,
        backgroundColor: '#ef4444'
      },
      {
        label: 'Produksi Kelapa (ton)',
        data: rawProduction,
        backgroundColor: '#22c55e'
      }
    ];
    barChart.update();

    prodCapBarChart.options.plugins.title.text = `Kapasitas Produksi ${labels.length} Kecamatan Pemroduksi Kopra`;
    prodCapBarChart.data.labels = labels;
    prodCapBarChart.data.datasets = [
      {
        label: 'Kapasitas Produksi (ton/ha)',
        data: productionCapacity,
        backgroundColor: '#14b8a6'
      }
    ];
    prodCapBarChart.update();

    lineChart.data.datasets = [
      {
        label: 'Produksi Kopra (ton)',
        data: kecamatan[selectedProductionArea].produksi.map((e) => e.kopra),
        backgroundColor: '#ef4444',
        borderColor: '#ef4444'
      },
      {
        label: 'Produksi Kelapa (ton)',
        data: kecamatan[selectedProductionArea].produksi.map((e) => e.kelapa),
        backgroundColor: '#22c55e',
        borderColor: '#22c55e'
      },
      {
        label: 'Kapasitas Produksi (ton/ha)',
        data: kecamatan[selectedProductionArea].produksi.map((e) => e.kapasitas_produksi),
        backgroundColor: '#14b8a6',
        borderColor: '#14b8a6'
      }
    ];
    lineChart.options.plugins.title.text = `Produktivitas Kecamatan ${selectedProductionArea}`;
    lineChart.update();
  });

  onDestroy(() => {
    unsubscrobeProductionArea();
    unsubscrobeProductionYear();
  });
</script>

<Container>
  <h3 class="py-6 text-2xl font-bold text-zinc-800">
    Perbandingan Kapasitas Produksi, Produksi Kelapa & Produksi Kopra
  </h3>
  <div class="mb-4 flex items-start justify-start space-x-2">
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
  </div>

  <Card p="lg" class="rounded-lg bg-slate-200 shadow-lg">
    <Card.Section padding="lg" class="py-4 px-8">
      <canvas bind:this="{barChartElement}" width="{100}" height="{50}"></canvas>
    </Card.Section>
    <Card.Section padding="lg" class="py-4 px-8">
      <canvas bind:this="{prodCapBarChartElement}" width="{100}" height="{50}"></canvas>
    </Card.Section>
  </Card>

  <div class="my-4 flex items-start justify-start space-x-2">
    <div class="flex-none">
      <Menu class="z-20">
        <button
          slot="control"
          class="rounded-lg bg-gray-200 p-3 text-gray-500 shadow-lg hover:bg-gray-50 hover:text-gray-800 active:bg-slate-100"
        >
          {$productionArea !== '' ? $productionArea : 'Kecamatan'}
        </button>
        {#each labels as label}
          <Menu.Item
            on:click="{() => {
              productionArea.set(label);
            }}">{label}</Menu.Item
          >
        {/each}
      </Menu>
    </div>
  </div>
  <Card p="lg" class="rounded-lg bg-slate-200 shadow-lg">
    <Card.Section padding="lg" class="px-8 pb-4">
      <canvas bind:this="{lineChartElement}" width="{100}" height="{50}"></canvas>
    </Card.Section>
  </Card>
</Container>
