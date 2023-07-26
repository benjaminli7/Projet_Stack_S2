<script setup>
import { defineProps } from "vue";

const props = defineProps({
  username: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  guesses: {
    type: Array,
    required: true,
  },
});
</script>

<template>
    <h3>{{ props.username }}</h3>
    <div class="relative overflow-x-auto">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th scope="col" class="px-6 py-3">Round</th>
            <th scope="col" class="px-6 py-3">Score</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, index) in props.guesses" :key="index">
            <th
              scope="row"
              class="px-6 py-4 font-medium text-gray-700 whitespace-nowrap"
            >
              {{ index + 1 }}
            </th>
            <td class="px-6 py-4">{{ entry.score }}</td>
          </tr>
          <tr>
            <th
              scope="row"
              class="px-6 py-4 font-medium text-gray-700 whitespace-nowrap"
            >
              Total
            </th>
            <td class="px-6 py-4">{{ props.score }}</td>
          </tr>
        </tbody>
      </table>
    </div>
</template>
