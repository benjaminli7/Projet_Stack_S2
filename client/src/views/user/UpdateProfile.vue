<script setup>
import axios from 'axios';  
import router from '../../router';
import { reactive } from 'vue';
import { TheCard } from 'flowbite-vue';
let user = localStorage.getItem('user');
user = JSON.parse(user);


const state = reactive({
    firstname: user.firstname,
    lastname: user.lastname,
    password: '',
    passwordVerify: '',
    oldPassword: '',
});
const updateProfile = async () => {
    try {
        await axios.patch('http://localhost:3000/users', {
            username: state.username,
            firstname: state.firstname,
            lastname: state.lastname,
        });
        let userStorage = {
            username: state.username,
            firstname: state.firstname,
            lastname: state.lastname,
            role : user.role,
            status : user.status,
            email : user.email,
        }
        localStorage.setItem('user', JSON.stringify(userStorage));
        router.push('/profile');
    } catch (error) {
        console.log('error', error)
        alert('Erreur lors de la modification');
    }
}

const updatePassword = async () => {
    try {
        if(state.password !== state.passwordVerify) {
            alert('Les mots de passe ne correspondent pas');
            return;
        }
        const token = localStorage.getItem('token');
        await axios.patch('http://localhost:3000/auth/password', {
            oldPassword: state.oldPassword,
            password: state.password,
        },
        {
            headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            },
        });
        router.push('/logout');
    } catch (error) {
        alert('Erreur lors de la modification');
    }
}


</script>

<template>
    <div class="flex justify-around">
        <the-card>
            <form @submit.prevent="updateProfile" class="max-w-xs mx-auto">
                <div class="mb-4">
                    <input type="text" v-model="state.firstname" placeholder="Prénom"  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500" />
                </div>
                <div class="mb-4">
                    <input type="text" v-model="state.lastname" placeholder="Nom de famille" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500" />
                </div>        
                <div>
                    <button type="submit" class="w-full px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600">Modifier</button>
                </div>
            </form>
        </the-card>
        <the-card>
            <form @submit.prevent="updatePassword" class="max-w-xs mx-auto">
            <div class="mb-4">
                <input type="password" v-model="state.oldPassword" placeholder="Ancien mot de passe" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500" required/>
            </div>
            <div class="mb-4">
                <input type="password" v-model="state.password" placeholder="Mot de passe" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500" required/>
            </div>
            <div class="mb-4">
                <input type="password" v-model="state.passwordVerify" placeholder="Mot de passe" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500" required/>
            </div>
            <div>
            <button type="submit" class="w-full px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600">Modifier</button>
            </div>
            </form>
        </the-card>
    </div>
</template>




