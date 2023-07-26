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
      <div v-if="userStore.getStats && userStore.getStats.length">
        <div v-for="(stat, index) in userStore.getStats" :key="index">
          <h3>Player 1</h3>
          <p>Username: {{ stat.player_1.username }}</p>
          <p>Score: {{ stat.player_1.score }}</p>
          <p>Outcome: {{ stat.player_1.outcome }}</p>
          <h3>Player 2</h3>
          <p>Username: {{ stat.player_2.username }}</p>
          <p>Score: {{ stat.player_2.score }}</p>
          <p>Outcome: {{ stat.player_2.outcome }}</p>
          <p>Date: {{ stat.date }}</p>
        </div>
      </div>
      <div v-else>
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
