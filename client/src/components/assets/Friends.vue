<script setup>
    import { Avatar } from 'flowbite-vue'
    import { useUserStore } from '../../userStore'

    const store = useUserStore();


    console.log(store.getUser)

</script>
<template>
    <div class="relative w-1/6 p-4 bg-white rounded-lg shadow-lg">
        <button class="absolute top-0 right-0 mt-2 mr-4 text-gray-500 hover:text-red-500">
            <img src="/delete_user.svg" alt="delete user" class="w-6 h-6">
        </button>


        <div class="flex items-center justify-center mb-4">
            <Avatar rounded size="lg" class="mr-4">JD</Avatar>
        </div>

        <div class="text-center">
            <h1 class="text-lg font-bold">John Doe</h1>
        </div>
    </div>
</template>
