<!-- Make a basic vue home page with a lorem ipsum text -->

<template>
    <div class="flex flex-col items-center justify-center">
      <h1 class="mb-4 text-4xl font-bold">Home</h1>
      <p class="text-xl">Challenge stack MEVN Geoguessr.</p>
      <router-link to="/gamemode">Jouer</router-link>
    </div>
 </template>


 <script>
     export default {
      name: 'Home'
     }
 </script>

