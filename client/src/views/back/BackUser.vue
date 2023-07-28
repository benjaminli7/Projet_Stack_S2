<script setup>
import { Table, TableHead, TableBody, TableHeadCell, TableRow, TableCell } from 'flowbite-vue'
import { onMounted, ref } from 'vue';
import { useUserStore } from '../../userStore';
const userStore = useUserStore();
import axios from 'axios';
import router from '../../router';
const BASE_URL = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem('token');
const users = ref([]);
onMounted(() => {
    axios.get(`${BASE_URL}/users`, {
            headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            users.value = response.data;
        })
        .catch((error) => {
        })
})

    async function deleteUser(id){
        try {
            await axios.delete(`${BASE_URL}/users/${id}`, 
            {
                headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                },
            });	
            router.push('/back/users');
        } catch (error) {
            alert('Erreur lors de la modification');
        }
    }


    async function changeRole(id, role){
        let newRole = role == 'user' ? 'admin' : 'user';
        try {
            await axios.patch(`${BASE_URL}/users/role/${id}`, {
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
                alert('Erreur lors de la modification');
            }
    }

    async function unban(id){
        try {
            userStore.unbanUser(id).then((value) => {
                users.value = users.value.map((user) => {
                    if(user.id == id){
                        user.status = 0;
                    }
                    return user;
                })
            }).catch((error) => {
                alert('Erreur lors de la modification');
            })
        } catch (error) {
            alert('Erreur lors de la modification');
        }
    }
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // Format attendu : AAAA-MM-JJ HH:MM:SS
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedDate;
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
                <table-head-cell>Status</table-head-cell>
                <table-head-cell>Date d'inscription</table-head-cell>
                <table-head-cell><span class="sr-only">Delete</span></table-head-cell>
                <table-head-cell><span class="sr-only">Admin</span></table-head-cell>
                <table-head-cell><span class="sr-only">Unban</span></table-head-cell>
            </table-head>
            <table-body>
                <table-row v-for="(user, index) in users" :key="index" :class="{ 'text-red': user.status == 1 }">
                    <table-cell>{{ user.username }}</table-cell>
                    <table-cell>{{ user.lastname }}</table-cell>
                    <table-cell>{{ user.firstname }}</table-cell>
                    <table-cell>{{ user.email }}</table-cell>
                    <table-cell>{{ user.roles}}</table-cell>
                    <table-cell>{{ user.status == 0 ? "Active" : "Banned" }}</table-cell>
                    <table-cell>{{ formatDate(new Date(user.createdAt)) }}</table-cell>
                    <table-cell>
                    <a @click="deleteUser(user.id)" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Supprimer</a>
                    </table-cell>
                    <table-cell>
                        <a @click="changeRole(user.id, user.roles)" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">{{ user.roles == 'user'? 'Devenir admin': 'Devenir user' }}</a>
                    </table-cell>
                    <table-cell>
                        <a v-if="user.status == 1" @click="unban(user.id)" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Unban</a>
                    </table-cell>
                </table-row>
            </table-body>
        </Table>
    </div>
</template>

<style scoped >

.text-red {
    /* background-color important! red; */
	color: red !important;
}

</style>