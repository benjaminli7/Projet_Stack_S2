<script setup>
  import Navbar from './components/layout/Navbar.vue'

</script>

<template>
  <div>
    <Navbar v-if="$route.name !== 'Login' && $route.name !== 'Register'" class="w-screen"></Navbar>
    <!-- <Friends v-if="$route.name !== 'Login' && $route.name !== 'Register'" class="w-screen"></Friends> -->
    <div id="app" class="container mx-auto">
      <router-view></router-view>
    </div>
  </div>
</template>

