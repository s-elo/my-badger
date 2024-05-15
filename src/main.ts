import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Quasar, Notify } from 'quasar';
import '@quasar/extras/material-icons/material-icons.css';
import 'quasar/src/css/index.sass';
import './style.scss';
import App from './App.vue';

const app = createApp(App);

app.use(Quasar, {
  plugins: {
    Notify,
  },
  config: {
    notify: {
      position: 'top',
      timeout: 500,
    },
  },
});

const pinia = createPinia();
app.use(pinia);

app.mount('#app');
