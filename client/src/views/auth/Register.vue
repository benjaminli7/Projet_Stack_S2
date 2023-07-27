<script setup>
  import axios from 'axios';
  import { reactive } from 'vue';
  import router from '../../router';
  import { getGoogleAuthUrl } from '../../services/google-auth';

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const state = reactive({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });

  const redirectToGoogle = async () => {
    try {
      // Get the Google auth URL
      const url = await getGoogleAuthUrl();
      // Redirect the user to the Google auth URL
      window.location.href = url;
    } catch (error) {
      router.push('/login');
      alert(error);
    }
  }

  const register = async () => {
    try {
      await axios.post(`${BASE_URL}/auth/register`, {
        username: state.username,
        firstname: state.firstname,
        lastname: state.lastname,
        email: state.email,
        password: state.password,
      });
      router.push('/login');
    } catch (error) {
      console.log(error.response);
      alert(error.response.data.error || 'Erreur lors de l\'inscription');
    }
  }

</script>


<template>
    <div class="container mx-auto mt-[50px]">
      <form @submit.prevent="register" class="max-w-xs mx-auto">
        <div class="mb-4">
          <input type="text" v-model="state.username" placeholder="Nom d'utilisateur" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500" />
        </div>
        <div class="mb-4">
          <input type="text" v-model="state.firstname" placeholder="Prénom" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500" />
        </div>
        <div class="mb-4">
          <input type="text" v-model="state.lastname" placeholder="Nom de famille" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500" />
        </div>
        <div class="mb-4">
          <input type="email" v-model="state.email" placeholder="Email" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500" />
        </div>
        <div class="mb-4">
          <input type="password" v-model="state.password" placeholder="Mot de passe" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500" required/>
        </div>
        <div>
          <button type="submit" class="w-full px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600">S'inscrire</button>
        </div>
        <div class="mt-4">
          <button @click.prevent="redirectToGoogle" @click="redirectToGoogle" class="text-sm text-red-500 hover:text-red-600">Continuer avec Google</button>
        </div>
        <div class="mt-4">
            <router-link to="/login" class="text-sm text-red-500 hover:text-red-600">Déjà inscrit ?</router-link>
        </div>

      </form>

    </div>
</template>

