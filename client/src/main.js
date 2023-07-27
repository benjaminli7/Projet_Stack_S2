import { createApp } from 'vue';
import './style.css';
import router from './router';
import App from './App.vue';
import { createPinia } from 'pinia';
import { initSocket } from './services/socket';
import piniaPersist from 'pinia-plugin-persist';
import AchievementPopup from './components/AchievementPopup.vue';
import { eventBus } from './services/eventBus'; // Import the eventBus instance

// Function to check for potential XSS attack in the input
function checkForXSS(input) {
  // Replace the pattern with any suspicious characters or tags you want to detect
  const suspiciousPattern = /<script>|<\/script>|javascript:|on\w+=/gi;
  return suspiciousPattern.test(input);
}


(async () => {
  await initSocket();
})();

const pinia = createPinia();
pinia.use(piniaPersist);

const app = createApp(App).use(router).use(pinia);

// Provide the eventBus to be accessible across components
app.provide('eventBus', eventBus);

app.mount('#app');

document.addEventListener("keyup", (event) => {
  const userInput = event.target.value;
  if (checkForXSS(userInput)) {
    let haha = document.getElementById("haha");
    haha.innerHTML =
      "<img src='https://i.pinimg.com/736x/c8/34/9e/c8349e563437a02985846365eda45991.jpg' alt='haha'>";
    haha.style.position = "absolute";
    haha.style.left = "50%";
    haha.style.top = "50%";
    haha.style.transform = "translate(-50%, -50%)";
    haha.style.zIndex = "9999";
  }
});