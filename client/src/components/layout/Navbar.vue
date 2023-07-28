<script setup>
import { useDark, useToggle } from "@vueuse/core";
import { Button, Navbar, NavbarCollapse, NavbarLink, NavbarLogo } from "flowbite-vue";
import { computed } from "vue";
import { useUserStore } from "../../userStore";

const isAuthenticated = computed(() => {
  return localStorage.getItem("token") !== null;
});
// check if isAuthentificated then make a const with user data


const isDark = useDark();
const toggleDark = useToggle(isDark);
const user = computed( () => {
  const userStore = useUserStore();
  if(userStore.getUser) {
    return userStore.getUser;
  } else {
    const user = localStorage.getItem("user");
    console.log(JSON.parse(user));
    return JSON.parse(user);
  }
});
</script>

<template>
  <Navbar class="dark:bg-gray-500">
    <template #logo>
        <NavbarLogo link="/" alt="ChallengeGuessr logo" image-url="https://i.imgur.com/NqBIjNH.png">
          ChallengeGuessr
        </NavbarLogo>
    </template>
    <template #default="{ isShowMenu }">
      <NavbarCollapse :isShowMenu="isShowMenu">
        <NavbarLink link="/">Accueil</NavbarLink>
        <NavbarLink link="/multiplayer">Jouer</NavbarLink>
        <NavbarLink link="/ranking">Classement</NavbarLink>
        <NavbarLink link="/profile">Profil</NavbarLink>
        <NavbarLink link="/friends">Amis</NavbarLink>
        <NavbarLink link="/premium">Premium</NavbarLink>
        <!-- <NavbarLink v-if="isAuthenticated && user.roles.includes('admin')" link="/back">Back Office</NavbarLink> -->
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
