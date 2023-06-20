<script setup>
    import { Avatar } from 'flowbite-vue'
    import { useUserStore } from '../../userStore'

    const userStore = useUserStore();
    const user = userStore.$state.user;

    console.log(user);

</script>
<template>
    <div class="bg-white rounded-lg shadow-lg p-4 w-1/6 relative">  
        <button class="text-gray-500 hover:text-red-500 absolute top-0 right-0 mr-4 mt-2">
            <img src="/delete_user.svg" alt="delete user" class="w-6 h-6"> 
        </button>
        
        <div class="flex justify-center items-center mb-4">
            <Avatar rounded size="lg" class="mr-4">JD</Avatar> 
        </div>
        
        <div class="text-center">
            <h1 class="text-lg font-bold">John Doe</h1> 
        </div>
    </div>
</template>
