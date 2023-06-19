<template>
  <nav class="flex justify-center space-x-4">
    <router-link
      to="/"
      class="px-3 py-2 font-bold rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900"
      >Home</router-link
    >
    <router-link
      v-if="!isAuthenticated"
      to="/login"
      class="px-3 py-2 font-bold rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900"
      >Login</router-link
    >
    <router-link
      v-else
      to="/logout"
      class="px-3 py-2 font-bold rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900"
      >Logout</router-link
    >
  </nav>
</template>

<script setup>
import { computed } from "vue";

const isAuthenticated = computed(() => {
  return localStorage.getItem("token") !== null;
});
</script>
