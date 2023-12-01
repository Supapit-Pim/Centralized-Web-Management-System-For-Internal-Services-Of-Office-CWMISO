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