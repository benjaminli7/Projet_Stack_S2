<script setup>
import { useDark, useToggle } from "@vueuse/core";
import { Button, Navbar, NavbarCollapse, NavbarLink } from "flowbite-vue";
import { computed } from "vue";

const isAuthenticated = computed(() => {
  return localStorage.getItem("token") !== null;
});
// check if isAuthentificated then make a const with user data
const user = computed(() => {
  let user = localStorage.getItem("user");
  if (user) {
    return JSON.parse(user);
  }
});

const isDark = useDark();
const toggleDark = useToggle(isDark);



</script>

<template>
  <Navbar class="dark:bg-gray-500">
    <template #logo>
      <a href="/" class="dark:text-white">ChallengeGuessr</a>
    </template>
    <template #default="{ isShowMenu }">
      <NavbarCollapse :isShowMenu="isShowMenu">
        <NavbarLink link="/">Accueil</NavbarLink>
        <NavbarLink link="/multiplayer">Jouer</NavbarLink>
        <NavbarLink>Classement</NavbarLink>
        <NavbarLink link="/profile">Profil</NavbarLink>
        <NavbarLink link="/friends">Friends</NavbarLink>
        <NavbarLink
          v-if="isAuthenticated && user.roles.includes('admin')"
          link="/back"
          >Back Office</NavbarLink
        >
      </NavbarCollapse>
    </template>
    <template #right-side>
      <!-- <button
        @click="toggleDark()"
        class="p-2 mr-3 text-sm text-gray-500 bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-800 focus:outline-none"
      >
        🌞/🌚
      </button> -->
      <router-link v-if="!isAuthenticated" to="/login">
        <Button color="default">Login</Button>
      </router-link>
      <router-link v-else to="/logout">
        <Button color="red">Logout</Button>
      </router-link>
    </template>
  </Navbar>
</template>
