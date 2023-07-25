<script setup>
import { onMounted } from "vue";

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

let positions = props.positions
let round = props.round

console.log(props.positions)
console.log(props.round)

console.log(positions[round].lat)
console.log(positions[round].lng)


onMounted(() => {
  new google.maps.StreetViewPanorama(document.getElementById("streetview-map"), {
    position: { lat: positions[round].lat, lng: positions[round].lng },
    pov: {
      heading: 0,
      pitch: 0,
    },
    addressControl: false,
    streetViewControl: false,
    showRoadLabels: false,


  });
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
