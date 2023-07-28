<script setup>
import { io } from "socket.io-client";
import { computed, defineProps, onMounted, ref } from "vue";
let map;

onMounted(() => {
  initMap();
});

const props = defineProps({
  positions: {
    type: Array,
    required: true,
  },
  round: {
    type: Number,
    required: true,
  },
  roomName: {
    type: String,
    required: true,
  },
  socket: {
    type: Object,
    required: true,
  },
});

let socket = props.socket;
let positions = props.positions;
let round = props.round;
let roomName = props.roomName;

const lastMarker = ref(null);

const initMap = () => {
  map = new google.maps.Map(document.getElementById("google-map"), {
    center: { lat: 0, lng: 0 },
    zoom: 1,
    mapTypeControl: false,
    streetViewControl: false,
    draggableCursor: "crosshair",
    options: {
      gestureHandling: "greedy",
    },
    clickableIcons: false,
  });

  google.maps.event.addListener(map, "click", (event) => {
    placeMarker(event.latLng);
  });
};

const placeMarker = (latLng) => {
  if (lastMarker.value) {
    lastMarker.value.setPosition(latLng); // Update the position of the last marker
  } else {
    lastMarker.value = new google.maps.Marker({
      position: latLng,
      map,
    });
  }
};

const isButtonDisabled = computed(() => {
  return lastMarker.value === null;
});

const handleGuess = () => {
  const guess = lastMarker.value.getPosition();
  socket.emit("playerGuess", roomName, { lat: guess.lat(), lng: guess.lng() }, round);
};
</script>

<template>
  <div id="google-map">

  </div>
  <button id="guess-btn" @click="handleGuess" :disabled="isButtonDisabled">
    Guess
  </button>
</template>

<style scoped>
#google-map {
  height: 50%;
  width: 25%;
  position: absolute;
  bottom: 50px;
  left: 25px;
  z-index: 1;
  transition: 0.25s;
  cursor: crosshair;
}

#google-map:hover {
  height: 60%;
  width: 40%;
  transition: 0.25s;
}

#guess-btn {
  background-color: #03C04A;
  font-weight: bold;
  padding: 10px;
  border-radius: 50px;
  color: white;
  position: absolute;
  bottom: 0;
  left: 25px;
  z-index: 2;
  width: 25%;
  transition: 0.25s
}

#google-map:hover + #guess-btn {
  width: 40%;
  transition: 0.25s;

}
</style>
