<script setup>
import { io } from "socket.io-client";

import { onMounted, ref } from 'vue'
let socketId = ref('')
let socket;

socket = io("http://localhost:3000");
onMounted(() => {
    socket.emit("hello")
    socket.emit("test")

})

const handleClick = () => {
    socket.emit("click")
}
</script>

<template>
    <h1>hello world</h1>
    <button @click="handleClick">click</button>
</template>