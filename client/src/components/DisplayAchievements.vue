<script setup>
  import { ref, onMounted } from 'vue';
  import { useUserStore } from '../userStore';
  import { getSocket } from '../services/socket';

  const achievementData = ref({});
  const unlockedAchievements = ref([]);
  const lockedAchievements = ref([]);

  onMounted(async () => {
    const userStore = useUserStore();
    const user = userStore.getUser;
    try {
      const response = await userStore.getAchievements(user.id);
      achievementData.value = response;

      unlockedAchievements.value = response.filter(
        (achievement) => achievement.unlocked
      );
      lockedAchievements.value = response.filter(
        (achievement) => !achievement.unlocked
      );
    } catch (error) {
      console.log(error);
    }
  });
</script>

<template>
  <div class="p-4">
    <h2 class="mb-3 text-3xl font-bold text-center">Achievements</h2>
    <div class="grid grid-cols-1 gap-4">
      <div
        v-for="achievement in unlockedAchievements"
        :key="achievement.id"
        class="flex items-center gap-4 p-4 border rounded-lg shadow-md"
      >
        <img
          :src="achievement.image"
          alt="Achievement icon"
          class="w-10 h-10"
        />
        <div>
          <h3 class="text-xl font-semibold">{{ achievement.name }}</h3>
          <p class="text-gray-500">{{ achievement.description }}</p>
          <!-- <p class="text-gray-500"> Débloqué le : {{ new Date(achievement.createdAt).toLocaleDateString() }}</p> -->
        </div>
      </div>

      <div
        v-for="achievement in lockedAchievements"
        :key="achievement.id"
        class="flex items-center gap-4 p-4 border rounded-lg shadow-md opacity-50"
      >
        <img
          :src="achievement.image"
          alt="Achievement icon"
          class="w-10 h-10"
        />
        <div>
          <h3 class="text-xl font-semibold">{{ achievement.name }}</h3>
          <p class="text-gray-500">{{ achievement.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>


<style>
/* Add some margin between achievement cards */
.grid-cols-1 > div {
  margin-bottom: 1rem;
}
</style>
