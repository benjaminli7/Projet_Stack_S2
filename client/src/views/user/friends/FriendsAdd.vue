<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useUserStore } from '../../../userStore';

const store = useUserStore();
const { addFriend } = store;

const username = ref(store.getUser.username);
const friendUsername = ref('');

const emit = defineEmits(['add-friend'])



const submitForm = async () => {
  try {

    if (!friendUsername.value) {
      throw new Error('Friend ID is required');
    }
    await addFriend(username.value, friendUsername.value);
    friendUsername.value = '';
    emit('add-friend');

  } catch (error) {
    console.error(error.message);
  }
};
</script>

<template>
  <div class="p-8 bg-gray-100">
    <h2 class="mb-4 text-2xl font-bold">Ajouter un ami</h2>
    <form @submit.prevent="submitForm" class="space-y-4">
      <label for="username" class="block text-sm font-medium text-gray-700">User ID:</label>
      <input type="text" id="username" v-model="username" disabled class="w-full px-4 py-2 bg-gray-200 rounded-lg">

      <label for="friendUsername" class="block text-sm font-medium text-gray-700">Friend ID:</label>
      <input type="text" id="friendUsername" v-model="friendUsername" required class="w-full px-4 py-2 bg-white rounded-lg">

      <button type="submit" class="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600">Ajouter</button>
    </form>
  </div>
</template>
