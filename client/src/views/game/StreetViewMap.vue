<script setup>
import { onMounted, ref, watch } from "vue";

const props = defineProps({
  positions: {
    type: Array,
    required: true,
  },
  round: {
    type: Number,
    required: true,
  },
});

let positions = props.positions;
const streetViewPanorama = ref(null);

watch(
  () => props.round,
  (newRound) => {
    if (streetViewPanorama.value) {
      streetViewPanorama.value.setPosition({
        lat: positions[newRound].lat,
        lng: positions[newRound].lng,
      });
    }
  }
);

onMounted(() => {
  streetViewPanorama.value = new google.maps.StreetViewPanorama(
    document.getElementById("streetview-map"),
    {
      position: {
        lat: positions[props.round].lat,
        lng: positions[props.round].lng,
      },
      pov: {
        heading: 0,
        pitch: 0,
      },
      addressControl: false,
      streetViewControl: false,
      showRoadLabels: false,
    }
  );
});
</script>
<template>
  <div id="streetview-map"></div>
</template>

<style scoped>
#streetview-map {
  height: 100vh;
  /* width: 100vw; */
}
</style>
