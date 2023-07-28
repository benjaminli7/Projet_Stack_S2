<script setup>
import { Table, TableHead, TableBody, TableHeadCell, TableRow, TableCell } from 'flowbite-vue'
import { onMounted, ref } from 'vue';
import axios from 'axios';
import router from '../../router';
const BASE_URL = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem('token');
const payments = ref([]);
onMounted(() => {
    axios.get(`${BASE_URL}/payments`, {
            headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            payments.value = response.data;
        })
        .catch((error) => {
            console.log(error);
        })
})

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
                <table-head-cell>Prix</table-head-cell>
                <table-head-cell>Date</table-head-cell>
            </table-head>
            <table-body>
                <table-row v-for="(payment, index) in payments" :key="index">
                    <table-cell>{{ payment.user.username }}</table-cell>
                    <table-cell>{{ payment.amount }}</table-cell>
                    <table-cell class="text-left">{{ formatDate(new Date(payment.createdAt)) }}</table-cell>
                </table-row>
            </table-body>
        </Table>
    </div>
</template>