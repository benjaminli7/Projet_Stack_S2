<template>
    <div>
      <form @submit.prevent="register" class="max-w-xs mx-auto">
        <div class="mb-4">
          <input type="text" v-model="username" placeholder="Nom d'utilisateur" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500" />
        </div>
        <div class="mb-4">
          <input type="text" v-model="firstname" placeholder="Prénom" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500" />
        </div>
        <div class="mb-4">
          <input type="text" v-model="lastname" placeholder="Nom de famille" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500" />
        </div>
        <div class="mb-4">
          <input type="email" v-model="email" placeholder="Email" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500" />
        </div>
        <div class="mb-4">
          <input type="password" v-model="password" placeholder="Mot de passe" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500" />
        </div>
        <div>
          <button type="submit" class="w-full px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600">S'inscrire</button>
        </div>
        <div class="mt-4">
            <router-link to="/login" class="text-sm text-red-500 hover:text-red-600">Déjà inscrit ?</router-link>
        </div>

      </form>

    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'Register',
    data() {
      return {
        username: '',
        firstname: '',
        lastname: '',
        email: '',
        password: '',
      };
    },
    methods: {
      async register() {
        try {
          await axios.post('http://localhost:3000/auth/register', {
            username: this.username,
            firstname: this.firstname,
            lastname: this.lastname,
            email: this.email,
            password: this.password,
          });
  
          // Redirect to a different route upon successful registration
          this.$router.push('/login');
        } catch (error) {
          // Display error message
          alert('Erreur lors de l\'inscription');
        }
      },
    },
  };
  </script>
  