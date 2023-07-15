import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import Login from './views/auth/Login.vue';
import Register from './views/auth/Register.vue';
import VerifyEmail from "./views/auth/VerifyEmail.vue";

import Profile from './views/user/Profile.vue';

import NotFound from './components/NotFound.vue';
import GamemodeView from "./views/game/GamemodeView.vue";
import MultiplayerView from "./views/game/MultiplayerView.vue";
import Friends from "./views/user/friends/Friends.vue"
import BackDashboard from "./views/back/BackDashboard.vue"

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
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
    path: '/:pathMatch(.*)*',
    name : 'NotFound',
    component: NotFound
  },
  {
    path: '/profile',
    name : 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/friends',
    name : 'Friends',
    component: Friends,
    meta: { requiresAuth: true }
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
  },

  // Back office routes
  {
    path: '/back',
    name : 'BackDashboard',
    component: BackDashboard,
    meta: { requiresAuth: true, requiresAdmin: true }
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
      next('/');
    } else {
      next();
    }
  } else if (to.name === 'Logout') {
    localStorage.removeItem('token');
    location.reload();
  } else {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (isAuthenticated) {
        next();
      } else {
        next('/login');
      }
    } else if (to.matched.some(record => record.meta.requiresAdmin)) {
      if (isAuthenticated) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.roles.includes('admin')) {
          next();
        } else {
          next('/');
        }
      } else {
        next('/login');
      }
    } else {
      next();
    }
  }
});




export default router;
