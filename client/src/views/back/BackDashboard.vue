<script setup>
console.log('test');
import { onMounted, ref } from 'vue';
import { TheCard } from 'flowbite-vue';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem('token');
const nbUsers = ref();
const nbBan = ref();
const nbAdmin = ref();
const nbVerified = ref();
const totalAmount = ref();
const nbGames = ref();
onMounted(() => {
    axios.get(`${BASE_URL}/users`, {
            headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            console.log(response.data);
            nbUsers.value = response.data.length;
            nbBan.value = response.data.filter(user => user.status == 1).length;
            nbAdmin.value = response.data.filter(user => user.roles == 'admin').length;
            nbVerified.value = response.data.filter(user => user.isVerified == true).length;
        })
        .catch((error) => {
            console.log(error);
        })
    axios.get(`${BASE_URL}/payments`, {
            headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            console.log(response.data);
            let nbPayments = response.data.length;
            let sommes = 0
            for (let i = 0; i < nbPayments; i++) {
                sommes += response.data[i].amount;
            }
            totalAmount.value = sommes;
        })
        .catch((error) => {
            console.log(error);
        })

    axios.get(`${BASE_URL}/game-stats/count`, {
            headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            console.log('data', response.data);
            nbGames.value = response.data;

        })
        .catch((error) => {
            console.log(error);
        })

    
})
</script>

<template>
    <div class="p-8 sm:ml-64 flex flex-wrap justify-around justify-items-center">
        <the-card class="flex-1 basis-1/2 m-6">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{ nbUsers }} utilisateurs</h5>
            <p class="font-normal text-gray-700 dark:text-gray-400">
                Sont inscrits sur le site
            </p>
        </the-card>

        <the-card class="flex-1 basis-1/2 m-6">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{ nbBan }} utilisateurs</h5>
            <p class="font-normal text-gray-700 dark:text-gray-400">
                Sont bannis
            </p>
        </the-card>

        <the-card class="flex-1 basis-1/2 m-6">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{ nbAdmin }} utilisateurs</h5>
            <p class="font-normal text-gray-700 dark:text-gray-400">
                Sont admins
            </p>
        </the-card>

        <the-card class="flex-1 basis-1/2 m-6" >
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{ nbVerified }} utilisateurs</h5>
            <p class="font-normal text-gray-700 dark:text-gray-400">
                Ont verifié leur compte
            </p>
        </the-card>

        <the-card class="flex-1 basis-1/2 m-6">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{ totalAmount }} €</h5>
            <p class="font-normal text-gray-700 dark:text-gray-400">
                Ont été dépensés sur le site
            </p>
        </the-card>

        <the-card class="flex-1 basis-1/2 m-6">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{ nbGames }} parties</h5>
            <p class="font-normal text-gray-700 dark:text-gray-400">
                Ont été jouées
            </p>
        </the-card>
    </div>
</template>
