<template>
  <div>
    <p>Vérification en cour</p>
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

    // Faites la requête GET à votre API
    axios.get(`http://127.0.0.1:5173/verify-email?token=${token}`)
        .then(response => {
          this.$router.push('/login');
        })
        .catch(error => {
          console.log(error);
          alert('Erreur lors de la vérification de l\'email');
        });
  }
};
</script>
