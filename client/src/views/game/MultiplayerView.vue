<script setup>
import { io } from "socket.io-client";
import { onMounted, ref } from "vue";
import { useUserStore } from "../../userStore";
import MapView from "./MapView.vue";

let socket;
const store = useUserStore();
const user = store.getUser;
const loading = ref(true);

onMounted(() => {
  socket = io("http://localhost:3000");
  socket.emit("playerJoined", user.username)
  socket.emit("findOpponent")

  socket.on("joinRoom", (roomName) => {
    console.log("joined room", roomName)
    socket.emit("joinRoom", roomName)
  })

  socket.on("gameStarting", () => {
    loading.value = false;
    console.log("game starting");
    // Handle the "gameStarting" event
    // Perform further actions as needed
  });

});

</script>

<template>
  <p v-if="loading">Searching opponent...</p>
  <p v-else>
    <MapView />
  </p>
</template>
