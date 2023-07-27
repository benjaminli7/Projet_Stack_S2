import { createRouter, createWebHistory } from "vue-router";
import HomeView from "./views/HomeView.vue";
import ForgetPassword from "./views/auth/ForgetPassword.vue";
import Login from "./views/auth/Login.vue";
import Register from "./views/auth/Register.vue";
import ResetPassword from "./views/auth/ResetPassword.vue";
import VerifyEmail from "./views/auth/VerifyEmail.vue";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;


import Profile from "./views/user/Profile.vue";
import UpdateProfile from "./views/user/UpdateProfile.vue";

import NotFound from "./components/NotFound.vue";
import { googleAuthCallback } from "./services/google-auth";
import GoogleSetpwd from "./views/auth/GoogleSetpwd.vue";
import BackDashboard from "./views/back/BackDashboard.vue";
import BackPayment from "./views/back/BackPayment.vue";
import BackReports from "./views/back/BackReports.vue";
import BackUser from "./views/back/BackUser.vue";
import MultiplayerView from "./views/game/MultiplayerView.vue";
import Premium from "./views/user/Premium.vue";
import Friends from "./views/user/friends/Friends.vue";
import Ranking from "./views/ranking/Ranking.vue";


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
    path: "/update-profile",
    name: "UpdateProfile",
    component: UpdateProfile,
    meta: { requiresAuth: true },
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
    path: "/premium",
    name: "Premium",
    component: Premium,
  },
  {
    path: "/ranking",
    name: "Ranking",
    component: Ranking,
  },

  // Back office routes
  {
    path: "/back",
    name: "BackDashboard",
    component: BackDashboard,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/back/users",
    name: "BackUser",
    component: BackUser,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/back/payments",
    name: "BackPayment",
    component: BackPayment,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/back/reports",
    name: "BackReports",
    component: BackReports,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const isAuthenticated = localStorage.getItem("token");

  if (to.name === "Login" || to.name === "Register") {
    if (isAuthenticated) {
      next("/");
    } else {
      next();
    }
  } else if (to.name === "Logout") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    next("/login");
  } 
  else {
    if (to.matched.some((record) => record.meta.requiresAdmin)) {
      if (isAuthenticated) {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && await isUserAdmin()) {
          next();
        } else {
          next("/profile");
        }
      } else {
        next("/login");
      }
    } else if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (isAuthenticated) {
        next();
      } else {
        next("/login");
      }
    } else if (to.name === "GoogleCallback") {
      const code = to.query.code;
      try {
        const data = await googleAuthCallback(code);
        if (data.status === 200) {
          localStorage.setItem("token", data.data.token);

          next("/");
        } else if (data.status === 201) {
          // The user has been created but has to set his password
          localStorage.setItem("token", data.data.token);
          return next("/setGooglePassword");
        } else {
          alert("Une erreur est survenue");
          return next("/");
        }
      } catch (error) {
        console.error(error);
        next("/"); // Redirect to an error page or fallback route
      }
    } else {
      next();
    }
  }
});

const isUserAdmin = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URL}/users/admin`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if(response.status === 200){
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
     
  };

export default router;
