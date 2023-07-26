import io from 'socket.io-client';
import {eventBus}  from './eventBus';

let socketInstance = null;

export const getSocket = () => {
  return socketInstance;
};

export const initSocket = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);

  if (user != null && !socketInstance) {
    const newSocket = io('http://localhost:3000');
    newSocket.emit('authenticate', user.id);
    socketInstance = newSocket;

    newSocket.on('achievement', function (data) {       
      eventBus.dispatchEvent(new CustomEvent('achievementReceived', { detail: data.achievement }));
    //   }
    });
  }
};
