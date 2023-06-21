<template>
  <div>
    <p>Vérification en cours...</p>
  </div>
</template>

<script>
import axios from 'axios';

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

    console.log("Token récupéré à partir de la requête : ", token);

    // URL de la requête
    const url = 'http://localhost:3000/auth/verify-email?token=' + token;
    // Requête API
    axios.get(url)
        .then(response => {
          console.log("Réponse de l'API : ", response.data);
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
