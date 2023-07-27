<template>
  <tabs v-model="activeTab" class="p-5">
    <tab name="information" title="Information">
      <div class="flex justify-center items-center min-h-screen">
        <div class="bg-white p-6 rounded-lg shadow-md w-3/4 flex flex-col justify-center items-center">
          <h2 class="text-3xl font-bold text-center mb-3">Information</h2>
          <p class="text-lg mb-2">Pseudo : {{ user.username }}</p>
          <p class="text-lg mb-2">Nom: {{ user.lastname }}</p>
          <p class="text-lg mb-4">Prénom: {{ user.firstname }}</p>
          <button>
            <router-link to="/update-profile" class="text-sm text-red-500 hover:text-red-600">Modifier mon profil</router-link>
          </button>
        </div>
      </div>
    </tab>
    <tab name="succes" title="Succes">
      <div class="mb-4">
        <DisplayAchievements></DisplayAchievements>
      </div>
    </tab>
    <tab name="stat" title="Stat">
      <div v-if="userStore.getStats" class="flex flex-wrap md:space-x-6">
        <div class="w-full md:w-1/2 mb-6 md:mb-0">
          <div class="bg-blue-100 p-6 rounded-lg shadow-md h-full flex flex-col justify-center">
            <h3 class="text-xl font-bold mb-4 text-center">Vos Stats Globales</h3>
            <p class="text-lg text-center">Parties jouées: {{ userStore.getStats.totalGames }}</p>
            <p class="text-lg text-center">Victoires: {{ userStore.getStats.victories }}</p>
            <p class="text-lg text-center">Défaites: {{ userStore.getStats.defeats }}</p>
            <p class="text-lg text-center">Winrate: {{ userStore.getStats.winRate }}%</p>
          </div>
        </div>
        <div class="flex-1 flex flex-col space-y-6 w-full">
          <div class="bg-green-100 p-6 rounded-lg shadow-md flex-1">
            <h4 class="text-lg font-bold mb-4">Dernière partie:</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
              <p><strong>Username:</strong> {{ userStore.getStats.lastGame.currentPlayer.username }}</p>
              <p><strong>Score:</strong> {{ userStore.getStats.lastGame.currentPlayer.score }}</p>
              <p><strong>Outcome:</strong> {{ userStore.getStats.lastGame.currentPlayer.outcome }}</p>
              <p><strong>Date:</strong> {{ userStore.getStats.lastGame.date }}</p>
            </div>
          </div>
          <div class="bg-yellow-100 p-6 rounded-lg shadow-md flex-1">
            <h4 class="text-lg font-bold mb-4">Guess le plus proche:</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
              <p><strong>Lat:</strong> {{ userStore.getStats.closestGuess.lat }}</p>
              <p><strong>Lng:</strong> {{ userStore.getStats.closestGuess.lng }}</p>
            </div>
            <p class="mt-2"><strong>Score:</strong> {{ userStore.getStats.closestGuess.score }}</p>
            <h5 class="text-md font-semibold mt-3 mb-2">Position réelle:</h5>
            <div class="grid grid-cols-2 gap-2">
              <p><strong>Lat:</strong> {{ userStore.getStats.closestGuessPosition.lat }}</p>
              <p><strong>Lng:</strong> {{ userStore.getStats.closestGuessPosition.lng }}</p>
            </div>
          </div>
          <div class="bg-purple-100 p-6 rounded-lg shadow-md flex-1">
            <h4 class="text-lg font-bold mb-4">Score le plus élevé:</h4>
            <p><strong>Score:</strong> {{ userStore.getStats.highestScore }}</p>
          </div>
        </div>
      </div>
      <div v-else class="text-center p-6 bg-gray-100 rounded-lg shadow-md">
        Loading stats...
      </div>
    </tab>
    <tab name="history" title="Historique">
      <div v-if="userStore.getStats.gameHistory" class="flex flex-wrap justify-center items-center min-h-screen">
        <div class="w-3/4">
          <h3 class="text-xl font-bold mb-4 text-center">Historique des parties</h3>
          <div
              v-for="game in gameHistory"
              :key="game._id"
              class="p-4 mb-4 rounded-lg shadow-md"
              :class="game.backgroundColor">
            <p class="text-white"><strong>Date:</strong> {{ formatDate(game.date) }}</p>
            <p class="text-white"><strong>Score:</strong> {{ game.currentPlayer.score }}</p>
            <p class="text-white"><strong>Résultat:</strong> {{ game.currentPlayer.outcome }}</p>
          </div>
        </div>
      </div>
    </tab>
  </tabs>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Tabs, Tab } from 'flowbite-vue';
import { useUserStore } from "../../userStore";
import DisplayAchievements from '../../components/DisplayAchievements.vue';

let userStore = useUserStore();
let user = userStore.getUser;
const activeTab = ref('information');

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

const gameHistory = computed(() => {
  return userStore.getStats.gameHistory.map(game => {
    game.backgroundColor = game.currentPlayer.outcome.toLowerCase() === 'win' ? 'bg-blue-500' : 'bg-red-500';
    return game;
  });
});

onMounted(async () => {
  await userStore.fetchStats();
});
</script>
