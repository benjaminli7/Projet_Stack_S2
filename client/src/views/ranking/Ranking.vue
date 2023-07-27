<template>
  <div class="p-6">
    <h2 class="text-2xl mb-4">Classement</h2>
    <ul>
      <li v-for="user in users" :key="user.id">
        {{ user.username }} - ELO: {{ user.elo }}
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'Ranking',
  setup() {
    const users = ref([]);

    onMounted(async () => {
      try {
        const response = await fetch('http://localhost:3000/ranking/');
        users.value = await response.json();
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
      }
    });


    return {
      users
    }
  }
}
</script>
