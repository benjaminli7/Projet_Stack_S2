<template>
  <div class="container mx-auto p-4">
    <h2 class="text-xl font-semibold mb-4">Devenez Premium</h2>
    <div class="flex justify-center">
      <div class="border p-4 rounded shadow-md">
        <h3 class="text-lg font-medium mb-2">Premium Package</h3>
        <p class="mb-4">Obtenez des avantages Premium pour seulement 10$.</p>
        <button
            @click="handleCheckout('premiumPackage', 'Premium Package', 10)"
            :disabled="!isAuthenticated || isPurchased"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed">
          Acheter Premium pour 10$
        </button>
      </div>
    </div>
    <p v-if="!isAuthenticated" class="mt-4 text-red-500">Veuillez vous connecter pour acheter le package Premium.</p>
    <p v-if="isPurchased" class="mt-4">Vous avez déjà acheté ce package Premium.</p>
    <p v-if="$route.query.status === 'cancel'" class="mt-4 text-red-500">Le paiement a été annulé.</p>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from 'vue';

const user = JSON.parse(localStorage.getItem('user'));
const stripe = ref({});
const userId = ref(user ? user.id : null);
const isPurchased = ref(false);
const isAuthenticated = ref(false);

const handleCheckout = async (itemId, itemName, amount) => {
  try {
    const { data } = await axios.post("http://127.0.0.1:3000/stripe/checkout", {
      userId: userId.value.toString(),
      itemId: itemId,
      itemName: itemName,
      amount: amount
    });
    stripe.value.redirectToCheckout({
      sessionId: data.sessionId
    }).then(result => {
      if (result.error) {
        console.error(result.error.message);
      }
    });
  } catch (error) {
    console.error("Une erreur est survenue lors de la création de l'intention de paiement.", error);
  }
};

const checkAuthentication = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    isAuthenticated.value = false;
    return;
  }

  try {
    const headers = {
      Authorization: `Bearer ${token}`
    };
    await axios.get(`http://127.0.0.1:3000/stripe/check-auth`, { headers });
    isAuthenticated.value = true;
  } catch (error) {
    isAuthenticated.value = false;
  }
};

const checkIfItemPurchased = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`
    };

    const { data } = await axios.get(`http://127.0.0.1:3000/stripe/check-purchase/${userId}`, { headers });
    return data.purchased;
  } catch (error) {
    console.error("Une erreur est survenue lors de la vérification des achats.", error);
    return false;
  }
};

onMounted(async () => {
  await checkAuthentication();

  stripe.value = window.Stripe('pk_test_51NWhaQBS812DNqMjMpIqeLQEP5wSNeht3MpufatBZCAX4aLD0RfSnteFshIEoBXzmhTTasJ9JVK2mERRkhRE0K0r00D1p0P7lP');
  if (userId.value) {
    try {
      isPurchased.value = await checkIfItemPurchased(userId.value);
    } catch (error) {
      console.error("Une erreur est survenue lors de la vérification des achats.", error);
    }
  }
});
</script>

<style scoped>
</style>
