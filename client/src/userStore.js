import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
  }),
  getters: {
    getUser: (state) => {
      if(localStorage.getItem("user")) {
        return JSON.parse(localStorage.getItem("user"));
      } else {
        return state.user
      }

    },
  },
  actions: {
    async login(email, password) {
      try {
        const response = await axios.post("http://localhost:3000/auth/login", {
          email,
          password,
        });

        const token = response.data.token;
        localStorage.setItem("token", token);

        const user = response.data.user;
        this.setUser(user);
      } catch (error) {
        console.error(error);
        throw new Error("Failed to login");
      }
    },
    setUser(user) {
      this.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },
  },
});
