<script setup>
import { Button } from "flowbite-vue";
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <h1 class="mb-4 text-4xl font-bold">Home</h1>
    <p class="text-xl">Challenge stack MEVN Geoguessr.</p>
    <router-link to="/gamemode">
      <Button color="default">Jouer</Button>
    </router-link>
  </div>
</template>




