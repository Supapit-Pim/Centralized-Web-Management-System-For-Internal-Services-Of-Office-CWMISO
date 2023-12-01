<script setup>
import sweetalert2 from '@/assets/js/controller/switchalert'
import { mapActions, getActivePinia } from 'pinia'
import { useSuperAdminStore, useAdminStore, useUserStore, useCompanyStore, useTokenStore, PiniaRoot } from '@/stores/'
import { useRoute, useRouter } from 'vue-router';
// import User from '@/components/Setting-User.vue'

// แก้ไข แยก components Sidebar เพื่อให้แกไขง่ายขั้น 
import Sidebar_Superadmin from '@/components/Sidebar-Superadmin.vue'
import Sidebar_Admin from '@/components/Sidebar-Admin.vue'
import Sidebar_User from '@/components/Sidebar-User.vue'
</script>

<template>
  <v-card v-if="route.name != 'login'" id="company">
    <v-navigation-drawer app fixed v-model="drawer" :rail="rail" permanent @click="rail = false">

      <v-list-item :prepend-avatar="sidebar.company_logo" nav>
        <p v-if="rail == false" style="font-size:15px">{{ sidebar.company_name }}</p>
        <template v-slot:append>
          <v-btn variant="text" icon="mdi-chevron-left" width="25" @click.stop="rail = !rail"></v-btn>
        </template>
      </v-list-item>
      <div class="Menu">
        <v-list density="compact" nav>

          <!-- แก้ไข  เงือนไขเลือกฝช้เมนู -->
          <Sidebar_Superadmin v-if="menu == 'superadmin'" />
          <Sidebar_Admin v-else-if="menu == 'admin'" />
          <Sidebar_User v-else-if="menu == 'user'" />

          <!-- แก้ไข  เรียกใช้รวม function เดียว -->
          <v-sheet>
            <router-link class="button" to="/">
              <v-list-item prepend-icon="mdi-logout" title="ออกจากระบบ" value="logout" @click="Logout"></v-list-item>
            </router-link>
          </v-sheet>
        </v-list>
      </div>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-title>
        <v-breadcrumbs>
          <v-breadcrumbs v-if="breadcrumbs?.meta" :items="breadcrumbs.meta"></v-breadcrumbs>
        </v-breadcrumbs>
      </v-app-bar-title>
      <v-spacer></v-spacer>

      <router-link class="button" :to="'/' + sidebar.role + '/setting'">
        <v-avatar size="40" color="grey-darken-2" class="rounded-full ma-6">
          <v-img width="40" :aspect-ratio="1" cover :src="sidebar.photo"></v-img>
        </v-avatar>
      </router-link>

    </v-app-bar>
  </v-card>
</template>

<script>
export default {
  setup() {
  },
  data() {
    return {
      sidebar: {
        company_name: null,
        company_logo: null,
        photo: null,
        role: null,
      },
      check_first: false,
      
      route: null,
      router: null,
      token: null,

      superadmin: null,
      typecompany: null,
      company: null,

      breadcrumbs: [],

      drawer: true,
      rail: false,
      totalcompany: [['ผู้ดูแลระบบ', 'mdi-office-building-marker-outline', '/superadmin/company']],
      data_token: null,
      data_checktoken: null,
      data_user: null,
      menu: null,
    }
  },
  watch: {
    useRouter() {
      this.getRouter()
    },
    async $route() {
      await this.getRoute()
    },
  },
  async created() {
    this.getRouter()
    await this.getRoute()
  },
  methods: {
    ...mapActions(useTokenStore, ['DeCode']),
    ...mapActions(useSuperAdminStore, ['Get_SuperAdmin_ID_S']),
    ...mapActions(useAdminStore, ['Get_Admin_ID_A']),
    ...mapActions(useUserStore, ['Get_User_ID_U']),
    ...mapActions(useCompanyStore, ['Get_Company_ID_A', 'Get_Company_ID_U']),
    getRouter() {
      this.router = useRouter()
    },
    async getRoute() {
      this.route = this.$route
      this.breadcrumbs = this.route?.matched[0] ? this.route.matched[0] : null

      const TokenStore = useTokenStore()


      if (this.token != TokenStore.$state.token && this.check_first == true) {
        this.check_first = false
      }
      this.token = TokenStore.$state.token
      let dataToken = await this.DeCode(this.token)

      if (dataToken?.DataUser?.roles == 'superadmin' && this.check_first == false) {
        this.check_first = true
        const SuperAdminStore = useSuperAdminStore()
        const response = await this.Get_SuperAdmin_ID_S(PiniaRoot.token.token, dataToken.DataUser.id)
        if (typeof response == 'string') {
          await sweetalert2.warning(response)
        }
        this.superadmin = await SuperAdminStore.$state.data_id

        this.sidebar.photo = this.superadmin[0].photo
        this.sidebar.company_logo = '/images/unsplash.jpg'
        this.sidebar.company_name = 'ระบบการจัดการเว็บไซต์'
        this.sidebar.role = 'superadmin'
      }
      else if (dataToken?.DataUser?.roles == 'admin' && this.check_first == false) {
        this.check_first = true
        const AdminStore = useAdminStore()
        const response1 = await this.Get_Admin_ID_A(PiniaRoot.token.token, dataToken.DataUser.id)
        if (typeof response1 == 'string') {
          await sweetalert2.warning(response1)
        }
        const CompanyStore = useCompanyStore()
        const response2 = await this.Get_Company_ID_A(PiniaRoot.token.token, dataToken.DataUser.company_id)
        if (typeof response2 == 'string') {
          await sweetalert2.warning(response2)
        }
        this.admin = await AdminStore.$state.data_id
        this.company = await CompanyStore.$state.data_id

        this.sidebar.photo = this.admin[0].photo
        this.sidebar.company_logo = this.company[0].logo
        this.sidebar.company_name = this.company[0].name
        this.sidebar.role = 'admin'
      }
      else if (dataToken?.DataUser?.roles == 'user' && this.check_first == false) {
        this.check_first = true
        const UserStore = useUserStore()
        const response1 = await this.Get_User_ID_U(PiniaRoot.token.token, dataToken.DataUser.id)
        if (typeof response1 == 'string') {
          await sweetalert2.warning(response1)
        }
        const CompanyStore = useCompanyStore()
        const response2 = await this.Get_Company_ID_U(PiniaRoot.token.token, dataToken.DataUser.company_id)
        if (typeof response2 == 'string') {
          await sweetalert2.warning(response2)
        }
        this.user = await UserStore.$state.data_id
        this.company = await CompanyStore.$state.data_id

        this.sidebar.photo = this.user[0].photo
        this.sidebar.company_logo = this.company[0].logo
        this.sidebar.company_name = this.company[0].name
        this.sidebar.role = 'user'
      }
    },
    Logout() {
      getActivePinia()._s.forEach((store) => store.$reset())
      localStorage.removeItem('token')
      localStorage.removeItem('token_superadmin')
      localStorage.removeItem('token_admin')
      localStorage.removeItem('menu')
      this.router.push('/')
    },
    // แกไข เพิ่ม function ยืนยันตัวตน
    async Authen() {
      //เรียกใช้ useTokenStore().CheckDateToken() จาก store token
      const checktoken = this.data_checktoken = await useTokenStore().CheckDateToken()
      //หาก false ให้รีเซต store และไปหน้า login
      if (checktoken == false) {
        getActivePinia()._s.forEach((store) => store.$reset())
        this.router.push('/');
      } else {
        // หาก สิทธิ์ ผู้ใช้ ไม่ตรงกันกับเมนู และกับ path ที่ ยกเว้น
        // แก้ไขปัญหาเบื่องตั้น ยังต้องแก้ไขอยู่
        if (this.menu != this.route.path.split('/')[1] && this.route.path.split('/')[1] != 'all') {
          this.router.push('/' + this.menu + '/dashboard');
        }
      }
    },

    // async DeCodeJWT() {
    // const TokenStore = await useTokenStore()
    // const SuperAdminStore = await useSuperAdminStore()
    // const AdminStore = await useCompanyStore()
    // const response = await TokenStore.DeCodeJWT()
    // this.data_token = response.DataUser
    // const datagetid = await SuperAdminStore.GetID(PiniaRoot.token.token, this.data_token.id)
    // const datagetid = await AdminStore.GetID_Admin(PiniaRoot.token.token, this.data_token)
    // this.data_user = datagetid[0]
    // },

    // async Checkmenu() {
    //   const TokenStore = await useTokenStore()
    //   ;
    //   this.menu = await PiniaRoot.token.menu
    // },
  },
  // แก้ไข หากใช้ ใน create ข้อมูล this.route.name มาไม่ทัน เลย ทำใน beforeMount
  async beforeMount() {
    //กรณีไม่ใช่หน้า Login
    if (this.route.name != 'login') {
      // เรียกใช้ยืนยันตัวตน
      await this.Authen();
      // เรียกใช้ เซ็ตค่า เมนู ใน store
      this.menu = useTokenStore().Getmenu;
    }
  },
  async updated() {
    // เรียกใช้ เซ็ตค่า เมนู ใน store หากมีการ อัพเดท
    this.menu = useTokenStore().Getmenu;
    // localStorage.removeItem('statusUser')
    // localStorage.removeItem('menuuse')
    // 
    // await this.DeCodeJWT()
    // await this.Checkmenu()
    if (this.router.currentRoute.name == 'TotalType') {
      const targetElement = document.querySelector(this.router.currentRoute.hash);
      if (targetElement) {
        const yOffset = -60; // Adjust this value to fine-tune the scroll position
        const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  }
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
