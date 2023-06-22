import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Home.vue';
import Login from './components/auth/Login.vue';
import Register from './components/auth/Register.vue';
import VerifyEmail from "./components/auth/VerifyEmail.vue";

import Profile from './components/user/Profile.vue';

import NotFound from './components/NotFound.vue';
import GamemodeView from "./components/game/GamemodeView.vue";
import MultiplayerView from "./components/game/MultiplayerView.vue";


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    // meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name : 'Login',
    component: Login
  },
  {
    path: '/register',
    name : 'Register',
    component: Register
  },
  {
    path: '/verify-email',
    name: 'VerifyEmail',
    component: VerifyEmail
  },
  {
    path: '/logout',
    name : 'Logout',
  },
  {
    path: '/profile/:id',
    name : 'Profile',
    component: Profile
  },
  {
    path: '/:pathMatch(.*)*',
    name : 'NotFound',
    component: NotFound
  },
  {
    path: '/friends',
    name : 'Friends',
    component: () => import('./components/assets/Friends.vue'),
  },
  {
    path : '/gamemode',
    name: 'Gamemode',
    component: GamemodeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/multiplayer',
    name : 'Multiplayer',
    component: MultiplayerView,
    meta: { requiresAuth: true }
  }

];

const router = createRouter({
  history: createWebHistory(),
  routes
});


router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token');

  if (to.name === 'Login' || to.name === 'Register') {
    if (isAuthenticated) {
      // User is already authenticated, redirect to the home page
      next('/');
    } else {
      next();
    }
  } else if (to.name === 'Logout') {
    // User is logging out, remove token from localStorage and redirect to the login page
    localStorage.removeItem('token');
    location.reload();
  } else {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (isAuthenticated) {
        next();
      } else {
        next('/login');
      }
    } else {
      next();
    }
  }
});



export default router;
