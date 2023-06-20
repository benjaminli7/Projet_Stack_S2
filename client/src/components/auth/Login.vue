<script setup>
  import { useUserStore } from '../../userStore';
  import router from '../../router';
  import { ref } from 'vue';

  const userStore = useUserStore();

  const email = ref('');
  const password = ref('');

  const login = async () => {
    try {
      await userStore.login(email.value, password.value);

      router.push('/');
    } catch (error) {
      router.push('/login');
      alert(error);
    }
  };



</script>


<template>
    <div>
      <form @submit.prevent="login" class="max-w-xs mx-auto">
        <div class="mb-4">
          <input type="text" v-model="email" placeholder="Email" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500" />
        </div>
        <div class="mb-4">
          <input type="password" v-model="password" placeholder="MDP" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500" />
        </div>
        <div>
          <button type="submit" class="w-full px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600">Se connecter</button>
        </div>
        <div class="mt-4">
          <router-link to="/register" class="text-sm text-red-500 hover:text-red-600">Pas encore inscrit ?</router-link>
      </div>
      </form>

    </div>
  </template>
  
