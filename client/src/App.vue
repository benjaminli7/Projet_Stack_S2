<script setup>
  import Navbar from './components/layout/Navbar.vue';
  import BackNavbar from './components/layout/BackNavbar.vue';
  import AchievementPopup from './components/AchievementPopup.vue';
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();

  const showNavbar = computed(() => {
  // hide navbar if route contains "multiplayer"

    const hiddenRoutes = ['Login', 'Register', 'GoogleSetpwd',undefined, 'Multiplayer'];
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
    <AchievementPopup> </AchievementPopup>
    <BackNavbar v-if="showNavbar && showBackNavbar"></BackNavbar>
    <!-- <Friends v-if="showNavbar" class="w-screen"></Friends> -->
    <div id="app" class="">
      <router-view></router-view>
    </div>
  </div>
</template>


