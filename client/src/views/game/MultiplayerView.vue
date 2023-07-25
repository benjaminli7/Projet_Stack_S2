<script setup>
import { io } from "socket.io-client";
import { onMounted, ref, watch } from "vue";
import { useUserStore } from "../../userStore";
import StreetViewMap from "./StreetViewMap.vue";
import GoogleMap from "./GoogleMap.vue";

let socket;
const store = useUserStore();
const user = store.getUser;
const loading = ref(true);
let positions = ref([]);
let round = ref(0);
let roomName = ref("");
let waitingGuess = ref(false);
let isGameFinished = ref(false);

socket = io("http://localhost:3000");

onMounted(() => {
  console.log(user)
  socket.emit("playerJoined", user.username)
  socket.emit("findOpponent")

  socket.on("joinRoom", (roomNameData) => {
    roomName.value = roomNameData;
    socket.emit("joinRoom", roomNameData)
  })

  socket.on("gameStarting", (positionsData) => {
    loading.value = false;
    positions.value = positionsData;
  });

  socket.on("waitingGuess", () => {
    waitingGuess.value = true;
  })


  socket.on("nextRound", () => {
    waitingGuess.value = false;
    round.value += 1;
  })

  socket.on("gameFinished", (data) => {
    isGameFinished.value = true
    console.log("game finished");
  })




});

watch(
  () => isGameFinished.value,
  (newValue) => {
    if(newValue) {
      isGameFinished.value = true
    }

  }
);

</script>

<template>
  <p v-if="loading">Searching opponent...</p>
  <p v-else-if="waitingGuess">Waiting for opponent to guess...</p>
  <div v-else-if="isGameFinished">
    <h1>Game finished</h1>
  </div>
  <div id="map-wrapper" v-else>
    <StreetViewMap :socket="socket" :positions="positions" :round="round"/>
    <GoogleMap :socket="socket" :positions="positions" :round="round" :roomName="roomName" />
  </div>
</template>

<style scoped>
#map-wrapper {
  position: relative;
}

</style>