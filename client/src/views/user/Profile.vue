<template>
  <div>
    <h1>Statistiques des utilisateurs</h1>
    <table v-if="stats && stats.length">
      <thead>
      <tr>
        <th>ID</th>
        <th>User ID</th>
        <th>Username</th>
        <th>Total Games Played</th>
        <th>Total Wins</th>
        <th>Total Losses</th>
        <th>Total Draws</th>
        <th>Total Points</th>
        <th>Total Elo</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="stat in stats" :key="stat._id">
        <td>{{ stat._id }}</td>
        <td>{{ stat.userId }}</td>
        <td>{{ stat.username }}</td>
        <td>{{ stat.totalGamesPlayed }}</td>
        <td>{{ stat.totalWins }}</td>
        <td>{{ stat.totalLosses }}</td>
        <td>{{ stat.totalDraws }}</td>
        <td>{{ stat.totalPoints }}</td>
        <td>{{ stat.totalElo }}</td>
      </tr>
      </tbody>
    </table>
    <div v-if="error">{{ error }}</div>
    <div v-else-if="!stats.length">
      Aucune statistique disponible pour l'instant.
    </div>
  </div>
</template>

<script>
import { useUserStore } from "../../userStore.js";

export default {
  data() {
    return {
      stats: [],
      error: null
    };
  },
  async mounted() {
    const userStore = useUserStore();
    try {
      this.stats = await userStore.fetchUserStats();
      console.log("Data fetched:", this.stats);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      this.error = "Une erreur est survenue lors de la récupération des statistiques. Veuillez réessayer.";
    }
  }
}
</script>


<style scoped>
/* Votre style CSS ici */
</style>
