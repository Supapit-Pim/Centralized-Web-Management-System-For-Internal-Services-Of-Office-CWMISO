
<script setup>
import { useTokenStore } from '@/stores/'
useTokenStore().SetupToken_Admin
</script>
<template>
  <v-sheet>

    <router-link class="button" to="/user/dashboard">
      <v-list-item prepend-icon="mdi-view-dashboard" title="แดชบอร์ด" value="dashboard"></v-list-item>
    </router-link>

    <router-link class="button" to="/user/listupload">
      <v-list-item prepend-icon="mdi-upload-multiple" title="รายการอัปโหลด" value="listupload"></v-list-item>
    </router-link>

    <router-link class="button" to="/user/setting">
      <v-list-item prepend-icon="mdi-cogs" title="การตั้งค่า" value="setting"></v-list-item>
    </router-link>

    <router-link class="button" :to="'/admin/dashboard'" v-if="useTokenStore().GetToken_Admin != 'null'">
      <v-list-item prepend-icon=" mdi-account-cog" title="กลับหน้า ผู้ดูแลระบบ" value="admin"
        @click="Back"></v-list-item>
    </router-link>

    <!-- <router-link class="button" :to="'/admin/dashboard'" v-if="useTokenStore().GetToken_Admin != 'null'">
      <v-list-item prepend-icon=" mdi-account-edit" title="Back Admin" value="Dashboard" @click="Back"></v-list-item>
    </router-link> -->
  </v-sheet>
</template>
<script>
export default {

  methods: {
    // แก้ไข สลับตำแหน่ง จาก User ไป Admin
    async Back() {
      localStorage.setItem('token', useTokenStore().GetToken_Admin)
      localStorage.setItem('token_admin', null)
      localStorage.setItem('menu', 'admin')
      useTokenStore().CheckDateToken()
    },
  },



}
</script>