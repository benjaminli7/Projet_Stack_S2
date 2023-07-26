<script setup>
import { Table, TableHead, TableBody, TableHeadCell, TableRow, TableCell } from 'flowbite-vue'
import { onMounted, ref } from 'vue';
import axios from 'axios';
import router from '../../router';

const token = localStorage.getItem('token');
const users = ref([]);
onMounted(() => {
    axios.get('http://localhost:3000/users', {
            headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            console.log(response.data);
            users.value = response.data;
        })
        .catch((error) => {
            console.log(error);
        })
})

    async function deleteUser(id){
        try {
            await axios.delete(`http://localhost:3000/users/${id}`, 
            {
                headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                },
            });	
            router.push('/back/users');
        } catch (error) {
            console.log('error', error)
            alert('Erreur lors de la modification');
        }
    }


async function changeRole(id, role){
    let newRole = role == 'user' ? 'admin' : 'user';
    try {
        await axios.patch(`http://localhost:3000/users/role/${id}`, {
            roles: newRole,
        },
        {
            headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            },
        });	
        router.push('/back/users');
        } catch (error) {
            console.log('error', error)
            alert('Erreur lors de la modification');
        }
}

</script>

<template>
    <div class="p-8 sm:ml-64">
        <Table>
            <table-head>
                <table-head-cell>Pseudo</table-head-cell>
                <table-head-cell>Nom</table-head-cell>
                <table-head-cell>Prénom</table-head-cell>
                <table-head-cell>Mail</table-head-cell>
                <table-head-cell>Role</table-head-cell>
                <table-head-cell>Date d'inscription</table-head-cell>
                <table-head-cell><span class="sr-only">Edit</span></table-head-cell>
            </table-head>
            <table-body>
                <table-row v-for="(user, index) in users" :key="index">
                    <table-cell>{{ user.username }}</table-cell>
                    <table-cell>{{ user.lastname }}</table-cell>
                    <table-cell>{{ user.firstname }}</table-cell>
                    <table-cell>{{ user.email }}</table-cell>
                    <table-cell>{{ user.roles }}</table-cell>
                    <table-cell>{{ new Date(user.createdAt) }}</table-cell>
                    <table-cell>
                    <a @click="deleteUser(user.id)" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Supprimer</a>
                    </table-cell>
                    <table-cell>
                        <a @click="changeRole(user.id, user.roles)" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">{{ user.roles == 'user'? 'Devenir admin': 'Devenir user' }}</a>
                    </table-cell>
                </table-row>
            </table-body>
        </Table>
    </div>
</template>