<script setup>
import { io } from "socket.io-client";
import { onMounted, ref } from "vue";

const messages = ref([]);
const newMessage = ref("");
let socket;

onMounted(() => {
  socket = io("http://localhost:3000");

  socket.on("connection", (message) => {
    messages.value.push({
      id: Date.now(),
      text: message,
    });
  });

  socket.on("disconnection", (message) => {
    messages.value.push({
      id: Date.now(),
      text: message,
    });
  });

  socket.on("message", (message) => {
    messages.value.push(message);
  });
});

const sendMessage = () => {
  if (newMessage.value) {
    const message = {
      id: Date.now(),
      text: newMessage.value,
    };
    socket.emit("sendMessage", message);
    newMessage.value = "";
  }
};
</script>

<template>
  <h1>Multiplayer view</h1>
  <button @click="test">Jouer</button>

  <div>
    <div v-for="message in messages" :key="message.id">{{ message.text }}</div>
    <input
      type="text"
      v-model="newMessage"
      @keyup.enter="sendMessage"
      placeholder="Type your message"
    />
  </div>
</template>
