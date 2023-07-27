<script setup>
  import axios from 'axios';
  import { reactive } from 'vue';
  import router from '../../router';
const BASE_URL = import.meta.env.VITE_BASE_URL;

  const state = reactive({
    password: '',
  });

  // Récupérez le token à partir de l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  const resetPassword = async () => {
    try {
      await axios.post(`${BASE_URL}/auth/reset-password`, {
        password: state.password,
        token: token,
      });
      router.push('/login');
    } catch (error) {
      alert('Erreur lors de l\'inscription');
    }
  }


</script>


<template>
    <div>
      <form @submit.prevent="resetPassword" class="max-w-xs mx-auto">
        <div class="mb-4">
          <input type="password" v-model="state.password" placeholder="Mot de passe" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500" required/>
        </div>
        <div>
          <button type="submit" class="w-full px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600">Envoyer</button>
        </div>
      </form>
    </div>
</template>

