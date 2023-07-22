<script setup>
import { Button } from "flowbite-vue"
</script>

<template>
    <div>
        <h1>Gamemode View</h1>
        <div class="flex gap-3">
            <router-link to="/solo">
                <Button color="default">Solo</Button>
            </router-link>
            <router-link to="/multiplayer">
                <Button color="default">1v1</Button>
            </router-link>
        </div>
    </div>
</template>


