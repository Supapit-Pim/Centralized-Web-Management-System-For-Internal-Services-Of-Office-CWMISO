<script setup>
import sweetalert2 from '@/assets/js/controller/switchalert'
import { computed } from 'vue'
import { mapActions } from 'pinia'
import { useDisplay } from 'vuetify'
import PictureInput from 'vue-picture-input'
import { useSuperAdminStore, useCompanyStore, PiniaRoot } from '@/stores/'
import useHandlePage from '@/utils/handlePage'
import useHandleDatetime from '@/utils/handleDatetime'
import useHandlePhoto from '@/utils/handlePhoto'

import Title from '@/utils/Title'
// import LayoutList from '@/components/List.vue'
import LayoutListDelete from '@/components/Layout-List-Delete.vue'
import LayoutCardDelete from '@/components/Layout-Card-Delete.vue'

const { name } = useDisplay()

</script>
<template v-slot:activator="{ props }">
  <div class="p-5 space-y-5 w-full h-full" id="user">
    <h1 class="text-3xl">BackUp User Superadmin</h1>

    <div class="flex justify-between">
      <v-card class="rounded-pill" elevation="1" width="50%">
        <v-text-field v-model="searchData" density="compact" variant="solo" label="Search your Name"
          append-inner-icon="mdi-magnify" single-line hide-details>
        </v-text-field>
      </v-card>
    </div>

    <div v-if="data_delete != null">
      <!-- <div v-if="key == 'superadmin'"> -->
        <LayoutListDelete :layout="displayed" v-on:restore="Restore" v-on:deletebackup="DeleteBackup" />
      <!-- </div> -->
      <!-- <div v-if="key == 'company'">
        <LayoutCardDelete :layout="displayed" v-on:showDialog="onShowDialog" v-on:getid="UserGetID" />
      </div> -->
      <v-pagination v-if="searchData == ''" class="page" v-model="currentPage" :length="totalPages"></v-pagination>
    </div>
    <div v-else>
      <h1 class="text-center">Don't Have Any Data</h1>
    </div>
  </div>
</template>
<script>
import { useRoute } from 'vue-router'
export default {
  name: 'SuperadminBackup',
  setup() { },
  data() {
    return {
      superadmin_delete: null,
      company_delete: null,
      key: null,
      data_delete: null,

      list: [1],
      itemsPerPage: 7,
      currentPage: 1,

      searchData: '',

      showDialog: false,

      layout: {
        id: null,
        data: {
          name: null,
          name_eng: null,
        },
        image: {
          photo: null,
        },
        title: {
          id: Title().id,
          name: Title().name,
          username: Title().username,
          photo: Title().photo,
        },
      },
    }
  },
  computed: {
    PictureInput,
    totalPages() {
      return this.list != '' ? useHandlePage.total_pages(this.list?.length, this.itemsPerPage) : ''
      // return Math.ceil(this.list?.length / this.itemsPerPage); // 31/10
    },
    filtered() {
      return this.list.filter((item) => {
        const lowerCaseQuery = this.searchData.toLowerCase()
        return (
          item.name.toLowerCase().match(lowerCaseQuery) ||
          item.username.toLowerCase().match(lowerCaseQuery)
        )
      });
    },

    displayed() {
      const response = this.list != '' && this.currentPage != ''
        ? useHandlePage.getdata_pages(this.currentPage, this.itemsPerPage, this.list)
        : ''

      const data = this.searchData != ''
        ? this.filtered
        : this.list.slice(response[0], response[1])

      this.layout.id = data.map((data) => data.id)
      this.layout.data = data.map(({ name, name_eng }) => ({ name, name_eng }));
      this.layout.data = data.map(({ name, username }) => ({ name, username }));
      this.layout.image.photo = data.map((data) => data.photo)
      return this.layout
    }
  },
  async created() {
    this.ChackRouter()
    
  },
  methods: {
    ...mapActions(useSuperAdminStore, ['GetDelete', 'UnDelete', 'DeleteBackup']),
    ...mapActions(useCompanyStore, ['GetDelete', 'Delete']),
    async ChackRouter() {
      const route = useRoute()
      let DataStore = ''
      // let Keydata = ''
      if (route.params.name == "superadmin") {
        DataStore = await useSuperAdminStore()
        this.key = "superadmin"
      } else if (route.params.name == "company") {
        DataStore = await useCompanyStore()
        this.key = "company"
      }
      DataStore != ''
        ? this.GetDataDelete(DataStore)
        : "No Data Store Delete"
      

    },
    async GetDataDelete(DataStore) {
      
      if (DataStore.delete != null) {
        this.data_delete = DataStore.delete
      } else {
        const response = await DataStore.GetDelete(PiniaRoot.token.token)
        typeof response == 'string'
          ? await sweetalert2.warning(response)
          : this.data_delete = await DataStore.delete;
      }
      this.list = this.data_delete
      
    },
    async Restore(id) {
      sweetalert2.Delete('กู้คืนข้อมูล ?', '', id, async (res) => {
        if (res[0].isConfirmed == true) {
          const SuperAdminStore = await useSuperAdminStore()
          const DataStore = await SuperAdminStore.$state.delete.filter((data) => data.id != id)
          SuperAdminStore.$state.delete = DataStore
          this.list = DataStore
          const response = await SuperAdminStore.UnDelete(PiniaRoot.token.token, id)
          
          typeof response == 'string'
          ? await sweetalert2.warning(response)
          : await sweetalert2.success('สำเร็จ')
        }
      })
    },
    async DeleteBackup(id) {
      sweetalert2.Delete('ลบข้อมูลถาวร ?', '', id, async (res) => {
        if (res[0].isConfirmed == true) {
          const SuperAdminStore = await useSuperAdminStore()
          const DataStore = await SuperAdminStore.$state.delete.filter((data) => data.id != id)
          SuperAdminStore.$state.delete = DataStore
          this.list = DataStore
          const response = await SuperAdminStore.DeleteBackup(PiniaRoot.token.token, id)
          
          typeof response == 'string'
          ? await sweetalert2.warning(response)
          : await sweetalert2.success('สำเร็จ')
        }
      })
    },
  },
  watch: {}
}
</script>