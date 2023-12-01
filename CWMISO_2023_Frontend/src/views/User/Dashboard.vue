<script setup>
import sweetalert2 from '@/assets/js/controller/switchalert'
import { mapActions } from 'pinia'
import { useUserStore, useListUploadStore, useListCompanyStore, useStatusCompanyStore, useStatusUploadStore, useTokenStore, PiniaRoot } from '@/stores/'
import { useRouter } from 'vue-router'
import PictureInput from 'vue-picture-input'

import LoadingNumberOfUser from '@/components/Loading-Layout-NumberOfUser.vue'

import loadingCard from '@/components/Loading-Layout-Card-Col3.vue'
import Chart from 'chart.js/auto';
import { pushScopeId } from 'vue'
</script>

<template>
  <div class="p-4 w-full h-full space-y-12">
    <div>
      <h1 class="text-3xl pb-3">แสดงข้อมูลทั่วไป</h1>
      <div v-if="(!list_upload?.loading && !list_company?.loading)" class="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6">
        <div class="stats shadow-lg">
          <div class="stat">
            <div class="stat-figure dark:text-slate-300 text-primary">
              <v-icon icon="mdi mdi-view-list" size="x-large"></v-icon>
            </div>
            <div class="stat-title dark:text-slate-400">รายการทั้งหมด</div>
            <div class="stat-value dark:text-slate-300 text-primary" v-if="list_company_upload">
              {{ list_company_upload?.length }}
            </div>
            <div class="stat-desc dark:text-slate-400">รายการ</div>
          </div>
        </div>
        <div class="stats shadow-lg">
          <div class="stat">
            <div class="stat-figure dark:text-slate-300 text-primary">
              <v-icon icon="mdi mdi-format-list-bulleted-square" size="x-large"></v-icon>
            </div>
            <div class="stat-title dark:text-slate-400">รายการเริ่มต้น</div>
            <div class="stat-value dark:text-slate-300 text-primary" v-if="list_company">
              {{ list_company?.length }}
            </div>
            <div class="stat-desc dark:text-slate-400">รายการ</div>
          </div>
        </div>
        <div class="stats shadow-lg">
          <div class="stat">
            <div class="stat-figure dark:text-slate-300 text-primary">
              <v-icon icon="mdi mdi-format-list-checkbox" size="x-large"></v-icon>
            </div>
            <div class="stat-title dark:text-slate-400">เพิ่มรายการ</div>
            <div class="stat-value dark:text-slate-300 text-primary" v-if="list_upload">
              {{ list_upload?.length }}
            </div>
            <div class="stat-desc dark:text-slate-400">รายการ</div>
          </div>
        </div>
        <div class="stats shadow-lg">
          <div class="stat">
            <div class="stat-figure dark:text-slate-300 text-primary">
              <v-icon icon="mdi mdi-file" size="x-large"></v-icon>
            </div>
            <div class="stat-title dark:text-slate-400">อัปโหลดข้อมูล</div>
            <div class="stat-value dark:text-slate-300 text-primary" v-if="status_upload">
              {{ status_upload?.length }}
            </div>
            <div class="stat-desc dark:text-slate-400">ข้อมูล</div>
          </div>
        </div>
      </div>
      <div v-else-if="(list_upload?.loading || list_company?.loading)">
        <LoadingNumberOfUser />
      </div>
    </div>

    <div class="space-y-3">
      <h1 class="text-3xl pb-3">รายการอัปโหลด</h1>
      <div v-if="(!list_upload?.loading && !list_company?.loading)">
        <v-row cols="12" v-if="list_company_upload?.length" class="d-flex align-center justify-between ma-0">

          <v-col cols="12" lg="4" class="rounded-xl pa-0 ml-lg-8 d-flex flex-wrap align-center justify-center">
            <h1 class="text-lg">จำนวนรายการอัปโหลด {{ list_company_upload?.length }} รายการ</h1>
            <v-divider class="border-opacity-100" />
            <canvas id="myChart">
            </canvas>
          </v-col>

          <v-col cols="12" lg="7" class="pa-0 d-flex flex-wrap align-center justify-end">
            <v-col class="d-flex justify-end">
              <v-btn color="primary">
                <router-link to="/user/listupload">จัดการรายการอัปโหลด</router-link>
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
                      รายการอัปโหลด
                    </th>
                    <th class="text-center">
                      หัวข้อ / ข้อมูล
                    </th>
                    <!-- <th class="text-center">
                      จำนวนผู้ใช้งาน
                    </th> -->
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(data, data_index) in list_company_upload" :key="data_index" class="text-center">
                    <td>{{ data_index + 1 }}</td>
                    <td class="text-left">{{ data.topic }}</td>
                    <td>
                      <p v-if="list_company_upload[data_index].check == true" class="text-teal">ข้อมูล</p>
                      <p v-else class="text-blue">หัวข้อ</p>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-col>
          </v-col>

        </v-row>
      </div>  
      <div v-else-if="(list_upload?.loading || list_company?.loading)">
        <loadingCard />
      </div>
      <h1 v-if="!list_upload?.length && !list_company?.length" class="text-2xl flex justify-center">ไม่มีข้อมูล</h1>
    </div>


  </div>
</template>

<script>
export default {
  setup() { },
  data() {
    return {
      user: null,
      data_token: null,
      list_company: { loading: true },
      list_upload: { loading: true },
      list_company_upload: [],

      status_company: null,
      status_upload: null,
      status_company_upload: [],

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
    await this.UserDataStore()
    await this.ListUploadDataStore()
    await this.ListCompanyDataStore()
    await this.StatusCompanyUploadDataStore()
    await this.Table()
  },
  methods: {
    ...mapActions(useUserStore, ['Get_User_ID_U']),
    ...mapActions(useListUploadStore, ['Get_ListUpload_U']),
    ...mapActions(useListCompanyStore, ['Get_ListCompany_U']),
    ...mapActions(useStatusCompanyStore, ['Get_StatusCompany_U']),
    ...mapActions(useStatusUploadStore, ['Get_StatusUpload_U', 'Get_StatusUpload_ID_U']),
    ...mapActions(useTokenStore, ['DeCode']),
    async UserDataStore() {
      const DataToken = await PiniaRoot.token.deCoded
      if (DataToken != null) {
        this.data_token = DataToken.DataUser
      } else {
        const response = await useTokenStore().DeCode()
        this.data_token = response.DataUser
      }
      const UserStore = useUserStore()
      const response = await this.Get_User_ID_U(PiniaRoot.token.token, this.data_token.id)
      if (typeof response == 'string') {
        await sweetalert2.warning(response)
      }
      this.user = await UserStore.$state.data_id
    },
    async ListUploadDataStore() {
      const ListUploadStore = useListUploadStore()
      const response = await this.Get_ListUpload_U(PiniaRoot.token.token)
      this.list_upload = { loading: true }
      if (typeof response == 'string') {
        await sweetalert2.warning(response)
      }
      const ListUpload = await ListUploadStore.$state.data
      this.list_upload = ListUpload.filter(item => item.user_id === this.user[0].id)
      debugger
    },
    async ListCompanyDataStore() {
      const ListCompanyStore = useListCompanyStore()
      const response = await this.Get_ListCompany_U(PiniaRoot.token.token)
      this.list_company = { loading: true }
      if (typeof response == 'string') {
        await sweetalert2.warning(response)
      } else {
        const ListCompany = await ListCompanyStore.$state.data
        const UserCompanyID = this.user[0].company_id; // The company_id to match
        const UserListCompanyID = this.user[0].list_personnel_id; // The company_id to match
        const DataCompany = ListCompany.filter(item => {
          return item.company_id === UserCompanyID;
        });
        this.list_company = DataCompany.filter(item => {
          return item.list_personnel_id === UserListCompanyID || item.list_personnel_id === null;
        });
        this.list_company_upload = this.list_company_upload.concat(this.list_company, this.list_upload)
      }
    },
    async StatusCompanyUploadDataStore() {
      const StatusCompanyStore = useStatusCompanyStore()
      const StatusUploadStore = useStatusUploadStore()
      const responseCompany = await StatusCompanyStore.Get_StatusCompany_U(PiniaRoot.token.token)
      const responseUpload = await StatusUploadStore.Get_StatusUpload_U(PiniaRoot.token.token)
      this.status_upload = { loading: true }
      const StatusCompany = await StatusCompanyStore.$state.data
      const StatusUpload = await StatusUploadStore.$state.data
      typeof responseCompany && responseUpload == 'string'
      ? await sweetalert2.warning(response)
      : this.status_company_upload = this.status_company_upload.concat(StatusCompany, StatusUpload)
      debugger
      this.status_upload = StatusUpload.filter(item => {
        return item.list_personnel_id === this.user[0].list_personnel_id && item.user_id === this.user[0].id
      })
    },
    async Table() {
      this.dataChart.datasets[0].data = [this.list_company?.length, this.list_upload?.length]
      this.dataChart.labels = ['เริ่มต้น', 'เพิ่ม']
      // ตั้งค่าเริ่มต้นสำหรับ `check` เป็น `false`
      this.list_company_upload.forEach(data => { data.check = false; });
      // ตรวจสอบและอัปเดต `check` ตาม `this.status_company_upload`
      this.status_company_upload.forEach(statusData => {
        this.list_company_upload.forEach(data => {
          if (statusData.list_company_id === data.id || statusData.list_upload_id === data.id) {
            data.check = true;
          }
        });
      });
      
      await this.myChart()
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