<script setup>
import { mapActions } from 'pinia'
import { useStatusCompanyStore, PiniaRoot } from '@/stores/'
import sweetalert2 from '@/assets/js/controller/switchalert'
import PictureInput from 'vue-picture-input'
import useHandlePage from '@/utils/handlePage'
</script>

<template>
    <div class="p-5 space-y-5 w-full h-full">
        <h1 class="text-3xl">สถานะในสำนักงาน</h1>
        <!-- Button Search -->
    <div class="flex justify-between">
      <v-card class="rounded-pill" elevation="1" width="50%">
        <v-text-field
          v-model="searchData"
          density="compact"
          variant="solo"
          label="Search your Name"
          append-inner-icon="mdi-magnify"
          single-line
          hide-details
        >
        </v-text-field>
      </v-card>
      <!-- Button Add -->
      <v-btn color="deep-purple" @click="dialogAdd = true" v-bind="props">
        <v-icon start>mdi mdi-plus</v-icon>Add New</v-btn>
    </div>
    <v-row no-gutters >
            <v-col v-for="(data, index) in status_company" :key="index" :id="'data_' + data.id" cols="12" md="6">
                <v-card class="pa-2 mb-4 mr-4 rounded-xl " elevation="0"  >
                    <v-row>
                        <v-col cols="2" class="d-flex align-center justify-center">
                            <v-avatar color="deep-purple-accent-4">
                                <v-icon icon="mdi-chart-box-outline"></v-icon>
                            </v-avatar>
                        </v-col>
                        <v-col cols="5">
                            <v-container >
                            <v-span class="text-xs text-sm-caption text-md-body-2"> รายการในสำนักงาน : {{ data.list_company_id }}</v-span><br>
                            <v-span class="text-xs text-sm-caption text-md-body-2"> วันที่สร้าง : {{ data.create_time }} </v-span>
                        </v-container>
                        </v-col>
                        <!-- Button Detail and Delete -->
                        <v-col cols="5" class="text-center">
                          <v-container class="pa-2">
                            <v-btn class="rounded-lg" color="primary" @click="StatusCompanyGetID(data.id), (dialog = true)">
                              <v-icon start icon="mdi-text-box-edit-outline"></v-icon> รายละเอียด
                            </v-btn>
                            <v-btn class="rounded-lg ma-4" @click=" StatusCompanyDelete(data.id)" color="red">
                              <v-icon start icon="mdi-delete-outline"></v-icon> ลบ
                            </v-btn>
                          </v-container>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
            <!-- Dialog Detail -->
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent width="1024">
        <v-card>
          <v-toolbar
            color="primary"
            class="text-h5"
            :title="tab == 'one' ? 'รายละเอียดข้อมูล' : 'แก้ไขข้อมูล'"
          >
            <v-btn icon dark @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <!-- Tabs Button All in Dialog-->
          <v-sheet>
            <v-tabs v-model="tab">
              <v-tab value="one" color="deep-purple-accent-4"
                ><v-icon start>mdi-text-box-search-outline</v-icon>รายละเอียดข้อมูล</v-tab>
              <v-tab value="two" color="deep-purple-accent-4"
                ><v-icon start>mdi-border-color</v-icon>แก้ไขข้อมูล</v-tab>
              <v-tab value="" color="deep-purple-accent-4"
                ><v-icon start> mdi-delete</v-icon>ลบ</v-tab>
            </v-tabs>
          </v-sheet>

          <v-container>
            <v-card-text>
              <v-window v-model="tab">
                <!-- Tabs Detail in Dialog-->
                <v-window-item value="one">
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <div class="text-h7 mb-1">รหัส</div>
                      <v-text-field>
                        <p>{{ data_id.id }}</p>
                      </v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="4">
                      <div class="text-h7 mb-1">ประเภททั้งหมด</div>
                      <v-text-field>
                        <p>{{ data_id.type_all_id }}</p>
                      </v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="4">
                      <div class="text-h7 mb-1">รายการในสำนักงาน</div>
                      <v-text-field>
                        <p>{{ data_id.list_company_id }}</p>
                      </v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6">
                      <div class="text-h7 mb-1">วันที่สร้าง</div>
                      <v-text-field>
                        <p>{{ data_id.create_time }}</p>
                      </v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6">
                      <div class="text-h7 mb-1">วันที่อัปเดต</div>
                      <v-text-field>
                        <p>{{ data_id.update_time }}</p>
                      </v-text-field>
                    </v-col>

                    <v-col cols="12">
                      <div class="text-h7 mb-1">ผู้ดูแลตำแหน่ง Admin</div>
                      <v-text-field>
                        <p>{{ data_id.admin_id }}</p>
                      </v-text-field>
                    </v-col>

                  </v-row>
                </v-window-item>
                <!-- Tabs Edit in Dialog-->
                <v-window-item value="two">
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <div class="text-h7 mb-1">รหัส</div>
                      <v-text-field>
                        <p>{{ data_id.id }}</p>
                      </v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="4">
                      <div class="text-h7 mb-1">ประเภททั้งหมด</div>
                      <v-text-field>
                        <p>{{ data_id.type_all_id }}</p>
                      </v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="4">
                      <div class="text-h7 mb-1">รายการในสำนักงาน</div>
                      <v-text-field>
                        <p>{{ data_id.list_company_id }}</p>
                      </v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6">
                      <div class="text-h7 mb-1">วันที่สร้าง</div>
                      <v-text-field>
                        <p>{{ data_id.create_time }}</p>
                      </v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6">
                      <div class="text-h7 mb-1">วันที่อัปเดต</div>
                      <v-text-field>
                        <p>{{ data_id.update_time }}</p>
                      </v-text-field>
                    </v-col>

                    <v-col cols="12">
                      <div class="text-h7 mb-1">ผู้ดูแลตำแหน่ง Admin</div>
                      <v-text-field>
                        <p>{{ data_id.admin_id }}</p>
                      </v-text-field>
                    </v-col>

                  </v-row>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      prepend-icon="mdi-check"
                      variant="tonal"
                      color="#5865f2"
                      @click="dialog = false"
                    >
                      บันทึก
                    </v-btn>
                  </v-card-actions>
                </v-window-item>
              </v-window>
            </v-card-text>
          </v-container>
          <!-- <small>*indicates required field</small> -->
        </v-card>
      </v-dialog>
    </v-row>

    <!-- Dialog Add Detail -->
    <v-row justify="center">
      <v-dialog v-model="dialogAdd" persistent width="1024">
        <v-card>
          <v-toolbar color="primary" class="text-h5" title="เพิ่มข้อมูล">
            <v-btn icon dark @click="dialogAdd = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-container>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                      <div class="text-h7 mb-1">รหัส</div>
                      <v-text-field>
                        <!-- <p>{{ data_id.id }}</p> -->
                      </v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="4">
                      <div class="text-h7 mb-1">ประเภททั้งหมด</div>
                      <v-text-field>
                        <!-- <p>{{ data_id.type_all_id }}</p> -->
                      </v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="4">
                      <div class="text-h7 mb-1">รายการในสำนักงาน</div>
                      <v-text-field>
                        <!-- <p>{{ data_id.list_company_id }}</p> -->
                      </v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6">
                      <div class="text-h7 mb-1">วันที่สร้าง</div>
                      <v-text-field>
                        <!-- <p>{{ data_id.create_time }}</p> -->
                      </v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6">
                      <div class="text-h7 mb-1">วันที่อัปเดต</div>
                      <v-text-field>
                        <!-- <p>{{ data_id.update_time }}</p> -->
                      </v-text-field>
                    </v-col>

                    <v-col cols="12">
                      <div class="text-h7 mb-1">ผู้ดูแลตำแหน่ง Admin</div>
                      <v-text-field>
                        <!-- <p>{{ data_id.admin_id }}</p> -->
                      </v-text-field>
                    </v-col>
              </v-row>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  prepend-icon="mdi-check"
                  variant="tonal"
                  color="#5865f2"
                  @click="dialogAdd = false"
                >
                  บันทึก
                </v-btn>
              </v-card-actions>
            </v-card-text>
          </v-container>
        </v-card>
      </v-dialog>
    </v-row>

        <!-- <div class="flex flex-wrap align-center justify-cente p-2">
            <div class="rounded-md m-2 bg-slate-300 w-auto h-auto p-2" v-for="(data, index) in status_company" :key="index">
                <p>id : {{ data.id }}</p>
                <p>type_all_id : {{ data.type_all_id }}</p>
                <p>list_company_id : {{ data.list_company_id }}</p>
                <p>วันที่สร้าง : {{ data.create_time }}</p>
                <p>วันที่อัปเดต : {{ data.update_time }}</p>
                <p>สถานะลบ : {{ data.delete_status }}</p>
                <p>superadmin_id : {{ data.superadmin_id }}</p>
                <p>admin_id : {{ data.admin_id }}</p>
            </div>
        </div> -->
        <!-- Page break -->
    <v-pagination
      v-if="searchData == ''"
      class="page"
      v-model="currentPage"
      :length="totalPages"
    ></v-pagination>
    </div>
</template>
<script>
export default {
    setup() { },
    data() {
        return {
            status_company: null,
            data_id: null,
            dialog: false,
            dialogAdd: false,
            tab: null,
            detail: false,

            list: [1],
            itemsPerPage: 6,
            currentPage: 1,

            searchData: ''
        }
    },
    computed: {
    PictureInput,
    totalPages() {
      return this.list != '' ? useHandlePage.total_pages(this.list?.length, this.itemsPerPage) : ''
    },
    status_company() {
      if (this.searchData != '') {
        return this.data_form.filter((item) => {
          
          const lowerCaseQuery = this.searchData.toLowerCase()
          return (
            item.name.toLowerCase().match(lowerCaseQuery) ||
            item.type_all_id.toLowerCase().match(lowerCaseQuery)
          )
        })
      } else {
        const response =
          this.list != '' && this.currentPage != ''
            ? useHandlePage.getdata_pages(this.currentPage, this.itemsPerPage, this.list)
            : ''
        return this.list.slice(response[0], response[1]) // 0-9 / 10-19
      }
    }
    },
    async created() {
        this.StatusCompanyStore()
    },

    methods: {
        ...mapActions(useStatusCompanyStore, ['GetDataStatusCompany', 'Getdata', 'GetID', 'Delete']),
        async StatusCompanyStore() {
        const StatusCompanyStore = useStatusCompanyStore()
        await this.Getdata(PiniaRoot.token.token)
        this.status_company = StatusCompanyStore.data  
        this.list = this.status_company

    },
    async StatusCompanyGetID(id) {
      const StatusCompanyStore = useStatusCompanyStore()
      this.data_id = StatusCompanyStore.$state.data.find((p) => p.id == id)
    }
    }
}
</script>
<style>
html {
    scroll-behavior: smooth !important;
}
</style>
