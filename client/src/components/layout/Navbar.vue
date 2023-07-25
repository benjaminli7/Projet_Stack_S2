<script setup>
import { Button, Navbar, NavbarCollapse, NavbarLink } from "flowbite-vue";
import { computed } from "vue";
import {useUserStore} from"../../userStore";

const isAuthenticated = computed(() => {
  return localStorage.getItem("token") !== null;
});
// check if isAuthentificated then make a const with user data
  const user = computed(() => {
    const userStore = useUserStore();
    return userStore.getUser;
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
        <NavbarLink v-if="isAuthenticated && user.roles.includes('admin')" link="/back">Back Office</NavbarLink>

      </NavbarCollapse>
    </template>
    <template #right-side>
      <router-link v-if="!isAuthenticated" to="/login">
        <Button color="default">Login</Button>
      </router-link>
      <router-link v-else to="/logout">
        <Button color="red">Logout</Button>
      </router-link>
    </template>
  </Navbar>
</template>
