<script>
  import { onMount, afterUpdate, onDestroy } from 'svelte';
  import { Card } from '@svelteuidev/core';
  import PointInfoCard from './PointInfoCard.svelte';
  import PolygonInfoCard from './PolygonInfoCard.svelte';
  import { productionYear } from '$lib/stores';

  /** @type {Array<{}>} */
  export let markerFeature;

  /** @type {any} */
  export let kecamatan;

  /** @type {any} */
  export let geoJsonFeature;

  /** @type {string} */
  export let type;

  /** @type {string} */
  export let searchTerm = '';

  /** @type {import('leaflet')} */
  let leaflet;

  /** @type {import('leaflet').Map} */
  let map;

  /** @type {HTMLElement} */
  let mapElement;

  /** @type {import('leaflet').GeoJSON} */
  let geoJsonLayer;

  /** @type {import('leaflet').Control} */
  let heatMapLegend;

  /** @type {import('leaflet').Marker[]} */
  let pabrikMarkers = [];

  /** @type {import('leaflet').Marker[]} */
  let kecamatanMarkers = [];

  /** @type {import('leaflet').CircleMarker[]} */
  let kecamatanCircleMarkers = [];

  /** @type {import('leaflet').CircleMarker[]} */
  let circleMarkers = [];

  /** @type {import('leaflet').LatLngExpression} */
  const initialCord = [-4.9456, 121.7869];

  /** @type {number} */
  const initialZoom = 10;

  let fromPoint = false;
  let fromPolygon = false;
  let showPointInfoCard = false;
  let showPolygonInfoCard = false;

  /** @type {any} */
  let pabrik;

  /** @type {any} */
  let polygonFeatureProps;

  /** @param {number} d */
  function getColor(d) {
    return d > 120
      ? '#800026'
      : d > 100
      ? '#BD0026'
      : d > 80
      ? '#E31A1C'
      : d > 60
      ? '#FC4E2A'
      : d > 40
      ? '#FD8D3C'
      : d > 20
      ? '#FEB24C'
      : d > 1
      ? '#FED976'
      : '#FFEDA0';
  }

  /** @type {import('leaflet').LeafletMouseEventHandlerFn} */
  function highlightPolygon(event) {
    let layer = event.target;
    const label = layer.feature.properties.label;

    polygonFeatureProps = kecamatan[label].produksi.find((e) => e.tahun === $productionYear);
    polygonFeatureProps.nama = label;
    polygonFeatureProps.jumlah_pabrik_kopra = markerFeature.filter(
      (e) => e.lokasi.kecamatan == label
    ).length;

    showPolygonInfoCard = true;

    layer.setStyle({ weight: 3, fillOpacity: 0.5 });
    layer.bringToFront();
  }

  /**
   * @param {any} feature
   * @param {import('leaflet').Layer} layer
   */
  function onEachGeoJson(feature, layer) {
    layer.on({
      mouseover: highlightPolygon,
      mouseout: (e) => {
        geoJsonLayer.resetStyle(e.target);
        showPolygonInfoCard = false;
      }
    });
  }

  onMount(async () => {
    leaflet = await import('leaflet');
    map = leaflet.map(mapElement).setView(initialCord, initialZoom);
    leaflet
      .tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
      .addTo(map);

    geoJsonLayer = leaflet.geoJson(geoJsonFeature, {
      style: function () {
        return { weight: 0, fillOpacity: 0 };
      },
      onEachFeature: onEachGeoJson
    });

    markerFeature.forEach((e) => {
      /** @type {import('leaflet').LatLngExpression} */
      const cord = [e.map.lat, e.map.long];
      const marker = leaflet.marker(cord);
      marker.on('click', () => {
        showPointInfoCard = true;
        pabrik = e;
      });
      marker.bindPopup(`<b>${e.pemilik.nama}</b>`).openPopup();
      pabrikMarkers.push(marker);
    });

    Object.keys(kecamatan).forEach((e) => {
      const k = kecamatan[e];
      const latLng = [k.koordinat.lat, k.koordinat.long];
      const color = getColor(k.produksi.find((e) => e.tahun === 2020).kopra ?? 0);
      const marker = leaflet.marker(latLng);
      const circleMarker = leaflet.circleMarker(latLng, {
        color: color,
        weight: 2,
        fillOpacity: 0.8
      });

      kecamatanMarkers.push(marker);
      kecamatanCircleMarkers.push(circleMarker);
    });

    heatMapLegend = leaflet.control({ position: 'bottomright' });
    heatMapLegend.onAdd = function (map) {
      const div = leaflet.DomUtil.create('div', 'info legend');
      div.style.padding = '6px 8px';
      div.style.font = '14px/16px Arial, Helvetica, sans-serif';
      div.style.background = 'white';
      div.style.background = 'rgba(255, 255, 255, 0.8)';
      div.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.2)';
      div.style.borderRadius = '5px';
      div.style.background = 'rgba(255, 255, 255, 0.8)';
      div.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.2)';
      div.style.borderRadius = '5px';
      div.style.opacity = '0.8';

      const grades = [0, 1, 20, 40, 60, 80, 100, 120];
      const style = 'width:16px; height:16px; float: left; margin-right: 8px';
      const labels = [];
      let from, to;

      for (let i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        const label = `${from}${from > 0 ? (to ? `&ndash;${to}` : '+') : ''}`;
        const colorBox = `<i style="background:${getColor(from + 1)}; ${style}"></i>`;

        labels.push(`${colorBox} ${label}`);
      }

      div.innerHTML = labels.join('<br>');

      return div;
    };
  });

  afterUpdate(async () => {
    switch (type) {
      case 'kecamatan':
        if (fromPoint) {
          circleMarkers.forEach((circle) => {
            circle.remove();
          });

          pabrikMarkers.forEach((marker) => {
            marker.remove();
          });

          fromPoint = !fromPoint;
          showPointInfoCard = false;
        }

        geoJsonLayer.addTo(map);
        heatMapLegend.addTo(map);
        kecamatanMarkers.forEach((marker) => {
          marker.addTo(map);
        });
        kecamatanCircleMarkers.forEach((circle) => {
          circle.addTo(map);
        });
        fromPolygon = true;
        break;
      case 'pabrik':
        if (fromPolygon) {
          kecamatanMarkers.forEach((marker) => {
            marker.remove();
          });

          kecamatanCircleMarkers.forEach((circle) => {
            circle.remove();
          });

          heatMapLegend.remove();
          geoJsonLayer.remove();

          fromPolygon = !fromPolygon;
          showPolygonInfoCard = false;
        }

        pabrikMarkers.forEach((marker) => {
          marker.addTo(map);
        });

        if (searchTerm.length < 3) {
          if (circleMarkers.length > 0) {
            circleMarkers.forEach((e) => {
              e.remove();
            });
            circleMarkers = [];
          }
          map.flyTo(initialCord, initialZoom);
        }

        if (searchTerm.length >= 3) {
          if (circleMarkers.length > 0) {
            circleMarkers.forEach((e) => {
              e.remove();
            });
            circleMarkers = [];
          }

          markerFeature
            .filter((e) => e.pemilik.nama.toLowerCase().startsWith(searchTerm.toLowerCase()))
            .forEach((e) => {
              const latLng = [e.map.lat, e.map.long];
              const circleMarker = leaflet.circleMarker(latLng, { radius: 10, color: '#ff0000' });
              circleMarkers.push(circleMarker);
            });

          circleMarkers.forEach((circle) => {
            circle.addTo(map);
            map.flyTo(circle.getLatLng(), 16);
          });
        }

        fromPoint = true;
        break;
    }
  });

  onDestroy(async () => {
    if (map) {
      map.remove();
    }
  });
</script>

<div class="flex flex-col items-center justify-center">
  <Card class="w-full rounded-lg shadow-lg">
    <Card.Section first padding="lg">
      <div bind:this="{mapElement}" class="z-10 h-[40rem] w-full"></div>
    </Card.Section>
  </Card>
  {#if showPointInfoCard || showPolygonInfoCard}
    <div
      class="z-20 -mt-40 flex h-36 w-3/4 overflow-hidden rounded-lg bg-slate-200/80 text-slate-600 shadow-lg"
    >
      {#if showPointInfoCard}
        <PointInfoCard point="{pabrik}" />
      {:else if showPolygonInfoCard}
        <PolygonInfoCard data="{polygonFeatureProps}" />
      {/if}
    </div>
  {:else}
    <div class="relative z-20 -mt-40 h-36 w-3/4 overflow-hidden p-4"></div>
  {/if}
</div>
