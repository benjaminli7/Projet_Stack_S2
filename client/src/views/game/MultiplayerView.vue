<script setup>
import { io } from "socket.io-client";
import { onMounted, ref, watch } from "vue";
import { useUserStore } from "../../userStore";
import StreetViewMap from "./StreetViewMap.vue";
import GoogleMap from "./GoogleMap.vue";
import MultiplayerResultsView from "./MultiplayerResultsView.vue";

let socket;
const store = useUserStore();
const user = store.getUser;
const loading = ref(true);
let positions = ref([]);
let round = ref(0);
let roomName = ref("");
let waitingGuess = ref(false);
let isGameFinished = ref(false);
let outcome = ref("");
let totalScore = ref(0);
let opponentScore = ref(0);
let roomData = ref(null)
let currentPlayer = ref(null)

socket = io("http://localhost:3000");

onMounted(() => {
  console.log(user)
  socket.emit("playerJoined", user.username)
  socket.emit("findOpponent")

  // socket.on("joinRoom", (roomNameData) => {
  //   roomName.value = roomNameData;
  //   socket.emit("joinRoom", roomNameData)
  // })

  socket.on("gameStarting", (positionsData, roomNameData) => {
    loading.value = false;
    roomName.value = roomNameData
    positions.value = positionsData;
  });

  socket.on("waitingGuess", () => {
    waitingGuess.value = true;
  })


  socket.on("nextRound", () => {
    waitingGuess.value = false;
    round.value += 1;
  })

  socket.on("gameFinished", (result) => {
    isGameFinished.value = true
    outcome.value = result.outcome
    totalScore.value = result.score
    opponentScore.value = result.opponentScore
    roomData.value = result.data
    currentPlayer.value = result.currentPlayer
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

const getResultMessage = () => {
  if (totalScore.value > opponentScore.value) {
    return `You won! Your score is ${totalScore.value} and your opponent's score is ${opponentScore.value}`
  } else if (totalScore.value < opponentScore.value) {
    return `You lost! Your score is ${totalScore.value} and your opponent's score is ${opponentScore.value}`
  } else {
    return `It's a tie! You both scored ${totalScore.value} points.`
  }
}


</script>

<template>
  <p v-if="loading">Searching opponent...</p>
  <p v-else-if="waitingGuess">Waiting for opponent to guess...</p>
  <div v-else-if="isGameFinished">
    <MultiplayerResultsView :outcome="outcome" :roomData="roomData" :currentPlayer="currentPlayer" :getResultMessage="getResultMessage"/>
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