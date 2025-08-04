import './assets/main.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import AppSignUp from './AppSignUp.vue';

const app = createApp(AppSignUp);
app.use(createPinia());
app.mount('#app-signup');
