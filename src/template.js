import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import AppTemplate from './AppTemplate.vue';

const app = createApp(AppTemplate);
app.use(createPinia());
app.mount('#app-template');
