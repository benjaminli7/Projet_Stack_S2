<template>
  <tabs v-model="activeTab" class="p-5">
    <tab name="information" title="Information">
      <div>
        <h2 class="text-3xl font-bold text-center mb-3">Information</h2>
        <p>Pseudo : {{ user.username }}</p>
        <p>Nom: {{ user.lastname }}</p>
        <p>Prénom: {{ user.firstname }}</p>
        <button>
          <router-link to="/update-profile" class="text-sm text-red-500 hover:text-red-600">Modifier mon profil</router-link>
        </button>
      </div>
    </tab>
    <tab name="succes" title="Succes">
      <div class="mb-4">
        <DisplayAchievements></DisplayAchievements>
      </div>
    </tab>
    <tab name="stat" title="Stat">
      <div v-if="userStore.getStats" class="space-y-6">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-bold mb-4">Vos Stats Globales</h3>
          <p>Parties jouées: {{ userStore.getStats.totalGames }}</p>
          <p>Victoires: {{ userStore.getStats.victories }}</p>
          <p>Défaites: {{ userStore.getStats.defeats }}</p>
          <p>Winrate: {{ userStore.getStats.winRate }}%</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h4 class="text-lg font-bold mb-4">Dernière partie:</h4>
          <p>Username: {{ userStore.getStats.lastGame.currentPlayer.username }}</p>
          <p>Score: {{ userStore.getStats.lastGame.currentPlayer.score }}</p>
          <p>Outcome: {{ userStore.getStats.lastGame.currentPlayer.outcome }}</p>
          <p>Date: {{ userStore.getStats.lastGame.date }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h4 class="text-lg font-bold mb-4">Guess le plus proche:</h4>
          <p>Lat: {{ userStore.getStats.closestGuess.lat }}</p>
          <p>Lng: {{ userStore.getStats.closestGuess.lng }}</p>
          <p>Score: {{ userStore.getStats.closestGuess.score }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h4 class="text-lg font-bold mb-4">Score le plus élevé:</h4>
          <p>Score: {{ userStore.getStats.highestScore }}</p>
        </div>
      </div>
      <div v-else class="text-center p-6 bg-gray-100 rounded-lg shadow-md">
        Loading stats...
      </div>
    </tab>
  </tabs>
</template>

<script setup>
import router from '../../router';
import DisplayAchievements from '../../components/DisplayAchievements.vue';
import { ref, onMounted } from 'vue';
import { Tabs, Tab } from 'flowbite-vue';
import { useUserStore } from "../../userStore";

let userStore = useUserStore();
let user = userStore.getUser;
const activeTab = ref('information');

onMounted(async () => {
  await userStore.fetchStats();
});
</script>
