<script setup>
import { useTokenStore } from '@/stores/'
useTokenStore().SetupToken_Super
</script>
<template >
  <v-sheet>


    <router-link class="button" to="/admin/dashboard">
      <v-list-item prepend-icon="mdi-view-dashboard" title="แดชบอร์ด" value="CompanyDashboard"></v-list-item>
    </router-link>

    <router-link class="button" to="/admin/listpersonnel">
      <v-list-item prepend-icon="mdi-account-details" title="รายการบุคลากร" value="listpersonnel"></v-list-item>
    </router-link>
    
      <router-link class="button" to="/admin/listcompany">
        <v-list-item prepend-icon="mdi-newspaper-variant-outline" title="รายการในสำนักงาน"
          value="listcompany"></v-list-item>
      </router-link>
      
    <!-- <v-list-group>
      <template v-slot:activator="{ props }">
        <v-list-item v-bind="props" prepend-icon="mdi-format-list-bulleted-square" title="รายการให้บริการ"></v-list-item>
      </template>

      <router-link class="button" to="/admin/listservice">
        <v-list-item prepend-icon="mdi-file-document-edit-outline" title="รายการให้บริการ"
          value="listservice"></v-list-item>
      </router-link>

      <router-link class="button" to="/admin/createform">
        <v-list-item prepend-icon="mdi-file-document-edit-outline" title="สร้างแบบฟอร์ม" value="createform"></v-list-item>
      </router-link>
    </v-list-group> -->


    <router-link class="button" to="/admin/setting">
      <v-list-item prepend-icon="mdi-cogs" title="การตั้งค่า" value="setting"></v-list-item>
    </router-link>

    <router-link class="button" :to="'/superadmin/dashboard'" v-if="useTokenStore().GetToken_Super != 'null'">
      <v-list-item prepend-icon=" mdi-account-cog" title="กลับหน้า ผู้พัฒนาระบบ" value="Company"
        @click="Back"></v-list-item>
    </router-link>
  </v-sheet>
</template>

<script>
export default {

  methods: {
    // แก้ไข สลับตำแหน่ง จาก Admin ไป Superadmin
    async Back() {
      localStorage.setItem('token', useTokenStore().GetToken_Super)
      localStorage.setItem('token_superadmin', null)
      localStorage.setItem('menu', 'superadmin')
      useTokenStore().CheckDateToken()
    },
  },



}
</script>

