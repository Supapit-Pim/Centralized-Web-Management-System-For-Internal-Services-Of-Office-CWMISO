<script setup>
import sweetalert2 from '@/assets/js/controller/switchalert'
import { mapActions } from 'pinia'
import { useSuperAdminStore, useAdminStore, useUserStore, useCompanyStore, useTypeCompanyStore, useTokenStore, PiniaRoot } from '@/stores/'
import PictureInput from 'vue-picture-input'
import useHandlePage from '@/utils/handlePage'
import useHandleDatetime from '@/utils/handleDatetime'

import LoadingNumberOfUser from '@/components/Loading-Layout-NumberOfUser.vue'
import LoadingList from '@/components/Loading-Layout-List.vue'

import loadingCard from '@/components/Loading-Layout-Card-Col3.vue'
import Chart from 'chart.js/auto';
</script>

<template>
  <div class="p-4 w-full h-full space-y-12">
    <div>
      <h1 class="text-3xl pb-3">แสดงข้อมูลผู้ใช้งาน</h1>
      <div v-if="(!count_all?.loading)" class="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6">
        <div class="stats shadow-lg">
          <div class="stat">
            <div class="stat-figure dark:text-slate-300 text-primary">
              <v-icon icon="mdi-account-cog-outline" size="x-large"></v-icon>
            </div>
            <div class="stat-title dark:text-slate-400">ผู้พัฒนาระบบ</div>
            <div class="stat-value dark:text-slate-300 text-primary" v-if="count_all">
              {{ superadmin?.length }}
            </div>
            <div class="stat-desc dark:text-slate-400">คน</div>
          </div>
        </div>
        <div class="stats shadow-lg">
          <div class="stat">
            <div class="stat-figure dark:text-slate-300 text-primary">
              <v-icon icon="mdi-account-edit-outline" size="x-large"></v-icon>
            </div>
            <div class="stat-title dark:text-slate-400">ผู้ดูแลระบบ</div>
            <div class="stat-value dark:text-slate-300 text-primary">
              {{ admin?.length }}
            </div>
            <div class="stat-desc dark:text-slate-400">คน</div>
          </div>
        </div>
        <div class="stats shadow-lg">
          <div class="stat">
            <div class="stat-figure dark:text-slate-300 text-primary">
              <v-icon icon="mdi-account-outline" size="x-large"></v-icon>
            </div>
            <div class="stat-title dark:text-slate-400">ผู้ใช้งาน</div>
            <div class="stat-value dark:text-slate-300 text-primary">
              {{ user?.length }}
            </div>
            <div class="stat-desc dark:text-slate-400">คน</div>
          </div>
        </div>
        <div class="stats shadow-lg">
          <div class="stat">
            <div class="stat-figure dark:text-slate-300 text-primary">
              <v-icon icon="mdi-account-group-outline" size="x-large"></v-icon>
            </div>
            <div class="stat-title dark:text-slate-400">รวมทั้งหมด</div>
            <div class="stat-value dark:text-slate-300 text-primary">{{ count_all }}</div>
            <div class="stat-desc dark:text-slate-400">คน</div>
          </div>
        </div>
      </div>
      <div v-if="(count_all?.loading)">
        <LoadingNumberOfUser />
      </div>
    </div>

    <div class="space-y-3">
      <h1 class="text-3xl pb-3">สำนักงานทั้งหมด</h1>
      <v-row cols="12" v-if="company?.length" class="d-flex align-center justify-between ma-0">

        <v-col cols="12" lg="4" class="rounded-xl pa-0 ml-lg-8 d-flex flex-wrap align-center justify-center">
          <h1 class="text-lg">สำนักงานทั้งหมด {{ companydata?.length }} สำนักงาน</h1>
          <v-divider class="border-opacity-100" />
          <canvas id="myChart">
          </canvas>
        </v-col>

        <v-col cols="12" lg="7" class="pa-0 space-y-3 d-flex flex-wrap align-center justify-end">
          <v-btn color="primary">
            <router-link to="/superadmin/company">จัดการสำนักงานทั้งหมด</router-link>
          </v-btn>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <v-card v-for="(data, data_index) in displayed" :key="data_index" class="rounded-xl pa-2 w-auto" width="450"
              elevation="3">
              <div no-gutters class="">
                <v-col col="12" class="d-flex flex-wrap items-center justify-center pa-0" color="transparent">
                  <v-col class="d-flex justify-center">
                    <v-avatar size="120" color="grey-darken-2" class="rounded-full">
                      <v-img v-if="data.logo != null" width="300" :aspect-ratio="1" cover :src="data.logo"></v-img>
                      <font-awesome-icon v-else icon="image" class="w-auto h-12 text-white" />
                    </v-avatar>
                  </v-col>

                  <v-col cols="12" lg="7" class="pa-0 ">
                    <div class="text-lg sm:text-xl grid space-y-1 ma-0">
                      <p> {{ data.name }} </p>
                      <p> {{ data.name_eng }} </p>
                      <p> {{ data.number }} </p>
                    </div>
                  </v-col>
                </v-col>

              </div>
            </v-card>
          </div>
        </v-col>

        <v-col cols="12">
          <v-pagination v-if="searchData == ''" class="page" v-model="currentPage" :length="totalPages"></v-pagination>
        </v-col>
      </v-row>
    </div>
    <div v-if="(company?.loading)">
      <loadingCard />
    </div>
    <h1 v-if="!company?.length" class="text-2xl flex justify-center">ไม่มีข้อมูล</h1>
  </div>
</template>
<script>
import { onMounted } from 'vue'
export default {
  name: '',
  setup() {
  },
  data() {
    return {
      superadmin: null,
      admin: null,
      user: null,
      count_all: { loading: true },

      companydata: null,
      company: { loading: true },
      typecompany: null,
      numberTypeCompany: null,

      list: [1],
      itemsPerPage: 6,
      currentPage: 1,

      searchData: '',

      dataChart: {
        datasets: [{
          labels: [],
          label: 'จำนวน',
          data: [],
          backgroundColor: [
            'rgb(54, 162, 235)',
            'rgb(167 139 250)',
            'rgb(251 191 36)',
            'rgb(52 211 153)',
            'rgb(255, 99, 132)',
          ],
          hoverOffset: 4
        }],
      },
    }
  },
  computed: {
    PictureInput,
    totalPages() {
      return this.list != '' ? useHandlePage.total_pages(this.list?.length, this.itemsPerPage) : ''
    },
    filtered() {
      return this.list.filter((item) => {
        const lowerCaseQuery = this.searchData.toLowerCase()
        return (
          item.name.toLowerCase().match(lowerCaseQuery) ||
          item.name_eng.toLowerCase().match(lowerCaseQuery)
        )
      });
    },
    displayed() {
      if (this.currentPage > this.totalPages) this.currentPage = this.totalPages
      const response = this.list != '' && this.currentPage != ''
        ? useHandlePage.getdata_pages(this.currentPage, this.itemsPerPage, this.list)
        : ''

      return this.searchData != ''
        ? this.filtered
        : this.list.slice(response[0], response[1])
    },
  },
  async created() {
    //แก้ไข ใช้ path ของ superadmin
    await this.SuperAdminDataStore()
    await this.AdminDataStore()
    await this.UserDataStore()
    await this.CountAll()
    this.CompanyDataStore()
    // await this.localStorage()

    this.isLoading = true
  },
  async mounted() {
  },
  methods: {
    ...mapActions(useTokenStore, ['TokenGetIDadmin']),
    ...mapActions(useSuperAdminStore, ['Get_SuperAdmin_S']),
    ...mapActions(useAdminStore, ['Get_Admin_S']),
    ...mapActions(useUserStore, ['Get_User_S']),
    ...mapActions(useCompanyStore, ['Get_Company_S']),
    ...mapActions(useTypeCompanyStore, ['Get_TypeCompany_S']),

    // // แก้ไข เพิ่ม ฟังชั้น สลับ ผู้ใช้ จาก Superadmin ไป Admin
    // async SelectCompany(id) {

    //   //เรียกข้อมูล token admin
    //   let tokenswitching = await useTokenStore().TokenGetIDadmin(id)
    //   // set localStorage
    //   localStorage.setItem("token", tokenswitching);
    //   localStorage.setItem("token_superadmin", useTokenStore().token);
    //   localStorage.setItem("menu", 'admin');
    //   // เรียกใช้ Action store CheckDateToken เพื่อยืนยันตัวตนใหม่อีกรอบ
    //   useTokenStore().CheckDateToken();
    //   // นำทางไป หน้า Dashboard Admin
    //   this.$router.push('/admin/dashboard');

    // },

    // NOTE - company store
    async SuperAdminDataStore() {
      const SuperAdminStore = useSuperAdminStore()
      this.superadmin = { loading: true }
      const response = await this.Get_SuperAdmin_S(PiniaRoot.token.token)
      if (typeof response == 'string') {
        await sweetalert2.warning(response)
      }
      this.superadmin = await SuperAdminStore.$state.data
    },
    async AdminDataStore() {
      const AdminStore = useAdminStore()
      this.admin = { loading: true }
      const response = await this.Get_Admin_S(PiniaRoot.token.token)
      if (typeof response == 'string') {
        await sweetalert2.warning(response)
      }
      this.admin = await AdminStore.$state.data
    },
    async UserDataStore() {
      const UserStore = useUserStore()
      this.user = { loading: true }
      const response = await this.Get_User_S(PiniaRoot.token.token)
      if (typeof response == 'string') {
        await sweetalert2.warning(response)
      }
      this.user = await UserStore.$state.data
    },
    async CountAll() {
      this.count_all = this.superadmin?.length + this.admin?.length + this.user?.length
    },
    async CompanyDataStore() {
      const CompanyStore = useCompanyStore()
      const TypeCompanyStore = useTypeCompanyStore()

      this.company = { loading: true }
      const response1 = await this.Get_Company_S(PiniaRoot.token.token)
      if (typeof response1 == 'string') {
        await sweetalert2.warning(response1)
      }
      //NOTE - การเรียก type company และ Check data จาก Store
      this.type_social = { loading: true }
      const response2 = await this.Get_TypeCompany_S(PiniaRoot.token.token)
      if (typeof response2 == 'string') {
        await sweetalert2.warning(response2)
      }
      this.companydata = await CompanyStore.$state.data
      this.typecompany = await TypeCompanyStore.Typecompany
      this.company = await this.AddTypeCompany(this.companydata)
      this.list = this.company

      const typeIds = this.typecompany.map(typeItem => typeItem.id);
      const names = this.typecompany.map(typeItem => typeItem.name);

      const number = await typeIds.map(typeId => this.companydata.filter(item => item.type_company_id === typeId)?.length);
      this.dataChart.datasets[0].data = number
      this.dataChart.labels = names

      await this.myChart()
    },
    async AddTypeCompany(data) {
      //NOTE - การเพิ่ม type company ลงไปใน data
      const MapA = []
      this.typecompany.map(item => { MapA[item.id] = item.name });
      return data != null
        ? data.map(item => ({
          // คัดลอกคีย์อื่น ๆ ในอ็อบเจ็กต์เดิม
          ...item,
          // เพิ่มคีย์ 'name'
          name: `${MapA[item.type_company_id]} ${item.name}`
        }))
        : null;

    },

    async myChart() {
      const A = this.dataChart
      const ctx = document.getElementById('myChart');
      const myChart = new Chart(ctx, {
        type: 'doughnut',
        data: A,
      });
      myChart

    },
  },
}
</script>
