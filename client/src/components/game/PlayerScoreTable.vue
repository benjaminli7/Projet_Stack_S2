<script setup>
import { defineProps, onMounted, ref } from "vue";
import { Button, Modal } from "flowbite-vue";

import { useUserStore } from '../../userStore'
const userStore = useUserStore();
const user = userStore.getUser;

const reportTextArea = ref('');
const isReportSent = ref(false); // A new reactive variable to track the report status


const props = defineProps({
  username: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  guesses: {
    type: Array,
    required: true,
  },
});

const checkIsUser= () => {
  
  if (user.username == props.username) {
    return true;
  } else {
    return false;
  }
};

const isShowModal = ref(false)
function closeModal() {
  isShowModal.value = false
}
function showModal() {
  isShowModal.value = true
}

const sendReport = async () => {
  try {
    closeModal();
    const username = user.username;
    const reportedUser = props.username;
    const report = reportTextArea.value;

    if( !username ) {
      throw new Error('User is not logged in');
    }
    const reportUser = await userStore.reportUser( reportedUser, report);

    if( reportUser ) {
      isReportSent.value = true;
      setTimeout(() => {
        isReportSent.value = false;
      }, 3000);
    }

  } catch (error) {
    throw new Error('Failed to report user');
  }
};
</script>


<template>
  <div>
    <div>
      <h3>{{ props.username }}</h3>

      <button v-if="checkIsUser()" @click="showModal" type="button" class="mt-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Report
      </button>   
      <!-- Modal -->


      <form @submit.prevent="sendReport">
        <Modal :size="size" v-if="isShowModal" @close="closeModal">
          <template #header>
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
              Report {{ props.username }} ?
            </h3>
          </template>
          <template #body>
              <div class="mb-4">
                <textarea v-model="reportTextArea" placeholder="Report Message ..." class="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none resize-none"></textarea>
              </div>
          </template>
          <template #footer>
            <div class="flex justify-between">
              <button type="submit" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                Send Report
              </button>
            </div>
          </template>
        </Modal>
      </form>


      
    </div>

    <div class="relative overflow-x-auto">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th scope="col" class="px-6 py-3">Round</th>
            <th scope="col" class="px-6 py-3">Score</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, index) in props.guesses" :key="index">
            <th
              scope="row"
              class="px-6 py-4 font-medium text-gray-700 whitespace-nowrap"
            >
              {{ index + 1 }}
            </th>
            <td class="px-6 py-4">{{ entry.score }}</td>
          </tr>
          <tr>
            <th
              scope="row"
              class="px-6 py-4 font-medium text-gray-700 whitespace-nowrap"
            >
              Total
            </th>
            <td class="px-6 py-4">{{ props.score }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Confirm Report Sended-->
    <div v-if="isReportSent" class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black text-white px-4 py-2 rounded-lg shadow-lg">
     Demande de report envoyée ! 
    </div>
  </div>


</template>


