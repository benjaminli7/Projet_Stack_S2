<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useUserStore } from '../../../userStore';

const store = useUserStore();
const { addFriend } = store;

const userId = ref(store.getUser.id); 
const friendId = ref('');

const emit = defineEmits(['add-friend'])



const submitForm = async () => {
  try {

    if (!friendId.value) {
      throw new Error('Friend ID is required');
    }
    await addFriend(userId.value, friendId.value);
    friendId.value = '';
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
      <label for="userId" class="block text-sm font-medium text-gray-700">User ID:</label>
      <input type="text" id="userId" v-model="userId" disabled class="bg-gray-200 px-4 py-2 rounded-lg w-full">

      <label for="friendId" class="block text-sm font-medium text-gray-700">Friend ID:</label>
      <input type="text" id="friendId" v-model="friendId" required class="bg-white px-4 py-2 rounded-lg w-full">

      <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">Add Friend</button>
    </form>
  </div>
</template>
