import io from 'socket.io-client';

let socketInstance = null;

export const getSocket = () => {
  return socketInstance;
};

export const initSocket = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && !socketInstance) {
    const newSocket = io('http://localhost:3000');
    newSocket.emit('authenticate', user.id);
    socketInstance = newSocket;

    newSocket.on('achievement', function (data) {       
        alert('User ' + user.username + ' has unlocked the achievement ' + data.achievement.name + ' !');
    //   }
    });
  }
};
