import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import MainPage from './components/mainpages/LandingPage.vue';
import AddCar from './components/mainpages/addcar/AddCar.vue';
import EditCar from './components/mainpages/addcar/EditCar.vue';
import './style.css';

const app = createApp(App);

createApp(App);

const routes = [
  { path: '/', component: MainPage },
  { path: '/addcar', component: AddCar },
  { path: '/editcar/:id', component: EditCar },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

app.use(router);
app.mount('#app');
