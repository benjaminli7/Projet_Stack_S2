import { defineStore } from 'pinia';
import axios from 'axios';
import { io } from 'socket.io-client';


export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    socket: null,
  }),
  getters: {
    getUser: (state) => {
      if(localStorage.getItem("user")) {
        return JSON.parse(localStorage.getItem("user"));
      } else {
        return state.user
      }

    },
    agetSocket: (state) => {
      return state.socket;
    }
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
        await this.setUser(user);

        const socket = this.getSocket; // Get the existing socket from the state

        if (!socket) {
          // Create a new socket only if it doesn't exist
          const newSocket = await io('http://localhost:3000');
          newSocket.emit('authenticate',user.id ); 
          //authentification

          await this.setSocket(newSocket);
        }


      } catch (error) {
        console.error(error);
        throw new Error("Failed to login");
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

        console.log(typeof username + " " + username + " " + typeof token + " " + token)
        const response = await axios.get(
          `http://localhost:3000/users/friends`,
          {
            params: {
              username: username,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        
        //console.log(response.data);
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
        console.log(typeof username + " " + username + " " + typeof token + " " + token)
        const response = await axios.get(
          `http://localhost:3000/users/friend-requests`,
          {
            params: {
              username: username,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        console.log(response.data);

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
            username,
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
        // alert(username + " " + friendUsername);
        const response = await axios.put(
          `http://localhost:3000/friends/friend-requests/accept`,
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
              username,
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
    disconnectSocket() {
      if (this.socket) {
        this.socket.disconnect();
        this.socket = null; // Reset the socket instance in the state
      }
    },
  },
});
