  
  <script setup>
    import { ref, onBeforeMount } from 'vue';
    import { useUserStore } from '../userStore';
    import { getSocket } from '../services/socket';

      
    const showPopup = ref(false);
    const achievementData = ref({});
    

    onBeforeMount(() => {
        const userStore = useUserStore();

        const socket = getSocket();
        console.log("Socket" ,socket);
    //     const user = userStore.getUser;
    //     const socket = userStore.getSocket;

    //     console.log("User" ,user);

    //     console.log("Socket" ,socket);
    //     // if( localStorage.getItem('token')){
    //     // }
    //     if(socket){
    //         socket.on("connection", (message) => {
    //             alert("connection");
            
    //         });

    //         socket.on("achievement", (achievement) => {
                
    //             alert(JSON.stringify(achievement));
    //         });
    //     }
    // });
//     onBeforeUnmount(() => {
//     // Disconnect the socket when the component is unmounted
//     socket.disconnect();
  });
  </script>

<template>
    <div v-if="showPopup" class="achievement-popup">
      <div class="popup-content">
        <p>Congratulations! You've unlocked a new achievement:</p>
        <p>{{ achievementData.name }}</p>
        <!-- Display other achievement data here -->
      </div>
    </div>
</template>

  
  <style>
  .achievement-popup {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #fff;
    padding: 10px 20px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .popup-content {
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }
  </style>
  