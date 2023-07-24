<script setup>
import { io } from "socket.io-client";
import { onMounted, ref } from "vue";
import { useUserStore } from "../../userStore";
import StreetViewMap from "./StreetViewMap.vue";
import GoogleMap from "./GoogleMap.vue";

let socket;
const store = useUserStore();
const user = store.getUser;
const loading = ref(true);
let positions = ref([]);
const round = ref(0);
let roomName = ref("");


onMounted(() => {
  socket = io("http://localhost:3000");
  socket.emit("playerJoined", user.username)
  socket.emit("findOpponent")

  socket.on("joinRoom", (roomNameData) => {
    roomName.value = roomNameData;
    socket.emit("joinRoom", roomNameData)
  })

  socket.on("gameStarting", (positionsData) => {
    loading.value = false;
    positions.value = positionsData;
    console.log("game startingg");

  });


});

</script>

<template>
  <p v-if="loading">Searching opponent...</p>
  <p id="map-wrapper" v-else>
    <StreetViewMap :positions="positions" :round="round"/>
    <GoogleMap :positions="positions" :round="round" :roomName="roomName" />
  </p>
</template>

<style scoped>
#map-wrapper {
  position: relative;
}

</style>