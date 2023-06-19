 <template>   
<div class="flex">
  <div class="flex-1">
    <!-- Main content -->
  </div>
  <div class="w-1/4 bg-gray-200">
    <!-- Right sidebar content -->
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
