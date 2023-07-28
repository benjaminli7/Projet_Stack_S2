<template>
  <tabs variant="pills" v-model="activeTab" class="p-5">
    <tab name="information" title="Informations">
      <div class="flex items-center justify-center min-h-screen">
        <div class="flex flex-col items-center justify-center w-3/4 p-6 bg-white rounded-lg shadow-md">
          <h2 class="mb-3 text-3xl font-bold text-center">Information</h2>
          <p class="mb-2 text-lg">Pseudo : {{ user.username }}</p>
          <p class="mb-2 text-lg">Nom: {{ user.lastname }}</p>
          <p class="mb-4 text-lg">Prénom: {{ user.firstname }}</p>
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
    <tab name="stat" title="Statistiques">
      <div v-if="userStore.getStats" class="flex flex-wrap md:space-x-6">
        <div class="w-full mb-6 md:w-1/2 md:mb-0">
          <div class="flex flex-col justify-center h-full p-6 bg-blue-100 rounded-lg shadow-md">
            <h3 class="mb-4 text-xl font-bold text-center">Vos Stats Globales</h3>
            <div v-if="userStore.getStats.totalGames !== undefined">
              <p class="text-lg text-center">Parties jouées: {{ userStore.getStats.totalGames }}</p>
              <p class="text-lg text-center">Victoires: {{ userStore.getStats.victories }}</p>
              <p class="text-lg text-center">Défaites: {{ userStore.getStats.defeats }}</p>
              <p class="text-lg text-center">Winrate: {{ userStore.getStats.winRate }}%</p>
              <p class="text-lg text-center">ELO : {{ userElo }}</p>
            </div>
            <div v-else>
              <p class="text-lg text-center">Données des stats globales non disponibles.</p>
            </div>
          </div>
        </div>
        <div class="flex flex-col flex-1 w-full space-y-6">
          <div class="flex-1 p-6 bg-green-100 rounded-lg shadow-md">
            <h4 class="mb-4 text-lg font-bold">Dernière partie:</h4>
            <div v-if="userStore.getStats.lastGame">
              <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
                <p><strong>Username:</strong> {{ userStore.getStats.lastGame.currentPlayer.username }}</p>
                <p><strong>Score:</strong> {{ userStore.getStats.lastGame.currentPlayer.score }}</p>
                <p><strong>Outcome:</strong> {{ userStore.getStats.lastGame.currentPlayer.outcome }}</p>
                <p><strong>Date:</strong> {{ userStore.getStats.lastGame.date }}</p>
              </div>
            </div>
            <div v-else>
              <p class="text-lg text-center">Données de la dernière partie non disponibles.</p>
            </div>
          </div>
          <div class="flex-1 p-6 bg-yellow-100 rounded-lg shadow-md">
            <h4 class="mb-4 text-lg font-bold">Guess le plus proche:</h4>
            <div v-if="userStore.getStats.closestGuess && userStore.getStats.closestGuessPosition">
              <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
                <p><strong>Lat:</strong> {{ userStore.getStats.closestGuess.lat }}</p>
                <p><strong>Lng:</strong> {{ userStore.getStats.closestGuess.lng }}</p>
              </div>
              <p class="mt-2"><strong>Score:</strong> {{ userStore.getStats.closestGuess.score }}</p>
              <h5 class="mt-3 mb-2 font-semibold text-md">Position réelle:</h5>
              <div class="grid grid-cols-2 gap-2">
                <p><strong>Lat:</strong> {{ userStore.getStats.closestGuessPosition.lat }}</p>
                <p><strong>Lng:</strong> {{ userStore.getStats.closestGuessPosition.lng }}</p>
              </div>
            </div>
            <div v-else>
              <p class="text-lg text-center">Données du guess le plus proche non disponibles.</p>
            </div>
          </div>
          <div class="flex-1 p-6 bg-purple-100 rounded-lg shadow-md">
            <h4 class="mb-4 text-lg font-bold">Score le plus élevé:</h4>
            <div v-if="userStore.getStats.highestScore !== undefined">
              <p><strong>Score:</strong> {{ userStore.getStats.highestScore }}</p>
            </div>
            <div v-else>
              <p class="text-lg text-center">Données du score le plus élevé non disponibles.</p>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="p-6 text-center bg-gray-100 rounded-lg shadow-md">
        Loading stats...
      </div>
    </tab>
    <tab name="history" title="Historique">
      <div v-if="userStore.getStats && userStore.getStats.gameHistory && userStore.getStats.gameHistory.length > 0" class="flex flex-wrap items-center justify-center min-h-screen">
        <div class="w-3/4">
          <h3 class="mb-4 text-xl font-bold text-center">Historique des parties</h3>
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
      <div v-else class="p-6 text-center bg-red-100 rounded-lg shadow-md">
        Vous n'avez pas encore d'historique de parties ou nous n'avons pas pu le récupérer.
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
let userElo = ref(null);
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
  userElo.value = await userStore.fetchUserElo(user.username);
});
</script>
