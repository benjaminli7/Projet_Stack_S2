<script setup>
import { onMounted } from "vue";

onMounted(() => {
  new google.maps.StreetViewPanorama(document.getElementById("streetview-map"), {
    position: { lat: 42.345573, lng: -71.098326 },
    pov: {
      heading: 0,
      pitch: 0,
    },
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
