<script setup>
import sweetalert2 from '@/assets/js/controller/switchalert'
import { computed } from 'vue'
import { mapActions } from 'pinia'
import { useDisplay } from 'vuetify'
import { useListUploadStore, useStatusUploadStore, useListCompanyStore, useListPersonnelStore, useStatusCompanyStore, useTokenStore, PiniaRoot } from '@/stores/'
import { useRouter } from 'vue-router'

import Title from '@/utils/Title'
import LoadingLayoutList from '@/components/Loading-Layout-List.vue'

import TextEditor from '@/components/TextEditor.vue'
import { QuillEditor, Quill, Delta } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.bubble.css'
</script>

<template>
  <div class="p-5 space-y-5 w-full h-full">
    <h1 class="text-3xl">{{ view_bin ? 'ถังขยะของรายการอัปโหลด' : 'รายการอัปโหลด' }}</h1>

    <div v-if="list_company_show && view_bin == false">
      <div class="flex justify-end py-4">
        <v-sheet class="space-x-2 bg-transparent d-flex justify-end">

          <v-btn v-if="button_children == true" color="grey-darken-1" @click="BackView('list')" id="backButton">
            <v-icon start icon="mdi-arrow-left"></v-icon>ย้อนกลับ</v-btn>

          <v-btn color="brown" @click="ListUploadRouter('', 'delete'), ListUploadGetDelete"><v-icon start
              icon="mdi mdi-delete-clock"></v-icon>ถังขยะ</v-btn>

          <v-btn @click="showDialogAdd()" color="deep-purple"><v-icon start
              icon="mdi mdi-plus"></v-icon>เพิ่มรายการอัปโหลด</v-btn>
        </v-sheet>
      </div>

      <!-- dialog Add  -->
      <v-dialog class="z-0" v-model="AddDialog" width="1024" persistent>
        <v-toolbar color="indigo" class="text-h5 " title="เพิ่มข้อมูล"><br>
          <v-btn icon dark @click="ResetOut('dialog.input_add')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card>
          <v-form @submit.prevent>
            <v-card-title>
              <v-row>
                <v-checkbox v-model="checkbox1" label="หัวข้อ" @change="handleCheckboxChange(1)"></v-checkbox>
                <v-checkbox v-model="checkbox2" label="ข้อมูล" @change="handleCheckboxChange(2)"></v-checkbox>
              </v-row>
              <!-- เลือกหัวข้อ -->
              <v-span v-if="checkbox1">
                <v-span class="text-body-1">กรุณาเลือกหัวข้อ</v-span>
                <v-text-field v-model="dialog.input_add.data.topic" :rules="[validation]" density="compact"
                  clearable></v-text-field>
              </v-span>
              <!-- เลือกข้อมูล -->
              <v-span v-if="checkbox2">
                <v-span class="text-body-1">กรุณาเลือกหัวข้อ</v-span>
                <v-text-field v-model="dialog.input_add.data.topic" :rules="[validation]" density="compact"
                  clearable></v-text-field>
                <v-row>
                  <v-checkbox v-model="checkbox3" label="ลิงค์" @change="handleCheckboxChangeTypeAll(1)"></v-checkbox>
                  <v-checkbox v-model="checkbox4" label="ข้อความ" @change="handleCheckboxChangeTypeAll(2)"></v-checkbox>
                </v-row>
                <v-text-field v-if="checkbox3" v-model="DialogStatusUpload.input_add.data.data_list_upload"
                  :rules="[validation]" density="compact" clearable></v-text-field>
                <TextEditor v-if="checkbox4" v-model:content="DialogStatusUpload.input_add.data.data_list_upload"
                  :rules="[validation]" clearable></TextEditor>
              </v-span>
            </v-card-title>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn type="submit" prepend-icon="mdi-check" variant="tonal" color="#5865f2"
                @click="ListUploadAddSubmit()">
                บันทึก </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>

      <!-- dialog Detail or Update status company-->
      <v-dialog class="z-0" v-model="DetailDialog" width="1024" persistent>
        <v-toolbar color="indigo" class="text-h5 " :title="tab == 'one' ? 'รายละเอียด' : 'แก้ไข'">
          <v-btn icon dark @click="ResetOut('dialog.data_id'), tab = 'one'">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-sheet>
          <v-tabs v-model="tab">
            <v-tab value="one" color="indigo-accent-4">
              <v-icon start>mdi-text-box-search-outline</v-icon>รายละเอียด</v-tab>
          </v-tabs>
        </v-sheet>
        <v-card>
          <v-from @submit.prevent>
            <v-window v-model="tab">
              <v-window-item value="one">
                <v-card-title>
                  <v-span class="text-body-2">หัวข้อ</v-span>
                  <v-text-field density="compact" clearable readonly>
                    {{ dialog.data_id.data.topic }}
                  </v-text-field>

                  <v-span class="text-body-2" v-if="DialogStatusCompany.data_id.type_all_id">{{
                    DialogStatusCompany.data_id.type_all_name }}</v-span>
                  <v-text-field :rules="[validation]" density="compact" clearable
                    v-if="DialogStatusCompany.data_id?.type_all_id == 35"
                    v-model="DialogStatusCompany.data_id.data.data_list_company" readonly>
                  </v-text-field>

                  <TextEditor v-else-if="DialogStatusCompany.data_id?.type_all_id == 36" :rules="[validation]" clearable
                    readOnly="true" theme="bubble" v-model:content="DialogStatusCompany.data_id.data.data_list_company">
                  </TextEditor>
                </v-card-title>
              </v-window-item>
            </v-window>
          </v-from>
        </v-card>
      </v-dialog>

      <!-- dialog Detail or Update status upload-->
      <v-dialog class="z-0" v-model="DetailDialogUpload" width="1024" persistent>
        <v-toolbar color="indigo" class="text-h5 " :title="tab == 'one' ? 'รายละเอียด' : 'แก้ไข'">
          <v-btn icon dark
            @click="ResetOut('dialog.data_id'), ResetOut('dialog.input_update'), ResetOut('DialogStatusUpload.input_update'), tab = 'one'">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-sheet>
          <v-tabs v-model="tab">
            <v-tab value="one" color="indigo-accent-4">
              <v-icon start>mdi-text-box-search-outline</v-icon>รายละเอียด</v-tab>
            <v-tab value="two" color="indigo-accent-4">
              <v-icon start>mdi-border-color</v-icon>แก้ไข</v-tab>
            <!-- <v-tab color="indigo-accent-4" @click="">
              <v-icon start>mdi-delete-outline</v-icon>ลบ</v-tab> -->
          </v-tabs>
        </v-sheet>
        <v-card>
          <v-from @submit.prevent>
            <v-window v-model="tab">
              <v-window-item value="one">
                <v-card-title>
                  <v-span class="text-body-2">หัวข้อ</v-span>
                  <v-text-field density="compact" clearable readonly>
                    {{ dialog.data_id.data.topic }}
                  </v-text-field>

                  <v-span class="text-body-2" v-if="DialogStatusUpload.data_id.type_all_id">{{
                    DialogStatusUpload.data_id.type_all_name }}</v-span>
                  <v-text-field :rules="[validation]" density="compact" clearable
                    v-if="DialogStatusUpload.data_id?.type_all_id == 35"
                    v-model="DialogStatusUpload.data_id.data.data_list_upload" readonly>
                  </v-text-field>

                  <TextEditor v-else-if="DialogStatusUpload.data_id?.type_all_id == 36" :rules="[validation]" clearable
                    readOnly="true" theme="bubble" v-model:content="DialogStatusUpload.data_id.data.data_list_upload">
                  </TextEditor>
                </v-card-title>
              </v-window-item>

              <v-window-item value="two">
                <v-card-title>
                  <v-span class="text-body-2">หัวข้อ</v-span>
                  <v-text-field density="compact" clearable v-model="dialog.input_update.data.topic">
                  </v-text-field>
                  <v-span class="text-body-2" v-if="DialogStatusUpload.data_id.type_all_id">{{
                    DialogStatusUpload.data_id.type_all_name }}</v-span>
                  <v-text-field :rules="[validation]" density="compact" clearable
                    v-if="DialogStatusUpload.data_id?.type_all_id == 35"
                    v-model="DialogStatusUpload.input_update.data.data_list_upload">
                  </v-text-field>

                  <TextEditor v-else-if="DialogStatusUpload.data_id?.type_all_id == 36" :rules="[validation]" clearable
                    v-model:content="DialogStatusUpload.input_update.data.data_list_upload"></TextEditor>
                </v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn type="submit" prepend-icon="mdi-check" variant="tonal" color="#5865f2"
                    @click="ListUploadUpdateSubmit(dialog.data_id.id, DialogStatusUpload.data_id.id)">
                    บันทึก </v-btn>
                </v-card-actions>
              </v-window-item>
            </v-window>

          </v-from>
        </v-card>
      </v-dialog>

      <v-table fixed-header height="" class="rounded-xl pa-3 shadow-lg">
        <thead>
          <tr>
            <th class="text-center">ลำดับ</th>
            <th class="text-left">ชื่อหัวข้อ</th>
            <th class="text-center">หัวข้อ / ข้อมูล</th>
            <th class="text-center">Level</th>
            <th class="text-center">จัดการ</th>
          </tr>
        </thead>

        <tbody v-if="list_company_show" class="pa-10">
          <tr v-for="(data, data_index) in list_company_show" :key="data_index">
            <td class="text-center pa-5">{{ data_index + 1 }}</td>
            <td>{{ data.topic }}</td>
            
            <td class="text-center" v-if="(data.list_company_id != null && data.status_upload_id == null)">หัวข้อ</td>
            <td class="text-center text-blue"
              v-else-if="(data.list_company_id == null && data.status_company_id == null)">หัวข้อ</td>
            <td class="text-center text-green" v-else>ข้อมูล</td>

            <td class="text-center">{{ data.level }}</td>
            <td class="space-x-1 text-center">

              <v-btn class="mr-1 rounded-lg" color="grey-darken-2" size="40" variant="tonal"
                @click="ListUploadRouter(data, 'list')"
                v-if="(data.list_company_id != null && data.status_upload_id == null)">
                <v-icon icon="mdi mdi-cog"></v-icon>
                <v-tooltip activator="parent" location="bottom">ตั้งค่า</v-tooltip>
              </v-btn>

              <v-btn class="mr-1 rounded-lg" color="grey-darken-2" size="40" variant="tonal"
                @click="ListCompanyRouter(data, 'list')"
                v-else-if="(data.list_company_id == null && data.status_company_id == null)">
                <v-icon icon="mdi mdi-cog"></v-icon>
                <v-tooltip activator="parent" location="bottom">ตั้งค่า</v-tooltip>
              </v-btn>

              <v-btn class="mr-1 rounded-lg" color="indigo-accent-4" size="40" variant="tonal"
                @click="showDialogDetailUpload(data)" v-if="data.list_company_id != null">
                <v-icon icon="mdi-text-box-search-outline"></v-icon>
                <v-tooltip activator="parent" location="bottom">รายละเอียด</v-tooltip>
              </v-btn>

              <v-btn class="mr-1 rounded-lg" color="indigo-accent-4" size="40" variant="tonal"
                @click="showDialogDetail(data)" v-else>
                <v-icon icon="mdi-text-box-search-outline"></v-icon>
                <v-tooltip activator="parent" location="bottom">รายละเอียด</v-tooltip>
              </v-btn>

              <v-btn class="mr-1 rounded-lg" color="red-darken-1" size="40" variant="tonal"
                @click="ListUploadDeleteSubmit(data.id, data.level)" v-if="data.list_company_id != null">
                <v-icon icon="mdi-delete-outline"></v-icon>
                <v-tooltip activator="parent" location="bottom">ลบ</v-tooltip>
              </v-btn>
            </td>
          </tr>
        </tbody>

      </v-table>
    </div>

    <div v-if="view_bin == true">

      <div class="flex justify-end py-4">
        <v-sheet class="space-x-2">
          <v-btn color="grey-darken-1" @click="BackView('delete')" id="backButton">
            <v-icon start icon="mdi-arrow-left"></v-icon>ย้อนกลับ</v-btn>
        </v-sheet>
      </div>

      <v-table fixed-header height="" class="rounded-xl pa-3 shadow-lg">
        <thead>
          <tr>
            <th class="text-center">ลำดับ</th>
            <th class="text-left">ชื่อหัวข้อ</th>
            <th class="text-center">Level</th>
            <th class="text-center">จัดการ</th>
          </tr>
        </thead>

        <tbody v-if="list_upload_delete_show" class="pa-10">
          <tr v-for="(data, data_index) in list_upload_delete_show" :key="data_index">
            <td class="text-center pa-5">{{ data_index + 1 }}</td>
            <td>{{ data.topic }}</td>
            <td class="text-center">{{ data.level }}</td>
            <td class="space-x-1 text-center">
              <v-btn class="mr-1 rounded-lg" color="cyan-darken-2" size="40" variant="tonal"
                @click="ListUploadUnDeleteSubmit(data.id, data.level)">
                <v-icon icon="mdi mdi-delete-restore"></v-icon>
                <v-tooltip activator="parent" location="bottom">กู้ข้อมูล</v-tooltip>
              </v-btn>
              <v-btn class="mr-1 rounded-lg" color="red-darken-1" size="40" variant="tonal"
                @click="ListUploadDeleteBackupSubmit(data.id, data.level)">
                <v-icon icon="mdi mdi-delete-forever"></v-icon>
                <v-tooltip activator="parent" location="bottom">ลบ</v-tooltip>
              </v-btn>
            </td>
          </tr>
        </tbody>

      </v-table>

    </div>

    <LoadingLayoutList v-if="list_company_show == null" />

  </div>
</template>

<script>
export default {
  setup() { },
  data() {
    return {
      router: useRouter(),
      Router_ID_Level: null,
      view_bin: false,
      button_children: false,

      list_company: null,
      list_company_show: null,
      status_company: null,

      list_upload: null,
      list_upload_show: null,
      list_upload_delete: null,
      list_upload_delete_show: null,
      status_upload: null,

      routers: null,

      route: null,
      token: null,
      list_personnel: null,

      checkbox1: true, // หัวข้อ
      checkbox2: false, // ข้อมูล
      checkbox3: false, // url
      checkbox4: false,// tex

      // add_select: { id: -1, topic: 'รวม' }, // เลือกกองงาน
      // // เอาไว้เช็คว่าสามารถเลือก รายการบุคลากรได้ true หรือไม่ false
      // check_select: true,

      ValidationSelect: [(v) => !!v || 'กรุณาเลือกกองงาน',],

      AddDialog: false,
      DetailDialog: false,
      DetailDialogUpload: false,
      tab: null,

      dialog: {
        // select: {
        //   list_personnel: null,
        // },
        input_add: {
          level: null,
          root: null,
          list_company_id: null,
          data: {
            topic: null,
          },
          // select: {
          //   list_personnel_id: null,
          // },
        },
        data_id: {
          id: null,
          level: null,
          root: null,
          data: {
            topic: null,
            create_time: null,
            update_time: null,
          },
          // select: {
          //   list_personnel_id: null,
          //   list_personnel_topic: null,
          // },
        },
        input_update: {
          data: {
            topic: null,
          },
        },
      },
      DialogStatusCompany: {
        input_add: {
          type_all_id: null,
          list_upload_id: null,
          data: {
            data_list_company: null,
          },
        },
        data_id: {
          id: null,
          type_all_id: null,
          list_upload_id: null,
          data: {
            data_list_company: null,
          },
        },
        input_update: {
          list_upload_id: null,
          data: {
            data_list_company: null,
          },
        }
      },
      DialogStatusUpload: {
        input_add: {
          type_all_id: null,
          list_upload_id: null,
          data: {
            data_list_upload: null,
          },
        },
        data_id: {
          id: null,
          type_all_id: null,
          list_upload_id: null,
          data: {
            data_list_upload: null,
          },
        },
        input_update: {
          list_upload_id: null,
          data: {
            data_list_upload: null,
          },
        }
      },
    }
  },
  async created() {
    this.token = await useTokenStore().DeCode(PiniaRoot.token.token)
    await this.getRoute()
  },
  computed: {
  },
  methods: {
    ...mapActions(useListCompanyStore, ['Get_ListCompany_U', 'Get_ListCompany_ID_U']),
    ...mapActions(useListPersonnelStore, ['Get_ListPersonnel_U']),
    ...mapActions(useStatusCompanyStore, ['Get_StatusCompany_U']),
    ...mapActions(useListUploadStore, ['Get_ListUpload_U', 'Get_ListUpload_ID_U', 'Add_ListUpload_ID_U', 'Update_ListUpload_ID_U', 'Get_Delete_ListUpload_U', 'Delete_ListUpload_ID_U', 'UnDelete_ListUpload_ID_U', 'DeleteBackup_ListUpload_ID_U']),
    ...mapActions(useStatusUploadStore, ['Get_StatusUpload_U', 'Add_StatusUpload_ID_U', 'Update_StatusUpload_ID_U']),
    async showDialogAdd() {
      this.AddDialog = true
      // this.check_select = true
      if (this.route.query?.level) {
        this.dialog.input_add.level = parseInt(this.route.query.level)
        this.dialog.input_add.list_company_id = this.route.query.list_company
          ? this.route.query.id
          : 0(this.dialog.input_add.root = parseInt(this.route.query.id))
      }
      else {
        this.dialog.input_add.level = 1
        this.dialog.input_add.root = null
        this.dialog.input_add.list_company_id = 0
      }
    },
    async showDialogDetail(data) {
      this.DetailDialog = true
      this.tab = 'one'
      await this.ListCompanyGetID(data)
    },
    async showDialogDetailUpload(data) {
      this.DetailDialogUpload = true
      this.tab = 'one'
      await this.ListUploadGetID(data)
    },
    async ListCompany_ListUploadDataStore() {
      // ListCompanyStore
      const ListCompanyStore = await useListCompanyStore()
      await ListCompanyStore.Get_ListCompany_U(PiniaRoot.token.token)
      const response = await ListCompanyStore.$state.data

      this.list_company = typeof response == 'string'
        ? await sweetalert2.warning(response)
        : response

      // ListUploadStore
      const ListUploadStore = await useListUploadStore()
      await ListUploadStore.Get_ListUpload_U(PiniaRoot.token.token)
      const response2 = await ListUploadStore.$state.data

      this.list_upload = typeof response2 == 'string'
        ? await sweetalert2.warning(response2)
        : response2

      // StatusCompanyStore and StatusUploadStore
      await this.StatusCompany_StatusUpload()
      // ถ้า list_company มี status_company
      this.list_company = this.list_company.map(list => {
        const join = this.status_company.find(status => status.list_company_id === list.id)
        return { ...list, status_company_id: join ? join.id : null }
      })
      // ถ้า list_upload มี status_upload
      this.list_upload = this.list_upload.map(list => {
        const join = this.status_upload.find(status => status.list_upload_id === list.id)
        return { ...list, status_upload_id: join ? join.id : null }
      })
      // ค้นหา list_upload เฉพาะ user คนนั้น ๆ
      this.list_upload = this.list_upload.filter(items => items.user_id == this.token.DataUser.id)
      // ค้นหา list_company เฉพาะ list_personnel รวม และ นั้น ๆ
      this.list_company = this.list_company.filter(items => items.list_personnel_id == null || items.list_personnel_id == this.token.DataUser.list_personnel_id)
      // นำ list_company และ list_upload รวมกัน
      this.list_company = this.list_company.concat(this.list_upload);
      // ค้นหา list_company และ list_upload ตาม level root และ list_upload.list_company_id
      this.list_company_show = await this.CheckRouter()
    },
    async StatusCompany_StatusUpload() {
      const StatusCompanyStore = await useStatusCompanyStore()
      await StatusCompanyStore.Get_StatusCompany_U(PiniaRoot.token.token)
      const response1 = await StatusCompanyStore.$state.data
      this.status_company = typeof response1 == 'string'
        ? null(await sweetalert2.warning(response1))
        : response1

      const StatusUploadStore = await useStatusUploadStore()
      await StatusUploadStore.Get_StatusUpload_U(PiniaRoot.token.token)
      const response2 = await StatusUploadStore.$state.data
      this.status_upload = typeof response2 == 'string'
        ? null(await sweetalert2.warning(response2))
        : response2
    },
    async ListCompanyGetID(data) {
      this.dialog.data_id.id = data.id
      this.dialog.data_id.level = data.level
      this.dialog.data_id.root = data.root
      this.dialog.data_id.data.topic = data.topic
      this.dialog.input_update.data.topic = data.topic
      this.dialog.data_id.data.create_time = data.create_time
      this.dialog.data_id.data.update_time = data.update_time

      const StatusCompanyStore = await useStatusCompanyStore()
      const response1 = await this.Get_StatusCompany_U(PiniaRoot.token.token);
      if (typeof response1 == 'string') {
        await sweetalert2.warning(response1)
      }
      let statusCompany = await StatusCompanyStore.$state.data
      statusCompany = statusCompany.filter(items => items.list_company_id == data.id)[0]

      if (statusCompany != null) {
        this.DialogStatusCompany.data_id.id = statusCompany.id
        this.DialogStatusCompany.data_id.type_all_id = statusCompany.type_all_id
        if (statusCompany.type_all_id == 35) {

          this.DialogStatusCompany.data_id.type_all_name = 'ลิงค์'
          this.DialogStatusCompany.data_id.data.data_list_company = statusCompany.data_list_company
          this.DialogStatusCompany.input_update.data.data_list_company = statusCompany.data_list_company
        }
        else {
          this.DialogStatusCompany.data_id.type_all_name = 'ข้อความ'
          let data_json = JSON.parse(statusCompany.data_list_company)
          // ข้อมูลจาก database
          // เอาไปแสดงตรง Detail
          this.DialogStatusCompany.data_id.data.data_list_company = new Delta(data_json.ops)
          // เอาไปแสดงตรง Update
          // this.DialogStatusCompany.input_update.data.data_list_company = data_json.ops
          this.DialogStatusCompany.input_update.data.data_list_company = new Delta(data_json.ops)
        }
      }
      else {
        this.DialogStatusCompany.data_id.type_all_id = null
      }
    },
    async ListUploadGetID(data) {
      this.dialog.data_id.id = data.id
      this.dialog.data_id.level = data.level
      this.dialog.data_id.root = data.root
      this.dialog.data_id.data.topic = data.topic
      this.dialog.input_update.data.topic = data.topic
      this.dialog.data_id.data.create_time = data.create_time
      this.dialog.data_id.data.update_time = data.update_time

      const StatusUploadStore = await useStatusUploadStore()
      const response1 = await this.Get_StatusUpload_U(PiniaRoot.token.token);
      if (typeof response1 == 'string') {
        await sweetalert2.warning(response1)
      }
      let statusUpload = await StatusUploadStore.$state.data
      statusUpload = statusUpload.filter(items => items.list_upload_id == data.id && items.user_id == this.token.DataUser.id)[0]

      if (statusUpload != null) {
        this.DialogStatusUpload.data_id.id = statusUpload.id
        this.DialogStatusUpload.data_id.type_all_id = statusUpload.type_all_id
        if (statusUpload.type_all_id == 35) {

          this.DialogStatusUpload.data_id.type_all_name = 'ลิงค์'
          this.DialogStatusUpload.data_id.data.data_list_upload = statusUpload.data_list_upload
          this.DialogStatusUpload.input_update.data.data_list_upload = statusUpload.data_list_upload
        }
        else {
          this.DialogStatusUpload.data_id.type_all_name = 'ข้อความ'
          let data_json = JSON.parse(statusUpload.data_list_upload)
          // ข้อมูลจาก database
          // เอาไปแสดงตรง Detail
          this.DialogStatusUpload.data_id.data.data_list_upload = new Delta(data_json.ops)
          // เอาไปแสดงตรง Update
          // this.DialogStatusUpload.input_update.data.data_list_upload = data_json.ops
          this.DialogStatusUpload.input_update.data.data_list_upload = new Delta(data_json.ops)
        }
      }
      else {
        this.DialogStatusUpload.data_id.type_all_id = null
      }
    },
    async ListUploadAddSubmit() {
      this.AddDialog = false
      let list_personnel_id = this.token.DataUser.list_personnel_id
      let list_upload_id = null
      let add_data = {
        topic: this.dialog.input_add.data.topic,
        level: this.dialog.input_add.level,
        root: this.dialog.input_add.root,
        list_personnel_id: list_personnel_id,
        list_company_id: this.dialog.input_add.list_company_id,
        user_id: this.token.DataUser.id
      }
      const response1 = await this.Add_ListUpload_ID_U(PiniaRoot.token.token, add_data);
      if (typeof response1 == 'string') {
        this.ResetOut('dialog.input_add')
        await sweetalert2.warning(response1)
      }
      else {
        list_upload_id = response1.insertId
        await sweetalert2.success('สำเร็จ')
        await this.ListCompany_ListUploadDataStore()
      }
      // api ดึงข้อมูลจาก type_all โดยใช้สิทธิ ยังไม่มี เลยกำหนดค่าแบบคงที่แทน
      if (this.checkbox2) {
        if (this.checkbox3) {
          this.DialogStatusUpload.input_add.type_all_id = 35
        }
        else {
          this.DialogStatusUpload.input_add.type_all_id = 36,
            this.DialogStatusUpload.input_add.data.data_list_upload = JSON.stringify(this.DialogStatusUpload.input_add.data.data_list_upload)
        }
        let add_data_status_upload = {
          data_list_upload: this.DialogStatusUpload.input_add.data.data_list_upload,
          type_all_id: this.DialogStatusUpload.input_add.type_all_id,
          list_upload_id: list_upload_id,
          user_id: this.token.DataUser.id
        }
        // ข้อมูลจาก Input Add
        const response2 = await this.Add_StatusUpload_ID_U(PiniaRoot.token.token, add_data_status_upload);
        if (typeof response2 == 'string') {
          this.ResetOut('dialog.input_add')
          this.ResetOut('DialogStatusUpload.input_add')
          await sweetalert2.warning(response2)
        }
        else {
          await sweetalert2.success('สำเร็จ')
          this.ResetOut('dialog.input_add')
          this.ResetOut('DialogStatusUpload.input_add')
          await this.ListCompany_ListUploadDataStore()
        }
      } else {
        this.ResetOut('dialog.input_add')
      }
    },
    async ListUploadUpdateSubmit(list_upload_id, status_upload_id) {
      const ListUploadStore = useListUploadStore()
      const temp_update1 = await ListUploadStore.$state.data.find(p => p.id == list_upload_id)
      let update_data = {
        topic: this.dialog.input_update.data.topic,
        list_personnel_id: this.token.DataUser.list_personnel_id
      }
      const response1 = await this.Update_ListUpload_ID_U(PiniaRoot.token.token, update_data, list_upload_id)
      if (typeof response1 == 'string') {
        this.ResetOut('dialog.input_update')
        await sweetalert2.warning(response1)
      }
      else {
        for (const key in this.dialog.input_update.data) {
          temp_update1[key] = update_data[key]
        }
        await sweetalert2.success('สำเร็จ')
      }
      if (status_upload_id) {
        const StatusUploadStore = useStatusUploadStore()
        const temp_update2 = await StatusUploadStore.$state.data.find(p => p.id == status_upload_id)

        if (temp_update2.type_all_id != 35) {
          this.DialogStatusUpload.input_update.data.data_list_upload = JSON.stringify(this.DialogStatusUpload.input_update.data.data_list_upload)
        }
        // ข้อมูลจาก Input Update
        let update_data_status_upload = {
          data_list_upload: this.DialogStatusUpload.input_update.data.data_list_upload,
          type_all_id: temp_update2.type_all_id,
          list_upload_id: list_upload_id,
        }
        const response2 = await this.Update_StatusUpload_ID_U(PiniaRoot.token.token, update_data_status_upload, status_upload_id)
        if (typeof response2 == 'string') {
          this.ResetOut('dialog.input_update')
          this.ResetOut('DialogStatusUpload.input_update')
          await sweetalert2.warning(response2)
        }
        else {
          for (const key in this.dialog.input_update.data) {
            temp_update2[key] = update_data_status_upload[key]
          }
          this.ResetOut('dialog.input_update')
          this.ResetOut('DialogStatusUpload.input_update')
          await sweetalert2.success('สำเร็จ')
        }
      } else {
        this.ResetOut('dialog.input_update')
      }
    },
    async ListUploadGetDelete() {
      const ListUploadStore = await useListUploadStore()
      await ListUploadStore.Get_Delete_ListUpload_U(PiniaRoot.token.token)
      const response = await ListUploadStore.$state.delete_data
      this.list_upload_delete = typeof response == 'string'
        ? await sweetalert2.warning(response)
        : response

      const Routers = this.$router.currentRoute.value.query
      const ID = parseInt(Routers.id)
      const Level = parseInt(Routers.level)
      this.list_upload_delete_show = !ID && !Level
        ? await response.filter(items => items.root == null && items.level == 1 && items.user_id == this.token.DataUser.id)
        : await response.filter(items => items.root == ID && items.level == Level && items.user_id == this.token.DataUser.id || items.list_company_id == ID && items.level == Level && items.user_id == this.token.DataUser.id);
    },
    async ListUploadDeleteSubmit(ID, Level) {
      const ListData = await this.CheckListIDAndRoot(ID, 'Delete')
      sweetalert2.Delete('ลบข้อมูล', 'คุณแน่ใจใช่หรือไม่', ID, async res => {
        if (res[0].isConfirmed == true) {
          const ListUploadStore = useListUploadStore()
          const SuccessResponses = [];
          const ErrorResponses = [];

          for (const item of ListData) {
            const response = await this.Delete_ListUpload_ID_U(PiniaRoot.token.token, item.id);
            typeof response == 'string'
              ? ErrorResponses.push(response)
              : SuccessResponses.push(item.id);
          }
          if (ErrorResponses?.length > 0) {
            await sweetalert2.warning(`เกิดข้อผิดพลาดในการลบข้อมูลบางรายการ:\n${ErrorResponses.join('\n')}`)
          } else {
            const updatedData = await ListUploadStore.$state.data.filter(Delete => !SuccessResponses.includes(Delete.id) && Delete.level != Level);
            // const updatedData = await ListUploadStore.$state.data.filter(Delete => Delete.id != SuccessResponses.map(items => items.id) && Delete.level != Level);
            ListUploadStore.$state.data = updatedData;
            this.list_upload = updatedData;
            sweetalert2.success('ลบข้อมูลสำเร็จ');
            await this.ListCompany_ListUploadDataStore()
            await this.ListUploadGetDelete()
          }
        }
      });
    },
    async ListUploadUnDeleteSubmit(ID, Level) {
      const ListData = await this.CheckListIDAndRoot(ID, 'UnDelete')
      sweetalert2.Delete('กู้คืนข้อมูล', 'คุณแน่ใจใช่หรือไม่', ID, async res => {
        if (res[0].isConfirmed == true) {
          const ListUploadStore = await useListUploadStore()
          const SuccessResponses = [];
          const ErrorResponses = [];

          for (const item of ListData) {
            const response = await ListUploadStore.UnDelete_ListUpload_ID_U(PiniaRoot.token.token, item.id);
            typeof response == 'string'
              ? ErrorResponses.push(response)
              : SuccessResponses.push(item.id);
          }
          if (ErrorResponses?.length > 0) {
            await sweetalert2.warning(`เกิดข้อผิดพลาดในการกู้คืนข้อมูลบางรายการ:\n${ErrorResponses.join('\n')}`)
          } else {
            const updatedData = await ListUploadStore.$state.delete_data.filter(UnDelete => !SuccessResponses.includes(UnDelete.id) && UnDelete.level != Level);
            ListUploadStore.$state.delete_data = updatedData;
            this.list_upload_delete = updatedData;
            sweetalert2.success('กู้ข้อมูลสำเร็จ');
            await this.ListCompany_ListUploadDataStore()
            await this.ListUploadGetDelete()
          }
        }
      });
    },
    async ListUploadDeleteBackupSubmit(ID, Level) {
      const ListData = await this.CheckListIDAndRoot(ID, 'DeleteBackup')
      sweetalert2.Delete('ลบข้อมูลถาวร', 'คุณแน่ใจใช่หรือไม่', ID, async res => {
        if (res[0].isConfirmed == true) {
          const ListUploadStore = await useListUploadStore()
          const SuccessResponses = [];
          const ErrorResponses = [];

          for (const item of ListData) {
            const response = await ListUploadStore.DeleteBackup_ListUpload_ID_U(PiniaRoot.token.token, item.id);
            typeof response == 'string'
              ? ErrorResponses.push(response)
              : SuccessResponses.push(item.id);
          }
          const updatedData = await ListUploadStore.$state.delete_data.filter(Delete => !SuccessResponses.includes(Delete.id) && Delete.level != Level);
          ListUploadStore.$state.delete_data = updatedData;
          this.list_upload_delete = updatedData;
          sweetalert2.success('ลบข้อมูลถาวรสำเร็จ');
          await this.ListCompany_ListUploadDataStore()
          await this.ListUploadGetDelete()
        }
      });
    },
    async ListCompanyRouter(data, Type) {
      if (Type == 'list') {
        const routerlistcompany = this.router.currentRoute.name == 'UserListUpload'
          ? await this.router.push({
            path: '/user/listupload',
            query: { level: data.level + 1, id: data.id, list_company: true }
          })
          : '';
        this.list_company_show = await this.CheckRouter()
        return routerlistcompany
      } else {
        this.view_bin = true
      }
    },
    async ListUploadRouter(data, Type) {
      if (Type == 'list') {
        const routerlistupload = this.router.currentRoute.name == 'UserListUpload'
          ? await this.router.push({
            path: '/user/listupload',
            query: { level: data.level + 1, id: data.id, list_upload: false }
          })
          : '';
        this.list_upload_show = await this.CheckRouterUpload()
        return routerlistupload
      } else {
        this.view_bin = true
      }
    },
    async CheckRouter(ids = null, levels = null) {
      this.routers = this.$router.currentRoute.value.query
      const Routers = this.routers

      const ID = ids == null ? parseInt(Routers.id) : ids
      const Level = levels == null ? parseInt(Routers.level) : levels

      this.button_children = !ID && !Level
        ? false
        : true

      if (!ID && !Level) {
        return this.list_company?.filter(items => items.root == null && items.level == 1)
      } else {
        return Routers.list_company
          ? this.list_company?.filter(items => items.root == ID && items.level == Level || items.list_company_id == ID && items.level == Level)
          : this.list_company?.filter(items => items.root == ID && items.level == Level)
      }
    },
    async CheckRouterUpload(ids = null, levels = null) {
      this.routers = this.$router.currentRoute.value.query
      const Routers = this.routers

      const ID = ids == null ? parseInt(Routers.id) : ids
      const Level = levels == null ? parseInt(Routers.level) : levels

      this.button_children = !ID && !Level
        ? false
        : true

      return !ID && !Level
        ? this.list_upload?.filter(items => items.root == null && items.level == 1 && items.user_id == this.token.DataUser.id)
        : this.list_upload?.filter(items => items.root == ID && items.level == Level && items.user_id == this.token.DataUser.id)

    },
    async CheckListIDAndRoot(ID, key) {
      const Date = key == 'Delete'
        ? this.list_upload
        : this.list_upload_delete;
      const Array = []
      const ListID = await Date.find(items => items.id === ID);
      ListID ? Array.push(ListID) : '';
      await Promise.all(Date.map(async item => {
        if (item.root == ID) {
          const children = await this.CheckListIDAndRoot(item.id, key);
          Array.push(...children);
        }
      }));
      return Array
    },
    handleCheckboxChange(checkbox) {
      // แบบยาว
      // 1
      // if (checkbox === 1) {

      //   if (this.checkbox2) {
      //     this.checkbox2 = false;
      //   }
      // } else if (checkbox === 2) {
      //   if (this.checkbox1) {
      //     this.checkbox1 = false;
      //   }
      // }

      // แบบสั้น
      const otherCheckbox = checkbox === 1 ? this.checkbox2 : this.checkbox1;
      if (otherCheckbox) {
        this[checkbox === 1 ? 'checkbox2' : 'checkbox1'] = false;
      }
      this.dialog.input_add.data.topic = null
    },
    handleCheckboxChangeTypeAll(checkbox) {
      // แบบสั้น
      const otherCheckbox = checkbox === 1 ? this.checkbox4 : this.checkbox3;
      if (otherCheckbox) {
        this[checkbox === 1 ? 'checkbox4' : 'checkbox3'] = false;
      }
      this.DialogStatusUpload.input_add.data.data_list_company = null
    },
    validation(v) {
      return !!v || 'กรุณากรอบข้อมูล'
    },
    async BackView(Type) {
      if (Type == 'list') {
        window.history.back();
        const url = await window.history.state
        const ID = parseInt(url.current.split('id=')[1])
        const Level = parseInt(url.current.split('level=')[1])
        this.list_company_show = await this.CheckRouter(ID, Level)
      } else {
        this.view_bin = false
      }
    },
    ResetOut(typ) {
      this.AddDialog = false
      this.DetailDialog = false
      this.DetailDialogUpload = false
      this.checkbox1 = true
      this.checkbox2 = false
      this.checkbox3 = false
      this.checkbox4 = false
      if (typ == "dialog.input_add") {
        Object.assign(this.$data.dialog.input_add, this.$options.data().dialog.input_add)
      } else if (typ == "dialog.input_update") {
        Object.assign(this.$data.dialog.input_update, this.$options.data().dialog.input_update);
      } else if (typ == "DialogStatusUpload.input_add") {
        Object.assign(this.$data.DialogStatusUpload.input_add, this.$options.data().DialogStatusUpload.input_add);
      } else {
        Object.assign(this.$data.DialogStatusUpload.input_update, this.$options.data().DialogStatusUpload.input_update);
      }
    },
    async getRoute() {
      this.route = this.$route
      await this.ListCompany_ListUploadDataStore()
      await this.ListUploadGetDelete()
    },
  },
  watch: {
    async $route() {
      await this.getRoute()
    },
    // list_company_show: {
    //   handler: 'ListCompany_ListUploadDataStore',
    //   deep: true
    // },
    // list_upload_delete_show: {
    //   handler: 'ListUploadGetDelete',
    //   deep: true
    // },
  },
}
</script>
<style>
html {
  scroll-behavior: smooth !important;
}
</style>