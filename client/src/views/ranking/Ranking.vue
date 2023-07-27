<template>
  <div class="max-w-2xl mx-auto overflow-hidden">
    <div class="p-6">
      <h2 class="text-2xl mb-4">Classement</h2>

      <div v-if="users[0]" class="first-place card flex justify-between items-center">
        <span>1. {{ users[0].username }}</span>
        <span>{{ users[0].elo }}LP</span>
      </div>

      <div class="flex justify-between mt-4">
        <div v-if="users[1]" class="second-place card flex justify-between items-center w-1/2 mr-2">
          <span>2. {{ users[1].username }}</span>
          <span>{{ users[1].elo }}LP</span>
        </div>
        <div v-if="users[2]" class="third-place card flex justify-between items-center w-1/2 ml-2">
          <span>3. {{ users[2].username }}</span>
          <span>{{ users[2].elo }}LP</span>
        </div>
      </div>

      <div class="mt-4">
        <div v-for="user in users.slice(3)" :key="user.id" class="other-places card flex justify-between my-2">
          <span>{{ user.username }}</span>
          <span>{{ user.elo }}LP</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default {
  name: 'Ranking',
  setup() {
    const users = ref([]);

    onMounted(async () => {
      try {
        const response = await fetch(`${BASE_URL}/ranking`);
        let fetchedUsers = await response.json();

        users.value = fetchedUsers.sort((a, b) => b.elo - a.elo);
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

<style scoped>
.card {
  box-sizing: border-box;
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.other-places {
  background-color: #d8ecf2;
  color: #333;
}

.first-place {
  padding: 24px;
  background-color: rgb(244, 200, 116);
  color: #fff;
  font-size: 1.5em;
}

.second-place {
  background-color: #C0C0C0;
}

.third-place {
  background-color: #CD7F32;
}
</style>
