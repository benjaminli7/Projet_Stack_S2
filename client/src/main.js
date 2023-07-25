import { createApp } from 'vue'
import './style.css'
import router from './router';
import App from './App.vue'
import { createPinia } from 'pinia'
import { initSocket } from './services/socket';
import piniaPersist from 'pinia-plugin-persist'


(async () => {
    await initSocket();
})();


const pinia = createPinia();

pinia.use(piniaPersist);



createApp(App).use(router).use(pinia).mount('#app');

