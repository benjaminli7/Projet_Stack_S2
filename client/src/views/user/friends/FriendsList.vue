<script setup>
import { Avatar } from "flowbite-vue";
import { defineProps } from "vue";
import { useUserStore } from "../../../userStore";

const props = defineProps({
  friends: {
    type: Object,
    required: true,
  },
});

const actualFriends = props.friends.actualFriends;
const waitingRequests = props.friends.waitingRequests;
const receivedRequests = props.friends.receivedRequests;

const userStore = useUserStore();

const emit = defineEmits([
  "accept-friend-request",
  "decline-friend-request",
  "cancel-friend-request",
]);

const handleAcceptFriendRequest = (friendUsername) => {
  userStore
    .acceptFriendRequest(userStore.getUser.username, friendUsername)
    .then(() => {
      emit("accept-friend-request");
    })
    .catch((error) => {
      alert("Erreur lors de l'acceptation de la demande d'ami");
      console.error(error);
    });
};

const handleDeclineFriendRequest = (friendUsername) => {
  userStore
    .declineFriendRequest(userStore.getUser.username, friendUsername)
    .then(() => {
      emit("decline-friend-request");
    })
    .catch((error) => {
      alert("Erreur lors du refus de la demande d'ami");
    });
};

const handleCancelFriendRequest = (friendUsername) => {
  userStore
    .cancelFriendRequest(userStore.getUser.username, friendUsername)
    .then(() => {
      emit("cancel-friend-request");
    })
    .catch((error) => {
      console.error(error);
    });
};

const handleRemoveFriend = (friendUsername) => {
  userStore
    .removeFriend(userStore.getUser.username, friendUsername)
    .then(() => {
      emit("remove-friend");
    })
    .catch((error) => {
      // Handle error if necessary
      console.error(error);
    });
};
</script>

<template>
  <div class="container mx-auto mt-8">
    <div class="flex flex-col gap-9">

      <div class="flex flex-col gap-3">
        <h2 class="font-bold text-center">Amis</h2>
        <div v-if="actualFriends.length > 0">
          <div class="flex flex-wrap justify-center">
            <div
              v-for="friend in actualFriends"
              :key="friend._id"
              class="relative w-1/6 p-4 mb-4 mr-4 bg-white rounded-lg shadow-lg"
            >
              <div v-if="friend.status === 'accepted'">
                <button
                  class="absolute top-0 right-0 mt-2 mr-4 text-gray-500 hover:text-red-500"
                  @click="handleRemoveFriend(friend.user.username)"
                >
                  <img src="/cross.svg" alt="refuse user" class="w-5 h-5" />
                </button>
              </div>
              <div class="items-center justify-center mb-4">
                <Avatar
                  rounded
                  size="lg"
                  class="flex items-center justify-center mb-4"
                >
                  {{ friend.user.firstname.substring(0, 3).toUpperCase() }}
                </Avatar>
              </div>
              <div class="text-center">
                <h1 class="text-lg font-bold">{{ friend.user.username }}</h1>
                <span class="ml-2 text-sm font-normal"
                  >{{ friend.user.elo }}LP</span
                >
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <p class="text-center">Vous n'avez pas encore d'amis ☹️</p>
        </div>
      </div>

      <div class="flex flex-col gap-3">
        <h2 class="font-bold text-center">Demandes envoyés</h2>
        <div v-if="waitingRequests.length > 0">
          <div class="flex flex-wrap justify-center">
            <div
              v-for="friend in waitingRequests"
              :key="friend._id"
              class="relative w-1/6 p-4 mb-4 mr-4 bg-white rounded-lg shadow-lg"
            >
              <div>
                <button
                  class="absolute top-0 right-0 mt-2 mr-1 text-gray-500 hover:text-red-500"
                  @click="handleCancelFriendRequest(friend.user.username)"
                >
                  <img src="/delete_user.svg" alt="delete user" class="w-6 h-6" />
                </button>
                <div class="flex items-center justify-center mb-4">
                  <Avatar rounded size="lg" class="mr-4"> </Avatar>
                </div>
              </div>
              <div class="text-center">
                <h1 class="text-lg font-bold">{{ friend.user.username }}</h1>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <p class="text-center">Vous n'avez pas encore envoyé de demandes ☹️</p>
        </div>
      </div>

      <div class="flex flex-col gap-3">
        <h2 class="font-bold text-center">Demandes reçues</h2>
        <div v-if="receivedRequests.length > 0">
          <div class="flex flex-wrap justify-center gap-5">

            <div class="relative w-1/6 p-4 bg-white rounded-lg shadow-lg" v-for="friend in receivedRequests" :key="friend._id">
                <div class="absolute top-0 left-0 mt-2 ml-4">
                  <button
                    class="text-gray-500 hover:text-green-500"
                    @click="handleAcceptFriendRequest(friend.user.username)"
                  >
                    <img src="/check.svg" alt="confirm user" class="w-6 h-6" />
                  </button>
                </div>
                <div class="absolute top-0 right-0 mt-2 mr-4">
                  <button
                    class="text-gray-500 hover:text-red-500"
                    @click="handleDeclineFriendRequest(friend.user.username)"
                  >
                    <img src="/cross.svg" alt="refuse user" class="w-5 h-5" />
                  </button>
                </div>
                <div class="flex items-center justify-center mb-4">
                  <Avatar rounded size="lg" class="mr-4">
                    {{ friend.user.firstname.substring(0, 3).toUpperCase() }}
                  </Avatar>
                </div>
                <div class="text-center">
                  <h1 class="text-lg font-bold">{{ friend.user.username }}</h1>
                </div>
            </div>
          </div>
        </div>
        <div v-else>
          <p class="text-center">Vous n'avez pas encore reçu de demandes ☹️</p>
        </div>
      </div>
    </div>
  </div>
</template>
