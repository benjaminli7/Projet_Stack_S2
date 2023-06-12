import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './views/Home.vue';
import Login from './components/auth/Login.vue';
import Register from './components/auth/Register.vue';



const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { requiresAuth: true }
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
    path: '/logout',
    name : 'Logout',
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
    next('/login');
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
