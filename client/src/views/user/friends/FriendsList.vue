<script setup>
import { Avatar } from 'flowbite-vue'
import { defineProps } from 'vue'
import { useUserStore } from '../../../userStore'

const props = defineProps({
  friends: {
    type: Object,
    required: true
  }
})

const actualFriends = props.friends.actualFriends;
const waitingRequests = props.friends.waitingRequests;
const receivedRequests = props.friends.receivedRequests;


const userStore = useUserStore()

const emit = defineEmits(['accept-friend-request', 'decline-friend-request', 'cancel-friend-request'])

const handleAcceptFriendRequest = (friendId) => {
  userStore.acceptFriendRequest(userStore.getUser.id, friendId)
    .then(() => {
      emit('accept-friend-request')
    })
    .catch((error) => {
      alert("Erreur lors de l'acceptation de la demande d'ami")
      console.error(error)
    });
}

const handleDeclineFriendRequest = (friendId) => {
  userStore.declineFriendRequest(userStore.getUser.id, friendId)
    .then(() => {
      emit('decline-friend-request')
    })
    .catch((error) => {
      alert("Erreur lors du refus de la demande d'ami")
    });
}

const handleCancelFriendRequest = (friendId) => {
  userStore.cancelFriendRequest(userStore.getUser.id, friendId)
    .then(() => {
      emit('cancel-friend-request')
    })
    .catch((error) => {
      // Handle error if necessary
      console.error(error)
    });
}

const handleRemoveFriend = (friendId) => {
  userStore.removeFriend(userStore.getUser.id, friendId)
    .then(() => {
      emit('remove-friend')
    })
    .catch((error) => {
      // Handle error if necessary
      console.error(error)
    });
}



</script>

<template>
  <div>
    <div>
      <h2>Amis</h2>
      <div class="flex flex-wrap">
        <div v-for="friend in actualFriends" :key="friend._id" class="w-1/6 p-4 bg-white rounded-lg shadow-lg mb-4 mr-4 relative">
          <div v-if="friend.status === true">
            <button class="absolute top-0 right-0 mt-2 mr-4 text-gray-500 hover:text-red-500" @click="handleRemoveFriend(friend._id)">
              <img src="/cross.svg"  alt="refuse user" class="w-5 h-5">
            </button>
          </div>
          <div class="items-center justify-center mb-4">
            <Avatar rounded size="lg" class="flex items-center justify-center mb-4">
              {{ friend.firstname.substring(0, 3).toUpperCase() }}
            </Avatar>
          </div>
          <div class="text-center">
            <h1 class="text-lg font-bold">{{ friend.username }}</h1>
          </div>
        </div>
      </div>
    </div>


    <div>
      <h2>Demandes envoyés</h2>
      <div class="flex flex-wrap">
        <div v-for="friend in waitingRequests" :key="friend._id" class="w-1/6 p-4 bg-white rounded-lg shadow-lg mb-4 mr-4 relative">
          <div>
            <button class="absolute top-0 right-0 mt-2 mr-1 text-gray-500 hover:text-red-500" @click="handleCancelFriendRequest(friend._id)">
              <img src="/delete_user.svg" alt="delete user" class="w-6 h-6">
            </button>
            <div class="flex items-center justify-center mb-4">
              <Avatar rounded size="lg" class="mr-4">
              </Avatar>
            </div>
          </div>
          <div class="text-center">
            <h1 class="text-lg font-bold">{{ friend.username }}</h1>
          </div>
        </div>
      </div>
    </div>

    <div>
      <h2>Demandes reçues</h2>
      <div>
        <div class="" v-for="friend in receivedRequests" :key="friend._id">
          <div class="relative w-1/6 p-4 bg-white rounded-lg shadow-lg">
            <div class="absolute top-0 left-0 mt-2 ml-4">
              <button class="text-gray-500 hover:text-green-500" @click="handleAcceptFriendRequest(friend._id)">
                <img src="/check.svg" alt="confirm user" class="w-6 h-6">
              </button>
            </div>
            <div class="absolute top-0 right-0 mt-2 mr-4">
              <button class="text-gray-500 hover:text-red-500" @click="handleDeclineFriendRequest(friend._id)">
                <img src="/cross.svg"  alt="refuse user" class="w-5 h-5">
              </button>
            </div>
            <div class="flex items-center justify-center mb-4">
              <Avatar rounded size="lg" class="mr-4">
                {{ friend.firstname.substring(0, 3).toUpperCase() }}
              </Avatar>
            </div>
            <div class="text-center">
              <h1 class="text-lg font-bold">{{ friend.username }}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
