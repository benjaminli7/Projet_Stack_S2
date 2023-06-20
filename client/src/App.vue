<script setup>
  import Navbar from './components/commons/Navbar.vue'

</script>

<template>
  <div>
    <Navbar v-if="$route.name !== 'Login' && $route.name !== 'Register'" class="w-screen"></Navbar>
    <div id="app" class="p-4 m-4">
      <router-view></router-view>
    </div>
  </div>
</template>

