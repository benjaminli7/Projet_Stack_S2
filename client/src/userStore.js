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
    async getUserFriends(userId) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/user/friends/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const friends = response.data;
        return friends;

      } catch (error) {
        console.error(error);
        throw new Error('Failed to get friends');
      }
    },
    async addFriend(userId,friendId) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          'http://localhost:3000/user/friends',
          {
            userId,
            friendId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ).catch((err) => {
          throw new Error(err.response.data.message);
        })      

      } catch (error) {
        alert(error);
      }
    },
    async getReceivedFriendRequests(userId) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/user/friends/pending/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const friends = response.data;
        return friends;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to get friends');
      }
    },    
    async acceptFriendRequest(userId, friendId) {
      try {
        const token = localStorage.getItem("token");
        // alert(userId + " " + friendId);
        const response = await axios.patch(
          `http://localhost:3000/user/friends/accept`,
          {
            userId,
            friendId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response
      } catch (error) {
        console.error(error);
        throw new Error("Failed to accept friend request");
      }
    },
    async declineFriendRequest(userId, friendId) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.patch(
          `http://localhost:3000/user/friends/reject`,
          {
            userId,
            friendId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        return response
      } catch (error) {
        console.error(error);
        throw new Error("Failed to decline friend request");
      }
    },
    async cancelFriendRequest(userId, friendId) {
      try {
        const token = localStorage.getItem("token");
        console.log(userId + " " + friendId);
        const response = await axios.patch(
          `http://localhost:3000/user/friends/cancel`,
          {
            userId,
            friendId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response
      } catch (error) {
        console.error(error);
        throw new Error("Failed to cancel friend request");
      }
    },
    async removeFriend(userId, friendId) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(
          `http://localhost:3000/user/friends`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: {
              userId,
              friendId,
            },
          }
        );
        return response
      } catch (error) {
        console.error(error);
        throw new Error("Failed to delete friend");
      }
    }
  },
});
