<script setup>
    import router from '../../router';
let user = localStorage.getItem('user');
user = JSON.parse(user);
console.log(user.lastname);

// const updateUser = async () => {
//     try {
//         await axios.patch('http://localhost:3000/user/1', {
//             nom: user.nom,
//             prenom: user.prenom,
//             email: user.email,
//         });
//         router.push('/login');
//     } catch (error) {
//         alert(error.response.data.error || 'Erreur lors de la modification');
//     }
// }


</script>


<template>
    <div>
        <div class="tabs">
        <!-- <button
            v-for="(tab, index) in tabs"
            :key="index"
            :class="{ active: activeTab === tab }"
            @click="activeTab = tab"
        >
            {{ tab }}
        </button> -->
        </div>
        <!-- <div v-if="activeTab === 'Informations'" class="tab-content"> -->
        <h2>Informations</h2>
        <p>Pseudo : {{ user.username }}</p>
        <p>Nom: {{ user.lastname }}</p>
        <p>Prénom: {{ user.firstname }}</p>
        <button>
            <router-link to="/update-profile" class="text-sm text-red-500 hover:text-red-600">>Modifier mon profil</router-link>
        </button>
        <!-- </div> -->
        <!-- <div v-else-if="activeTab === 'Statistiques'" class="tab-content"> -->
        <h2>Statistiques</h2>
        <!-- Ajoutez ici le contenu pour les statistiques -->
        <!-- </div> -->
        <!-- <div v-else-if="activeTab === 'Achievements'" class="tab-content"> -->
        <h2>Achievements</h2>
        <!-- Ajoutez ici le contenu pour les achievements -->
        <!-- </div> -->
    </div>
  </template>




