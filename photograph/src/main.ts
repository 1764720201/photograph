import uView from './uni_modules/vk-uview-ui';
import { createSSRApp } from 'vue';

import store from '@/store';

import App from './App.vue';
import mitt from 'mitt';
const Mitt = mitt();
declare module 'vue' {
  export interface ComponentCustomProperties {
    $Bus: typeof Mitt;
  }
}
export function createApp() {
  const app = createSSRApp(App);
  app.use(store).use(uView);
  app.config.globalProperties.$Bus = Mitt;
  app.mount('#app');
  return {
    app
  };
}
