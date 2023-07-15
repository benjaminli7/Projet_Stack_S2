<script setup>
import FriendsList from './FriendsList.vue'
import FriendsAdd from './FriendsAdd.vue'
import { onMounted, reactive, ref } from 'vue'
import { useUserStore } from '../../../userStore'

const userStore = useUserStore();

const state = reactive({
  actualFriends: [],
  waitingRequests: [],
  receivedRequests: [],
  loading: true  
});

const fetchUserFriends = async () => {
  try {
    const userId = userStore.getUser.id;
    const friends = await userStore.getUserFriends(userId);
    const receivedRequests = await userStore.getReceivedFriendRequests(userId);


    state.actualFriends = friends.filter(friend => friend.status === true);
    state.waitingRequests = friends.filter(friend => friend.status === false);
    state.receivedRequests = receivedRequests;
    state.loading = false;

  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch user friends');
  }
};

onMounted(fetchUserFriends);

const reloadList = async () => {
    state.loading = true;
    await fetchUserFriends();
};
</script>

<template>
  <div>
    <div class="center">
      <FriendsAdd @add-friend="reloadList" />
    </div>
    <div v-if="!state.loading">  
      <FriendsList 
      @accept-friend-request="reloadList"
      @decline-friend-request="reloadList"
      @cancel-friend-request="reloadList"
      @remove-friend="reloadList"
      :friends="{
        actualFriends: state.actualFriends,
        waitingRequests: state.waitingRequests,
        receivedRequests: state.receivedRequests
      }" />
      
    </div>
  </div>
</template>
