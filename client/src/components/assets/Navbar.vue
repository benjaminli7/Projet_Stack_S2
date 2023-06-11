<template>
    <nav class="flex justify-center space-x-4">
      <router-link to="/" class="font-bold px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-slate-900">Home</router-link>
      <router-link to="/logout" class="font-bold px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-slate-900">Logout</router-link>

    </nav>
  </template>
  
  
  
  <script>
      export default {
          name: 'Navbar'
      }
  </script>
  