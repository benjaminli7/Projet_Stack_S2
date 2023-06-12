 <template>   
    <div class="relative">
        <div class="friend-bar w-16 h-10 bg-blue-500 text-white flex items-center justify-center">
            <span class="font-bold">Friend</span>
        </div>
        <div class="friend-details bg-blue-500 text-white w-40 h-10 absolute right-0 top-0 transform translate-x-full transition-transform duration-300 ease-in-out">
            
        </div>
    </div>
</template>

<script>
import { getCurrentUser } from '../../auth.js';

// Inside your component
export default {
    name: 'Friends',
    created() {
        const currentUser = getCurrentUser();
        console.log(currentUser);
    }
};


</script>
