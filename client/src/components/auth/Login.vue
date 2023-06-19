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
  
  
  <script>
  import axios from 'axios';
  import { setCurrentUser } from '../../auth.js';

  
  export default {
    name: 'Login',
    data() {
      return {
        email: '',
        password: '',
      };
    },
    methods: {
      async login() {
        try {
          const response = await axios.post('http://localhost:3000/auth/login', {
              email: this.email,
              password: this.password,
          });

          // Assuming the backend returns a token upon successful login
          const token = response.data.token;
          localStorage.setItem('token', token);

          // Set the current user 
          setCurrentUser(response.data.user);

          this.$router.push('/');

        } catch (error) {
          // Redirect to Unauthorized.vue if login fails
          this.$router.push('/login');
          // shwo error message
          alert('Erreur de connexion');
        }
      },
    },
  };
  </script>
  