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
  <div class="bg-gray-100 p-8">
    <h2 class="text-2xl font-bold mb-4">Add Friend</h2>
    <form @submit.prevent="submitForm" class="space-y-4">
      <label for="username" class="block text-sm font-medium text-gray-700">User ID:</label>
      <input type="text" id="username" v-model="username" disabled class="bg-gray-200 px-4 py-2 rounded-lg w-full">

      <label for="friendUsername" class="block text-sm font-medium text-gray-700">Friend ID:</label>
      <input type="text" id="friendUsername" v-model="friendUsername" required class="bg-white px-4 py-2 rounded-lg w-full">

      <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">Add Friend</button>
    </form>
  </div>
</template>
