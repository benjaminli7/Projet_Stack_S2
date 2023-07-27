import io from 'socket.io-client';
import {eventBus}  from './eventBus';

const BASE_URL = import.meta.env.VITE_BASE_URL;

let socketInstance = null;

export const getSocket = () => {
  return socketInstance;
};

export const initSocket = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user != null && !socketInstance) {
    const newSocket = io(BASE_URL);
    console.log('newSocket', newSocket);
    newSocket.emit('authenticate', user.id);
    socketInstance = newSocket;
    newSocket.on('achievement', function (data) {
      console.log('achievement trigered !! ', data);
      eventBus.dispatchEvent(new CustomEvent('achievementReceived', { detail: data.achievement }));
    });
  }
};
