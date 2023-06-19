<template>
    <div class="mb-4">
        <p>Username : {{ username }}</p>
        <p>Nom : {{ lastname }}</p>
        <p>Prénom : {{ firstname }}</p>
        <p>Email : {{ email }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';

  export default {
    name: 'Profile',
    data() {
      return {
        username: '',
        firstname: '',
        lastname: '',
        email: '',
      };
    },
    mounted(){
    axios
    .get('http://localhost:3000/user/6485f01df16d0bdcbdb0833f')
    .then((response) => {
    this.username = response.data.username;
    this.firstname = response.data.firstname;
    this.lastname = response.data.lastname;
    this.email = response.data.email;
    })
  }
  };
  </script>
  