<script setup>

import axios from 'axios';
import { reactive } from 'vue';
import router from '../../router';

const state = reactive({
    password: '',
});

const setpwd = async () => {
    try {
        const token = localStorage.getItem('token');
        const usr = JSON.parse(localStorage.getItem('user'));
        await axios.post('http://localhost:3000/auth/setGooglepwd', {
            user: usr,
            password: state.password,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        router.push('/');
    } catch (error) {
        alert('Erreur lors de la creation du mot de passe');
    }
}
</script>
<template>
    <div>
        <h1 class="text-3xl font-semibold text-center text-red-500">Création du mot de passe</h1>
        <p>
            Votre compte a été créé avec succès, veuillez créer un mot de passe pour vous connecter sans Google.
            Cliquez sur continuer si vous souhaitez vous connecter qu'avec Google (Vous pourrez reinitialiser votre mot de passe plus tard)
        </p>
        <form @submit.prevent="setpwd" class="max-w-xs mx-auto">
            <div class="mb-4">
                <input type="password" v-model="state.password" placeholder="Mot de passe" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500" required/>
            </div>
            <div>
                <button type="submit" class="w-full px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600">S'inscrire</button>
            </div>
            <div class="mt-4">
                <router-link to="/" class="text-sm text-red-500 hover:text-red-600">Continuer sans créer de mot de passe</router-link>
            </div>
        </form>
    </div>
</template>

