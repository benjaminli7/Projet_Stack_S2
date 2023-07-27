<script setup>
import { Spinner } from "flowbite-vue";
import { io } from "socket.io-client";
import { onMounted, ref, watch } from "vue";
import { useUserStore } from "../../userStore";
import GoogleMap from "./GoogleMap.vue";
import MultiplayerResultsView from "./MultiplayerResultsView.vue";
import StreetViewMap from "./StreetViewMap.vue";
import Loading from "../../components/Loading.vue";

let socket;
const BASE_URL = import.meta.env.VITE_BASE_URL;

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
let roomData = ref(null);
let currentPlayer = ref(null);
let winner = ref(null);
let loser = ref(null);

socket = io(BASE_URL);

onMounted(() => {
  socket.emit("playerJoined", user.username);
  socket.emit("findOpponent");

  socket.on("gameStarting", (positionsData, roomNameData) => {
    loading.value = false;
    roomName.value = roomNameData;
    positions.value = positionsData;
  });

  socket.on("waitingGuess", () => {
    waitingGuess.value = true;
  });

  socket.on("nextRound", () => {
    waitingGuess.value = false;
    round.value += 1;
  });

  socket.on("gameFinished", (result) => {
    isGameFinished.value = true;
    outcome.value = result.outcome;
    totalScore.value = result.score;
    opponentScore.value = result.opponentScore;
    roomData.value = result.data;
    currentPlayer.value = result.currentPlayer;
    winner.value = result.winner;
    loser.value = result.loser;
  });

});

watch(
  () => isGameFinished.value,
  (newValue) => {
    if (newValue) {
      isGameFinished.value = true;
    }
  }
);

const getResultMessage = () => {
  if (totalScore.value > opponentScore.value) {
    return `You won! Your score is ${totalScore.value} and ${loser.value} score is ${opponentScore.value}`;
  } else if (totalScore.value < opponentScore.value) {
    return `You lost! Your score is ${totalScore.value} and ${winner.value} score is ${opponentScore.value}`;
  } else {
    return `It's a tie! You both scored ${totalScore.value} points.`;
  }
};
const isOpponent = (username) => {
  if(user.username === username) {
    return false;
  } else {
    return true;
  }
};
</script>

<template>
  <div class="container relative h-screen mx-auto" v-if="loading">
    <div class="absolute flex gap-4 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      <Loading message="En recherche d'adversaire..."/>
    </div>
  </div>
  <div class="container relative h-screen mx-auto" v-else-if="waitingGuess">
    <div class="absolute flex gap-4 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 ">
      <Loading message="En attente du guess de votre adversaire..."/>
    </div>
  </div>

  <div v-else-if="isGameFinished">
    <MultiplayerResultsView
      :winner="winner"
      :loser="loser"
      :username="user.username"
      :outcome="outcome"
      :roomData="roomData"
      :currentPlayer="currentPlayer"
      :getResultMessage="getResultMessage"
      :isOpennent="isOpponent"
    />
  </div>
  <div id="map-wrapper" v-else>
    <StreetViewMap :socket="socket" :positions="positions" :round="round" />
    <GoogleMap
      :socket="socket"
      :positions="positions"
      :round="round"
      :roomName="roomName"
    />
  </div>
</template>

<style scoped>
#map-wrapper {
  position: relative;
}
</style>

