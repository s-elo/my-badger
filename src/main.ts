import { createApp } from 'vue';
import { createPinia } from 'pinia';
import WaveUI from 'wave-ui';
import 'wave-ui/dist/wave-ui.css';
import './style.scss';
import App from './App.vue';

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);
app.use(WaveUI);

app.mount('#app');
