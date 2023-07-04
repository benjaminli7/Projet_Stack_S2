<script setup>
  import Navbar from './components/layout/Navbar.vue';
  import BackNavbar from './components/layout/BackNavbar.vue';
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();

  const showNavbar = computed(() => {
    const hiddenRoutes = ['Login', 'Register'];
    const isHiddenRoute = hiddenRoutes.includes(route.name);
    return !isHiddenRoute;
  });
  const showBackNavbar = computed(() => {
    const isBackRoute = route.path.includes('/back');
    return isBackRoute 
  });


</script>
<template>
  <div>
    <Navbar v-if="showNavbar && !showBackNavbar " class="w-screen"></Navbar>
    <BackNavbar v-if="showNavbar && showBackNavbar"></BackNavbar>
    <!-- <Friends v-if="showNavbar" class="w-screen"></Friends> -->
    <div id="app" class="container mx-auto">
      <router-view></router-view>
    </div>
  </div>
</template>


