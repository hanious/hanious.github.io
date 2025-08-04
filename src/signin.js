import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import AppSignIn from './AppSignIn.vue';

const app = createApp(AppSignIn);
app.use(createPinia());
app.mount('#app-signin');
