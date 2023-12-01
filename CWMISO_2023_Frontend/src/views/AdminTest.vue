<script setup>
import sweetalert2 from '@/assets/js/controller/switchalert'
import { computed } from 'vue'
import { mapActions } from 'pinia'
import { useDisplay } from 'vuetify'
import { useAdminStore, PiniaRoot } from '@/stores/'

const { name } = useDisplay()

</script>
<template>
  <div class="justify-start align-top w-full h-full space-y-5">
    <div class="ma-5 space-y-5">
      <h1 class="text-h3">AdminTestID</h1>
      <v-card class="d-flex w-full " :elevation="12" rounded="lg">
        <v-col class="d-flex pa-5 " v-if="data_store != null">
          <v-col class="d-flex align-center space-x-5 ">
            <v-avatar size="120" color="grey-darken-2" class="rounded-full">
              <v-img v-if="data_store.photo != null" width="300" :aspect-ratio="1" cover :src="data_store.photo"></v-img>
              <font-awesome-icon v-else icon="image" class="w-auto h-12 text-white" />
            </v-avatar>
            <v-sheet>
              <p class="text-xl">{{ data_store.name }}</p>
              <p class="text-base">{{ data_token.roles }}</p>
            </v-sheet>
            <!-- <v-list-item :title="data_store.name"
              :subtitle="data_token.roles"
              :prepend-avatar="data_store.photo"></v-list-item> -->
          </v-col>
          <v-divider class="border-opacity-100" vertical />
          <!-- <v-col cols="4" class="text-xl space-y-3" v-if="data_token.company_id || data_token.company_id"> -->
          <v-col cols="4" class="text-xl space-y-3">
            <v-sheet>สำนักงาน<p class="text-base">{{ data_token.company_id }}</p></v-sheet>
            <v-sheet>กอง<p class="text-base">{{ data_token.list_personnel_id }}</p></v-sheet>
          </v-col>

          <v-divider class="border-opacity-100" vertical />
          <v-col cols="4" class="text-xl space-y-3" >
            <v-sheet>วันที่สร้าง<p class="text-base">{{ data_store.create_time }}</p></v-sheet>
            <v-sheet>วันที่อัปเดต<p class="text-base">{{ data_store.update_time }}</p></v-sheet>
          </v-col>

        </v-col>
      </v-card>

      <v-row class="flex-nowrap ">
        <v-card class="ma-2 w-75" :elevation="12" rounded="lg">
          <!-- NOTE Tabs Button All in Dialog detail or update-->
          <v-sheet class="pa-5">
            <v-tabs v-model="tab" color="deep-purple-accent-4">
              <v-tab value="one">Token</v-tab>
              <v-tab value="two">Store</v-tab>
              <v-tab value="three">Item Three</v-tab>
            </v-tabs>
  
            <v-card-text>
              <v-window v-model="tab">
                <v-window-item value="one" class="overflow-visible">
                {{data_token}}
                </v-window-item>
  
                <v-window-item value="two" class="overflow-visible">
                  {{data_store}}
                </v-window-item>
  
                <v-window-item value="three">
                  Three
                </v-window-item>
              </v-window>
            </v-card-text>
          </v-sheet>
        </v-card>
  
        <v-card class="ma-2 w-25 d-flex justify-center " :elevation="12" rounded="lg">
          text
        </v-card>
      </v-row>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AdminTest',
  data() {
    return {
      data_store: null,
      data_token: null,
      tab: null,
    }
  },
  async created() {
      await this.SettingAdminGetID()
  },
  watch: {
  },
  methods: {
    ...mapActions(useAdminStore, ['GetID', 'Update', 'Add', 'Delete']),
    async SettingAdminGetID() {
      const DataToken = await PiniaRoot.token.deCode_second
      
      this.data_token = DataToken.DataUser
      const AdminStore = await useAdminStore()

      const response = AdminStore.$state.data_id == null
      ? await this.GetID(PiniaRoot.token.token, this.data_token.id)
      : await AdminStore.$state.data_id
      
      
      typeof response[0] == 'string'
        ? await sweetalert2.warning(response)
        : this.data_store = response[0];
    },
  }
}
</script>