import { createApp } from 'vue';
import './style.css';
import router from './router';
import App from './App.vue';
import { createPinia } from 'pinia';
import { initSocket } from './services/socket';
import piniaPersist from 'pinia-plugin-persist';
import AchievementPopup from './components/AchievementPopup.vue';
import { eventBus } from './services/eventBus'; // Import the eventBus instance

(async () => {
  await initSocket();
})();

const pinia = createPinia();
pinia.use(piniaPersist);

const app = createApp(App).use(router).use(pinia);

// Provide the eventBus to be accessible across components
app.provide('eventBus', eventBus);

app.mount('#app');
