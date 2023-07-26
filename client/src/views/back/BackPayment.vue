<script setup>
import { Table, TableHead, TableBody, TableHeadCell, TableRow, TableCell } from 'flowbite-vue'
import { onMounted, ref } from 'vue';
import axios from 'axios';
import router from '../../router';

const token = localStorage.getItem('token');
const payments = ref([]);
onMounted(() => {
    axios.get('http://localhost:3000/payments', {
            headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            console.log(response.data);
            payments.value = response.data;
        })
        .catch((error) => {
            console.log(error);
        })
})


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
                    <table-cell>{{ new Date(payment.createdAt) }}</table-cell>
                </table-row>
            </table-body>
        </Table>
    </div>
</template>