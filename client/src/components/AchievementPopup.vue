<script setup>
import { ref, onMounted, onUnmounted, inject } from 'vue';
import { eventBus } from '../services/eventBus';

const showPopup = ref(false);
const achievementData = ref({});

// Use inject to access the achievement data from the event bus
// const achievementData = inject('achievementData', {});



// Listen for the achievementReceived event and update the showPopup ref accordingly
const onAchievementReceived = (event) => {
  // Extract the achievement data from the event
  const data = event.detail;
  // Show the achievement popup using the received data
  achievementData.value = data;
  showPopup.value = true;

  // Hide the popup after 5 seconds
  setTimeout(() => {
    showPopup.value = false;
  }, 5000);
};

onMounted(() => {
  // Register the event listener when the component is mounted
  eventBus.addEventListener('achievementReceived', onAchievementReceived);
});

onUnmounted(() => {
  // Unregister the event listener when the component is unmounted
  eventBus.removeEventListener('achievementReceived', onAchievementReceived);
});
</script>
<template>
  <transition name="popup-fade">
    <div v-if="showPopup" class="achievement-popup rounded-tl-lg">
      <div class="popup-content">
        <div class="flex justify-center items-center">
          <img :src="achievementData?.image" alt="Achievement icon" class="w-8 h-8"/>
        </div>
        <p> {{ achievementData?.name }}</p>
      </div>
    </div>
  </transition>
</template>

<style scoped>
  .achievement-popup {
    position: fixed;
    bottom: 0; /* Stick to the bottom */
    right: 0; /* Stick to the right */
    background-color: #333; /* Dark background color */
    color: #fff; /* Text color */
    padding: 15px 25px; /* Adjusted to make it taller */
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-width: 300px; /* Adjusted to make it less wide */
  }

  .popup-content {
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }

  /* Rounded top-left corner */
  .rounded-tl-lg {
    border-top-left-radius: 20px;
  }

  /* Fade-in/fade-out animation */
  .popup-fade-enter-active,
  .popup-fade-leave-active {
    transition: opacity 0.5s;
  }

  .popup-fade-enter-from,
  .popup-fade-leave-to {
    opacity: 0;
  }
</style>
