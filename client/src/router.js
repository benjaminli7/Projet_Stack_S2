import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import Login from './views/auth/Login.vue';
import Register from './views/auth/Register.vue';
import VerifyEmail from "./views/auth/VerifyEmail.vue";
import ForgetPassword from './views/auth/ForgetPassword.vue';
import ResetPassword from './views/auth/ResetPassword.vue';

import Profile from './views/user/Profile.vue';
import UpdateProfile from './views/user/UpdateProfile.vue';

import NotFound from './components/NotFound.vue';
import MultiplayerView from "./views/game/MultiplayerView.vue";
import Friends from "./views/user/friends/Friends.vue"
import BackDashboard from "./views/back/BackDashboard.vue"
import { googleAuthCallback } from "./services/google-auth";
import GoogleSetpwd from "./views/auth/GoogleSetpwd.vue";
import Premium from './views/user/Premium.vue';

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/google/callback",
    name: "GoogleCallback",
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/verify-email",
    name: "VerifyEmail",
    component: VerifyEmail,
  },
  {
    path: "/forget-password",
    name: "ForgetPassword",
    component: ForgetPassword,
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    component: ResetPassword,
  },
  {
    path: "/setGooglePassword",
    name: "GoogleSetpwd",
    component: GoogleSetpwd,
  },
  {
    path: "/logout",
    name: "Logout",
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
  {
    path: '/update-profile',
    name : 'UpdateProfile',
    component: UpdateProfile,
    meta: { requiresAuth: true }
  },
  {
    path: "/profile",
    name: "Profile",

    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: "/friends",
    name: "Friends",
    component: Friends,
    meta: { requiresAuth: true },
  },
  {
    path: "/multiplayer",
    name: "Multiplayer",
    component: MultiplayerView,
    meta: { requiresAuth: true },
  },
  {
    path: '/premium',
    name: 'Premium',
    component: Premium
  },

  // Back office routes
  {
    path: "/back",
    name: "BackDashboard",
    component: BackDashboard,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach( async (to, from, next) => {
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
  }
  else {
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
    }
    else if(to.name === 'GoogleCallback') {
      const code = to.query.code;
      try {
        const data = await googleAuthCallback(code)
        if (data.status === 200) {
          localStorage.setItem('token', data.data.token);

          next('/');
        } else if (data.status === 201) {
          // The user has been created but has to set his password
          localStorage.setItem('token', data.data.token);
          return next('/setGooglePassword');
        } else {
          alert('Une erreur est survenue')
          return next('/');
        }
      } catch (error) {
        console.error(error);
        next('/'); // Redirect to an error page or fallback route
      }

    }
    else {
      next();
    }
  }
});




export default router;
