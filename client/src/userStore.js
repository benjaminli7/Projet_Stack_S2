import { defineStore } from 'pinia';
import axios from 'axios';



export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    socket: null,
  }),
  getters: {
    getUser: (state) => {
      return state.user
    },
    getSocket: (state) => {
      return state.socket;
    }
  },
  persist: {
    enabled: true
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
        this.user = user;
        localStorage.setItem("user", JSON.stringify(user));

      } catch (error) {
        console.error("error", error.response.data.error);
        throw new Error(error.response.data.error);
      }
    },
    async setUser(user) {
      this.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },
    async setSocket(socket) {
      this.socket = socket;
    },
    async getUserFriends(username) {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get(
          `http://localhost:3000/users/friends`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        const friends = response.data;
        return friends;

      } catch (error) {
        console.error(error);
        throw new Error('Failed to get friends');
      }
    },
    async getReceivedFriendRequests(username) {
      try {
        const token = localStorage.getItem('token');
        // console.log(typeof username + " " + username + " " + typeof token + " " + token)
        const response = await axios.get(
          `http://localhost:3000/users/friend-requests`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        // console.log(response.data);

        const friends = response.data;
        return friends;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to get friends');
      }
    },
    async addFriend(username,friendUsername) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          'http://localhost:3000/friends',
          {
            friendUsername,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            },
          }
        ).catch((err) => {
          throw new Error(err.response.data.message);
        })

      } catch (error) {
        alert(error);
      }
    },
    async acceptFriendRequest(username, friendUsername) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.put(
          `http://localhost:3000/friends/friend-requests/accept`,
          {
            friendUsername,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            },
          }
        );
        return response
      } catch (error) {
        console.error(error);
        throw new Error("Failed to accept friend request");
      }
    },
    async declineFriendRequest(username, friendUsername) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.put(
          `http://localhost:3000/friends/friend-requests/decline`,
          {
            username,
            friendUsername,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
'Content-Type': 'application/json',
            },
          }
        );

        return response
      } catch (error) {
        console.error(error);
        throw new Error("Failed to decline friend request");
      }
    },
    async cancelFriendRequest(username, friendUsername) {
      try {
        const token = localStorage.getItem("token");
        console.log(username + " " + friendUsername);
        const response = await axios.put(
          `http://localhost:3000/friends/friend-requests/cancel`,
          {
            friendUsername,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            },
          }
        );
        return response
      } catch (error) {
        console.error(error);
        throw new Error("Failed to cancel friend request");
      }
    },
    async removeFriend(username, friendUsername) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(
          `http://localhost:3000/friends`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            data: {
              friendUsername,
            },
          }
        );
        return response
      } catch (error) {
        console.error(error);
        throw new Error("Failed to delete friend");
      }
    },
    async getAchievements(id) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3000/users/${id}/achievements`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        return response.data;

      }
      catch (error) {
        console.error(error);
      }
    },
    disconnectSocket() {
      if (this.socket) {
        this.socket.disconnect();
        this.socket = null;
      }
    },
  },

});
