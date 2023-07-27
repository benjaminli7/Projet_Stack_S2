<script setup>
import router from '../../router';
import DisplayAchievements from '../../components/DisplayAchievements.vue';
let user = localStorage.getItem('user');
user = JSON.parse(user);
import { ref } from 'vue'
import { Tabs, Tab } from 'flowbite-vue'
const activeTab = ref('information')

</script>


<template>
    <tabs v-model="activeTab" class="p-5"> <!-- class appends to content DIV for all tabs -->
        <tab name="information" title="Information">
            <div>
                <h2 class="text-3xl font-bold text-center mb-3">Information</h2>
                <p>Pseudo : {{ user.username }}</p>
                <p>Nom: {{ user.lastname }}</p>
                <p>Prénom: {{ user.firstname }}</p>
                <button>
                    <router-link to="/update-profile" class="text-sm text-red-500 hover:text-red-600">>Modifier mon profil</router-link>
                </button>
            </div>
        </tab>
        <tab name="succes" title="Succes">
            <div class="mb-4">
                <DisplayAchievements></DisplayAchievements>
            </div>
        </tab>
        <tab name="stat" title="Stat">
        Lorem...
        </tab>
    </tabs>
</template>




