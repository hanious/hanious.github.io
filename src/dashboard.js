import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import AppDashboard from './AppDashboard.vue';

const app = createApp(AppDashboard);
app.use(createPinia());
app.mount('#app');
