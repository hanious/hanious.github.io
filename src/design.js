import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import AppDesign from './AppDesign.vue';

const app = createApp(AppDesign);
app.use(createPinia());
app.mount('#app-design');
