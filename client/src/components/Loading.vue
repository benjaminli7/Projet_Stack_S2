<script setup>
import { Spinner } from "flowbite-vue";
import { defineProps } from "vue";

const props = defineProps({
  size: {
    type: Number,
    default: 6,
  },
  message: {
    type: String,
    default: "Loading...",
  },
});
</script>

<template>
  <Spinner :size="props.size"></Spinner>
  <p class="font-bold">{{ props.message }}</p>
</template>
