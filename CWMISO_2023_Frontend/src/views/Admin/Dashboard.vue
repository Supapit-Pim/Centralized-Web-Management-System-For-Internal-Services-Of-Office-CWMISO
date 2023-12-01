<script setup>
import sweetalert2 from '@/assets/js/controller/switchalert'
import { mapActions } from 'pinia'
import { useUserStore, useListPersonnelStore, useListCompanyStore, useDataPersonnelStore, useTokenStore, PiniaRoot } from '@/stores/'
import { useRouter } from 'vue-router'
import PictureInput from 'vue-picture-input'
import useHandlePage from '@/utils/handlePage'

import LoadingNumberOfUser from '@/components/Loading-Layout-NumberOfUser.vue'
import LoadingList from '@/components/Loading-Layout-List.vue'

import loadingCard from '@/components/Loading-Layout-Card-Col3.vue'
import Chart from 'chart.js/auto';
</script>

<template>
  <div class="p-4 w-full h-full space-y-12">
    <div>
      <h1 class="text-3xl pb-3">แสดงข้อมูลทั่วไป</h1>
      <div v-if="(!list_personnel?.loading && !data_personnel?.loading && !user?.loading && !list_company?.loading)"
        class="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6">
        <div class="stats shadow-lg">
          <div class="stat">
            <div class="stat-figure dark:text-slate-300 text-primary">
              <v-icon icon="mdi-account-details-outline" size="x-large"></v-icon>
            </div>
            <div class="stat-title dark:text-slate-400">รายการบุคลากร</div>
            <div class="stat-value dark:text-slate-300 text-primary" v-if="list_personnel">
              {{ list_personnel?.length }}
            </div>
            <div class="stat-desc dark:text-slate-400">รายการ</div>
          </div>
        </div>
        <div class="stats shadow-lg">
          <div class="stat">
            <div class="stat-figure dark:text-slate-300 text-primary">
              <v-icon icon="mdi-account-search-outline" size="x-large"></v-icon>
            </div>
            <div class="stat-title dark:text-slate-400">บุคลากร</div>
            <div class="stat-value dark:text-slate-300 text-primary" v-if="data_personnel">
              {{ data_personnel?.length }}
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
            <div class="stat-value dark:text-slate-300 text-primary" v-if="user">
              {{ user?.length }}
            </div>
            <div class="stat-desc dark:text-slate-400">คน</div>
          </div>
        </div>
        <div class="stats shadow-lg">
          <div class="stat">
            <div class="stat-figure dark:text-slate-300 text-primary">
              <v-icon icon="mdi-newspaper-variant-outline" size="x-large"></v-icon>
            </div>
            <div class="stat-title dark:text-slate-400">รายการสำนักงาน</div>
            <div class="stat-value dark:text-slate-300 text-primary" v-if="list_company">
              {{ list_company?.length }}
            </div>
            <div class="stat-desc dark:text-slate-400">รายการ</div>
          </div>
        </div>
      </div>
      <div v-else-if="(list_personnel?.loading || data_personnel?.loading || user?.loading || list_company?.loading)">
        <LoadingNumberOfUser />
      </div>
    </div>

    <div class="space-y-3">
      <h1 class="text-3xl pb-3">รายการบุคลากร</h1>
      <div v-if="(!list_personnel?.loading && !data_personnel?.loading && !user?.loading)">
        <v-row cols="12" v-if="list_personnel?.length" class="d-flex align-center justify-between ma-0">

          <v-col cols="12" lg="4" class="rounded-xl pa-0 ml-lg-8 d-flex flex-wrap align-center justify-center">
            <h1 class="text-lg">จำนวนบุคลากรในแต่ละรายการบุคลากรทั้ง {{ list_personnel?.length }} รายการ</h1>
            <v-divider class="border-opacity-100" />
            <canvas  id="myChart"></canvas>
          </v-col>
          <v-col cols="12" lg="7" class="pa-0 d-flex flex-wrap align-center justify-end">
            <v-col class="d-flex justify-end">
              <v-btn color="primary">
                <router-link to="/admin/listpersonnel">จัดการรายการบุคลากร</router-link>
              </v-btn>
            </v-col>

            <v-col cols="12">

              <v-table fixed-header height="470px" class="rounded-xl shadow-lg">
                <thead>
                  <tr>
                    <th class="text-center">
                      ลำดับ
                    </th>
                    <th class="text-left">
                      รายการบุคลากร
                    </th>
                    <th class="text-center">
                      จำนวนบุคลากร
                    </th>
                    <th class="text-center">
                      จำนวนผู้ใช้งาน
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(data, data_index) in list_personnel" :key="data_index" class="text-center">
                    <td>{{ data_index + 1 }}</td>
                    <td class="text-left">{{ data.topic }}</td>
                    <td>{{ dataChart.datasets[0].data[data_index] }}</td>
                    <td>{{ user_ID[data_index] }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-col>
          </v-col>

          <!-- <v-col cols="12">
          <v-pagination v-if="searchData == ''" class="page" v-model="currentPage" :length="totalPages"></v-pagination>
        </v-col> -->
        </v-row>
      </div>
      <div v-else-if="(list_personnel?.loading || data_personnel?.loading || user?.loading)">
        <loadingCard />
      </div>
      <h1 v-if="!list_personnel?.length && !data_personnel?.length && !user?.length" class="text-2xl flex justify-center">ไม่มีข้อมูล</h1>
    </div>
  </div>
</template>

<script>
export default {
  setup() { },
  data() {
    return {
      user: null,
      list_personnel: null,
      data_personnel: null,
      list_company: null,

      router: useRouter(),

      list_personneldata: null,
      numberLypePompany: null,
      user_ID: { loading: true },

      list: [],
      // itemsPerPage: 10,
      // currentPage: 1,

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
            'rgb(255,223,186)',
            'rgb(255,179,186)'
          ],
          hoverOffset: 4
        }],
      },
    }
  },
  computed: {
    PictureInput,
  },
  async created() {
    await this.ListPersonnelDataStore()
    await this.DataPersonnelDataStore()
    await this.UserDataStore()
    await this.ListCompanyDataStore()
    await this.Table()
  },
  methods: {
    ...mapActions(useUserStore, ['Get_User_A']),
    ...mapActions(useListPersonnelStore, ['Get_ListPersonnel_A']),
    ...mapActions(useListCompanyStore, ['Get_ListCompany_A']),
    ...mapActions(useDataPersonnelStore, ['Get_DataPersonnel_A']),
    async UserDataStore() {
      const UserStore = useUserStore()
      this.user = { loading: true }
      const response = await this.Get_User_A(PiniaRoot.token.token)
      if (typeof response == 'string') {
        await sweetalert2.warning(response)
      }
      this.user = await UserStore.$state.data
    },
    async ListPersonnelDataStore() {
      const ListPersonnelStore = useListPersonnelStore()
      this.list_personnel = { loading: true }
      const response = await this.Get_ListPersonnel_A(PiniaRoot.token.token)
      if (typeof response == 'string') {
        await sweetalert2.warning(response)
      }
      this.list_personnel = await ListPersonnelStore.$state.data
    },
    async DataPersonnelDataStore() {
      const DataPersonnelStore = useDataPersonnelStore()
      this.data_personnel = { loading: true }
      const response = await this.Get_DataPersonnel_A(PiniaRoot.token.token)
      if (typeof response == 'string') {
        await sweetalert2.warning(response)
      }
      this.data_personnel = await DataPersonnelStore.$state.data
    },
    async ListCompanyDataStore() {
      const ListCompanyStore = useListCompanyStore()
      this.list_company = { loading: true }
      const response = await this.Get_ListCompany_A(PiniaRoot.token.token)
      if (typeof response == 'string') {
        await sweetalert2.warning(response)
      }
      this.list_company = await ListCompanyStore.$state.data
    },
    async Table() {
      const list_ids = this.list_personnel.map(item => item.id)
      const names = this.list_personnel.map(item => item.topic);

      const number = await list_ids.map(list_id => this.data_personnel.filter(item => item.list_personnel_id == list_id)?.length);
      this.dataChart.datasets[0].data = number
      this.dataChart.labels = names

      await this.myChart()

      const user = await list_ids.map(list_id => this.user.filter(item => item.list_personnel_id == list_id)?.length);
      this.user_ID = user
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
  }
}
</script>
