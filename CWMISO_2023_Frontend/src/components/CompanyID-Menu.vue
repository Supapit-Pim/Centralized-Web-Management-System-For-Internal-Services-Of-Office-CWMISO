<script setup>
import { mapActions, getActivePinia } from 'pinia'
import { useTokenStore } from '@/stores/'
import { useRouter } from 'vue-router'
</script>

<!-- <template>
  <v-card v-if="this.route.name != 'login'" id="company">
    <v-navigation-drawer app fixed v-model="drawer" :rail="rail" permanent @click="rail = false">
      <div class="Menu">
        <v-list density="compact" nav>

          <router-link class="button" to="/superadmin/admin">
            <v-list-item prepend-icon=" mdi-account-edit" title="Admin" value="admin"></v-list-item>
          </router-link>

          <router-link class="button" to="/superadmin/user">
            <v-list-item prepend-icon="mdi-account-multiple" title="User" value="user"></v-list-item>
          </router-link>

          <router-link class="button" to="/superadmin/company">
            <v-list-item prepend-icon="mdi-domain" title="สำนักงานทั้งหมด" value="companyall"></v-list-item>
          </router-link>

          <router-link class="button" to="/superadmin/dataform">
            <v-list-item prepend-icon="mdi-folder-edit" title="ข้อมูลแบบฟอร์ม" value="dataform"></v-list-item>
          </router-link>

          <router-link class="button" to="/superadmin/datapersonnel">
            <v-list-item prepend-icon="mdi-account-search" title="ข้อมูลบุคลากร" value="datapersonnel"></v-list-item>
          </router-link>

          <router-link class="button" to="/superadmin/statussocial">
            <v-list-item prepend-icon="mdi-earth-plus" title="สถานะโซเชียล" value="statussocial"></v-list-item>
          </router-link>

          <router-link class="button" to="/superadmin/statusupload">
            <v-list-item prepend-icon=" mdi-folder-arrow-up" title="สถานะอัปโหลด" value="statusupload"></v-list-item>
          </router-link>

          <router-link class="button" to="/superadmin/statuscompany">
            <v-list-item prepend-icon="mdi-office-building-cog" title="สถานะในสำนักงาน"
              value="statuscompany"></v-list-item>
          </router-link>

          <router-link class="button" to="/superadmin/listcompany">
            <v-list-item prepend-icon="mdi-format-list-bulleted-square" title="รายการในสำนักงาน"
              value="listcompany"></v-list-item>
          </router-link>

          <router-link class="button" to="/superadmin/listservice">
            <v-list-item prepend-icon="mdi-tooltip-text" title="รายการใหบริการ" value="listservice"></v-list-item>
          </router-link>

          <router-link class="button" to="/superadmin/listupload">
            <v-list-item prepend-icon="mdi-upload-multiple" title="รายการอัปโหลด" value="listupload"></v-list-item>
          </router-link>

          <router-link class="button" to="/superadmin/listpersonnel">
            <v-list-item prepend-icon="mdi-account-details" title="รายการบุุคลากร" value="listpersonnel"></v-list-item>
          </router-link>

          <router-link class="button" to="/superadmin/createform">
            <v-list-item prepend-icon="mdi-file-document-edit" title="สร้างแบบฟอร์ม" value="createform"></v-list-item>
          </router-link>

          <router-link class="button" to="/">
            <v-list-item prepend-icon="mdi-logout" title="Logout" value="logout"></v-list-item>
          </router-link>

        </v-list>
      </div>
    </v-navigation-drawer>
    <v-app-bar title="Website management System">
    </v-app-bar>
  </v-card>
</template> -->

<script>
export default {
  data() {
    return {
      route: null,

      drawer: true,
      rail: false,
      totaltype: [
        ['ประเภทสำนักงาน', 'mdi-office-building-marker-outline', 'company'],
        ['ประเภทโซเชีียล', 'mdi-search-web', 'social'],
        ['ประเภทแบบฟอร์ม', 'mdi-file-edit-outline', 'form'],
        ['ประเภทไฟล์', 'mdi-folder-multiple-outline', 'all']
      ]
    }
  },
  watch: {
    $route() {
      this.getRoute()
    }
  },
  created() {
    this.getRoute()
    if (this.route.name != 'login') {
      useTokenStore().SetToken
      // useTokenStore().Remember
      this.CheckDateToken()
    }
  },
  methods: {
    ...mapActions(useTokenStore, ['CheckDateToken'])
    ,
    getRoute() {
      this.route = this.$route
    },
    Logout() {
      getActivePinia()._s.forEach(store => store.$reset());
      this.$router.push('/')
    }

  },
  updated() {

    if (this.route.name == 'TotalType' || this.route.name == 'TypeCompany' || this.route.name == 'TypeSocial' || this.route.name == 'TypeForm' || this.route.name == 'TypeAll') {
      const route = useRouter()
      route.currentRoute.value.hash
      const targetElement = document.querySelector(route.currentRoute.value.hash);
      if (targetElement) {
        const yOffset = -60; // Adjust this value to fine-tune the scroll position
        const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  },
}
</script>

<style>
.v-app-bar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  /* กำหนดค่า Z-index ให้สูงกว่าเนื้อหาหลัก */
}
</style>
