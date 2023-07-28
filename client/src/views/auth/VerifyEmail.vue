<template>
  <div class="container mx-auto mt-[50px]">
    <p>Vérification en cours...</p>
  </div>
</template>

<script>
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default {
  name: 'VerifyEmail',
  mounted() {
    // Récupérez le token à partir de l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    // Si aucun token n'est trouvé, redirigez vers la page de login
    if (!token) {
      console.error("Aucun token n'a été trouvé dans l'URL");
      this.$router.push('/login');
      return;
    }


    // URL de la requête
    const url = `${BASE_URL}/auth/verify-email/` + token;
    // Requête API
    axios.get(url)
        .then(response => {
          this.$router.push('/login');
        })
        .catch(error => {
          console.error("Erreur lors de la vérification de l'email : ", error);
          alert('Erreur lors de la vérification de l\'email');
          this.$router.push('/login');
        });
  }
};
</script>
