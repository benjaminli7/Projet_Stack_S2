<script setup>
  import axios from 'axios';
  import { reactive } from 'vue';
  import router from '../../router';

  const BASE_URL = import.meta.env.VITE_BASE_URL;


  const state = reactive({
    email: '',
  });

  const forgetPassword = async () => {
    try {
      await axios.post(`${BASE_URL}/auth/forgot-password`, {
        email: state.email,
      });
      router.push('/login');
    } catch (error) {
      alert('Erreur lors de la demande de réinitialisation du mot de passe');
    }
  }

</script>


<template>
    <div>
      <form @submit.prevent="forgetPassword" class="max-w-xs mx-auto">
        <div class="mb-4">
          <input type="email" v-model="state.email" placeholder="Email" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500" />
        </div>
        <div>
          <button type="submit" class="w-full px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600">Envoyer</button>
        </div>
      </form>
    </div>
</template>

