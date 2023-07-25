<template>
  <div>
    <h2>Devenez Premium</h2>
    <button @click="handleCheckout('premiumPackage', 'Premium Package', 10)">Acheter Premium pour 10$</button>
  </div>
</template>

<script>/*
import { ref, onMounted } from 'vue';
import { loadStripe } from '@stripe/stripe-js';
export default {
  setup() {
    let stripe, card;

    onMounted(async () => {
      const stripePublicKey = ('pk_test');
      console.log("Stripe Key:", stripePublicKey);

      if (!stripePublicKey || typeof stripePublicKey !== 'string') {
        console.error('Invalid Stripe public key');
        return;
      }

      stripe = await loadStripe(stripePublicKey);
      const elements = stripe.elements();

      card = elements.create('card');
      card.mount('#card-element');
    });

    const checkout = async () => {
      // Create the payment intent on the server
      const response = await fetch('http://127.0.0.1:3000/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: '',
          itemId: '',
          itemName: '',
          amount: ''
        })
      });

      const { clientSecret } = await response.json();
      console.log("Client secret:", clientSecret);
      // Confirm the payment intent on the client
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card
        }
      });

      if (result.error) {
        console.error("An error occurred:", result.error);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          console.log("Payment successful!");
        }
      }
    };

    return {
      checkout
    };
  }
};*/
import json from "qs";

/*<template>
  <!-- ... autres éléments ... -->
  <div id="card-element">
    <!-- L'élément où Stripe.js injectera l'UI du formulaire de carte -->
  </div>
  <button @click="checkout">Payer</button>
</template>

<script>
import { ref, onMounted } from 'vue';
import { loadStripe } from '@stripe/stripe-js';
export default {
  setup() {
    let stripe, card;

    onMounted(async () => {
      // We use import.meta.env here
      const stripePublicKey = import.meta.env.VUE_APP_STRIPE_PUBLIC_KEY;
      console.log("Stripe Key:", stripePublicKey);

      if (!stripePublicKey || typeof stripePublicKey !== 'string') {
        console.error('Invalid Stripe public key');
        return;
      }

      stripe = await loadStripe(stripePublicKey);
      const elements = stripe.elements();

      card = elements.create('card');
      card.mount('#card-element');
    });

    const checkout = async () => {
      // Création de l'intention de paiement côté serveur
      const response = await fetch('http://127.0.0.1:3000/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: 'YOUR_USER_ID', // assurez-vous de récupérer l'ID utilisateur actuel
          itemId: 'ITEM_ID',
          itemName: 'ITEM_NAME',
          amount: 'AMOUNT'
        })
      });

      const { clientSecret } = await response.json();

      // Confirmation de l'intention de paiement côté client
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card
        }
      });

      if (result.error) {
        console.error("Une erreur est survenue:", result.error);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          console.log("Paiement réussi !");
        }
      }
    };

    return {
      checkout
    };
  }
};
*/

import axios from "axios";


export default {
  name: 'Premium',
  data() {
    const user = JSON.parse(localStorage.getItem('user'));
    return {
      stripe: null,
      userId: user ? user.id : null
    };
  },


  mounted() {
    this.stripe = window.Stripe('pk_test_51NWhaQBS812DNqMjMpIqeLQEP5wSNeht3MpufatBZCAX4aLD0RfSnteFshIEoBXzmhTTasJ9JVK2mERRkhRE0K0r00D1p0P7lP');
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
    }
  }
};
</script>

<style scoped>
</style>
