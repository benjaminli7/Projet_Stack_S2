<script setup>
import { Navbar, NavbarCollapse, NavbarLink } from "flowbite-vue";
import { computed } from "vue";

const isAuthenticated = computed(() => {
  return localStorage.getItem("token") !== null;
});
</script>

<template>
  <Navbar>
    <template #logo>
      <a href="/">ChallengeGuessr</a>
    </template>
    <template #default="{ isShowMenu }">
      <NavbarCollapse :isShowMenu="isShowMenu">
        <NavbarLink link="/" is-active>Accueil</NavbarLink>
        <NavbarLink link="/gamemode">Jouer</NavbarLink>
        <NavbarLink>Classement</NavbarLink>
        <NavbarLink link="/profile">Profil</NavbarLink>
        <NavbarLink link="/friends">Friends</NavbarLink>
      </NavbarCollapse>
    </template>
    <template #right-side>
      <router-link
        v-if="!isAuthenticated"
        to="/login"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >Login</router-link
      >
      <router-link
        v-else
        to="/logout"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >Logout</router-link
      >
    </template>
  </Navbar>
</template>
