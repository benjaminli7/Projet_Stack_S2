<script setup>
  import Navbar from './components/assets/Navbar.vue'
</script>

<template>
  <div>
    <Navbar v-if="$route.name !== 'Login' && $route.name !== 'Register'" class="w-screen"></Navbar>
    <div id="app" class="m-4 p-4">
      <router-view></router-view>
    </div>
  </div>
</template>

