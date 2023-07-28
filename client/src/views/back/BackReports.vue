
  <script setup>
  import { useUserStore } from '../../userStore'
  import { Table, TableHead, TableBody, TableHeadCell, TableRow, TableCell } from 'flowbite-vue'
  import { onMounted, ref } from "vue";
  
  const userStore = useUserStore();
  const user = userStore.getUser;
  const list = ref([]);
  
  onMounted(async () => {
    list.value = await userStore.getReportList();
    // sort by status (not treated first)
    list.value.sort((a, b) => {
        if (a.status < b.status) {
            return -1;
        }
        if (a.status > b.status) {
            return 1;
        }
        return 0;
    })
  })

  const bannirUser = async (username, reportId) => {
    await userStore.banUser(username).then((value) => {
        userStore.archiverReport(reportId).then((value) => {
            const index = list.value.findIndex((item) => item.id === reportId);
            list.value[index].status = 'treated';
        }).catch((error) => {
            alert('Erreur lors de l\'archivage');
        })


    }).catch((error) => {
        alert('Erreur lors du bannissement');
    })
    
  };
  
  const archiverReport = async (reportId) => {
    await userStore.archiverReport(reportId).then((value) => {
        
        const index = list.value.findIndex((item) => item.id === reportId);
        list.value[index].status = 'treated';

    }).catch((error) => {
        alert('Erreur lors de l\'archivage');
    })
  };
  </script>
  
  <template>
    <div class="p-8 sm:ml-64">
        <h1 class="text-3xl font-semibold text-center">Le Tribunal</h1>
      <Table>
        <TableHead>
          <TableHeadCell>User</TableHeadCell>
          <TableHeadCell>Accusé</TableHeadCell>
          <TableHeadCell>Raison</TableHeadCell>
          <TableHeadCell class="text-center" colspan="2">Action</TableHeadCell>
        </TableHead>
        <TableBody>
          <TableRow v-for="item in list" :key="item.id" class="font-color-black" :class="{ 'bg-red italic': item.status == 'treated' }">
            <TableCell>{{ item.reporter.username }}</TableCell>
            <TableCell>{{ item.reportedPlayer.username }}</TableCell>
            <TableCell>{{ item.reason }}</TableCell>
            <TableCell :class="{ 'text-right': item.status == 'treated' }">
              <button
                v-if="item.status != 'treated'"
                @click="bannirUser(item.reportedPlayer.username, item.id)"
                class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
              >
                Bannir
              </button>
              <!-- Text archivé si traité -->
                <span  v-else>Archivé</span>
            </TableCell>
            <TableCell>
        
              <button
                v-if="item.status != 'treated'"
                @click="archiverReport(item.id)"
                class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              >
                Archiver
              </button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </template>

  <style scoped>
.bg-red {
    /* background-color important! red; */
	background-color:#C0C0C0 !important;
}
.font-color-black {
    color: #000000 !important;
}

</style>