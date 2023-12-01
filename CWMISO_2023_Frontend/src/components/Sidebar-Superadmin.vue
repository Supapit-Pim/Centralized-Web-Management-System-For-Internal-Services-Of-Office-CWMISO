

<template >
    <v-sheet>
      <!-- <v-sheet > -->
      <router-link class="button " to="/superadmin/dashboard"  
      @click="navigateTo('/superadmin/dashboard')">
        <v-list-item prepend-icon="mdi-view-dashboard" title="แดชบอร์ด" value="dashboard"></v-list-item >
      </router-link>

      <v-list-group value="totaltype">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-animation" title="ประเภททั้งหมด"></v-list-item>
        </template>

        <router-link class="button" :to="'/superadmin/totaltype/#' + id" v-for="([title, icon, id], i) in totaltype"
          :key="i">
          <v-list-item :title="title" :prepend-icon="icon" :value="title"></v-list-item>
        </router-link>
      </v-list-group>

      <router-link class="button" to="/superadmin/company">
        <v-list-item prepend-icon="mdi-domain" title="สำนักงานทั้งหมด" value="companyall"></v-list-item>
      </router-link>

      <router-link class="button" to="/superadmin/superadmin">
        <v-list-item prepend-icon="mdi-account-cog" title="ผู้พัฒนาระบบ" value="superadmin"></v-list-item>
      </router-link>

      <router-link class="button" to="/superadmin/setting">
        <v-list-item prepend-icon="mdi-cogs" title="การตั้งค่า" value="setting"></v-list-item>
      </router-link>
    </v-sheet>
</template>

<script>
export default {
  data() {
    return {
      totaltype: [
        ['ประเภทสำนักงาน', 'mdi-office-building-marker-outline', 'company'],
        ['ประเภทโซเชียล', 'mdi-search-web', 'social'],
        // ['ประเภทแบบฟอร์ม', 'mdi-file-edit-outline', 'form'],
        ['ประเภทไฟล์', 'mdi-folder-multiple-outline', 'all']
      ],
    }
  },
  methods: {
    navigateTo(route) {
        // ปรับแต่งตามวิธีการ navigate ไปยังหน้าต่าง ๆ
        // console.log('Navigate to:', route);
      }
  }
}
</script>

<style>
.red_list .v-list-item .v-list-item--active{
  background-color: red;
  color: white;
}
</style>