<template>
  <div>
    <h2>Devenez Premium</h2>
    <button @click="handleCheckout('premiumPackage', 'Premium Package', 10)" :disabled="isPurchased">Acheter Premium pour 10$</button>
    <p v-if="isPurchased">Vous avez déjà acheté ce package Premium.</p>
    <p v-if="this.$route.query.status === 'cancel'">Le paiement a été annulé.</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'Premium',
  data() {
    const user = JSON.parse(localStorage.getItem('user'));
    return {
      stripe: {},
      userId: user ? user.id : null,
      isPurchased: false,
    };
  },

  mounted() {
    this.stripe = window.Stripe('pk_test_51NWhaQBS812DNqMjMpIqeLQEP5wSNeht3MpufatBZCAX4aLD0RfSnteFshIEoBXzmhTTasJ9JVK2mERRkhRE0K0r00D1p0P7lP');
  },

  async created() {
    if (this.userId) {
      try {
        this.isPurchased = await this.checkIfItemPurchased(this.userId);
      } catch (error) {
        console.error("Une erreur est survenue lors de la vérification des achats.", error);
      }
    }
  },

  methods: {
    async handleCheckout(itemId, itemName, amount) {
      try {
        const { data } = await axios.post("http://127.0.0.1:3000/stripe/checkout", {
          userId: this.userId.toString(),
          itemId: itemId,
          itemName: itemName,
          amount: amount
        });
        this.stripe.redirectToCheckout({
          sessionId: data.sessionId
        }).then(function (result) {
          if (result.error) {
            console.error(result.error.message);
          }
        });
      } catch (error) {
        console.error("Une erreur est survenue lors de la création de l'intention de paiement.", error);
      }
    },

    async checkIfItemPurchased(userId) {
      try {
        const { data } = await axios.get(`http://127.0.0.1:3000/stripe/check-purchase/${userId}`);
        return data.purchased;
      } catch (error) {
        console.error("Une erreur est survenue lors de la vérification des achats.", error);
        return false;
      }
    },
  }
};
</script>

<style scoped>
</style>
