<script setup>
import sweetalert2 from '@/assets/js/controller/switchalert'
import { computed } from 'vue'
import { mapActions } from 'pinia'
import { useDisplay } from 'vuetify'
import { useListCompanyStore, useListPersonnelStore, useStatusCompanyStore, useTokenStore, PiniaRoot } from '@/stores/'
import { useRouter } from 'vue-router'

import Title from '@/utils/Title'
import LoadingLayoutList from '@/components/Loading-Layout-List.vue'

import TextEditor from '@/components/TextEditor.vue'
import { QuillEditor, Quill, Delta } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.bubble.css'
</script>

<template>
  <div class="p-5 space-y-5 w-full h-full">
    <h1 class="text-3xl">{{ view_bin ? 'ถังขยะของรายการสำนักงาน' : 'รายการสำนักงาน' }}</h1>

    <div v-if="list_company_show && view_bin == false">
      <div class="flex justify-end py-4">
        <v-sheet class="space-x-2 bg-transparent d-flex justify-end">

          <v-btn v-if="button_children == true" color="grey-darken-1" @click="BackView('list')" id="backButton">
            <v-icon start icon="mdi-arrow-left"></v-icon>ย้อนกลับ</v-btn>

          <v-btn color="brown" @click="ListCompanyRouter('', 'delete'), ListCompanyGetDelete"><v-icon start
              icon="mdi mdi-delete-clock"></v-icon>ถังขยะ</v-btn>

          <v-btn @click="showDialogAdd()" color="deep-purple"><v-icon start
              icon="mdi mdi-plus"></v-icon>เพิ่มรายการสำนักงาน</v-btn>
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
              <v-span v-if="check_select == true">
                <v-span class="text-body-2">เลือกกองงาน</v-span>
                <!-- :hint -->
                <v-select v-model="dialog.input_add.select.list_personnel_id" :rules="ValidationSelect"
                  :items="dialog.select.list_personnel" item-value="id" item-title="topic" placeholder="เลือกกองงาน"
                  density="compact"></v-select>
                <!-- เลือกหัวข้อ หรือ  ข้อมูล -->
              </v-span>
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
                <v-text-field v-if="checkbox3" v-model="DialogStatusCompany.input_add.data.data_list_company"
                  :rules="[validation]" density="compact" clearable></v-text-field>
                <TextEditor v-if="checkbox4" v-model:content="DialogStatusCompany.input_add.data.data_list_company"
                  :rules="[validation]" clearable></TextEditor>
              </v-span>
            </v-card-title>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn type="submit" prepend-icon="mdi-check" variant="tonal" color="#5865f2"
                @click="ListCompanyAddSubmit()">
                บันทึก </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>

      <!-- dialog Detail or Update-->
      <v-dialog class="z-0" v-model="DetailDialog" width="1024" persistent>
        <v-toolbar color="indigo" class="text-h5 " :title="tab == 'one' ? 'รายละเอียด' : 'แก้ไข'">
          <v-btn icon dark
            @click="ResetOut('dialog.input_update'), ResetOut('DialogStatusCompany.input_update'), tab = 'one'">
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
                  <v-span class="text-body-2">รายการบุคลากร</v-span>
                  <v-text-field density="compact" clearable readonly>
                    {{ dialog.data_id.select.list_personnel_topic }}
                  </v-text-field>

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

              <v-window-item value="two">
                <v-card-title >

                  <v-span class="text-body-2">หัวข้อ</v-span>
                  <v-text-field density="compact" clearable v-model="dialog.input_update.data.topic">
                  </v-text-field>

                  <v-span class="text-body-2" v-if="DialogStatusCompany.data_id.type_all_id">{{
                    DialogStatusCompany.data_id.type_all_name }}</v-span>
                  <v-text-field :rules="[validation]" density="compact" clearable
                    v-if="DialogStatusCompany.data_id?.type_all_id == 35"
                    v-model="DialogStatusCompany.input_update.data.data_list_company">
                  </v-text-field>

                    <TextEditor v-else-if="DialogStatusCompany.data_id?.type_all_id == 36" :rules="[validation]" clearable
                      v-model:content="DialogStatusCompany.input_update.data.data_list_company" ></TextEditor>
                </v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn type="submit" prepend-icon="mdi-check" variant="tonal" color="#5865f2"
                    @click="ListCompanyUpdateSubmit(dialog.data_id.id, DialogStatusCompany.data_id.id)">
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

            <td class="text-center text-blue"
              v-if="(data.status_company_id == null)">หัวข้อ</td>
            <td class="text-center text-green" v-else>ข้อมูล</td>

            <td class="text-center">{{ data.level }}</td>
            <td class="space-x-1 text-center">

              <v-btn class="mr-1 rounded-lg" color="grey-darken-2" size="40" variant="tonal"
                @click="ListCompanyRouter(data, 'list')"
                v-if="(data.status_company_id == null)">
                <v-icon icon="mdi mdi-cog"></v-icon>
                <v-tooltip activator="parent" location="bottom">ตั้งค่า</v-tooltip>
              </v-btn>

              <!-- <v-btn class="mr-1 rounded-lg" color="grey-darken-2" size="40" variant="tonal"
                @click="ListCompanyRouter(data, 'list')">
                <v-icon icon="mdi mdi-cog"></v-icon>
                <v-tooltip activator="parent" location="bottom">ตั้งค่า</v-tooltip>
              </v-btn> -->

              <v-btn class="mr-1 rounded-lg" color="indigo-accent-4" size="40" variant="tonal"
                @click="showDialogDetail(data)">
                <v-icon icon="mdi-text-box-search-outline"></v-icon>
                <v-tooltip activator="parent" location="bottom">รายละเอียด</v-tooltip>
              </v-btn>
              <v-btn class="mr-1 rounded-lg" color="red-darken-1" size="40" variant="tonal"
                @click="ListCompanyDeleteSubmit(data.id, data.level)">
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

        <tbody v-if="list_company_delete_show" class="pa-10">
          <tr v-for="(data, data_index) in list_company_delete_show" :key="data_index">
            <td class="text-center pa-5">{{ data_index + 1 }}</td>
            <td>{{ data.topic }}</td>
            <td class="text-center">{{ data.level }}</td>
            <td class="space-x-1 text-center">
              <v-btn class="mr-1 rounded-lg" color="cyan-darken-2" size="40" variant="tonal"
                @click="ListCompanyUnDeleteSubmit(data.id, data.level)">
                <v-icon icon="mdi mdi-delete-restore"></v-icon>
                <v-tooltip activator="parent" location="bottom">กู้ข้อมูล</v-tooltip>
              </v-btn>
              <v-btn class="mr-1 rounded-lg" color="red-darken-1" size="40" variant="tonal"
                @click="ListCompanyDeleteBackupSubmit(data.id, data.level)">
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
      list_company_delete: null,
      list_company_delete_show: null,
      status_company: null,

      routers: null,

      route: null,
      token: null,
      list_personnel: null,

      checkbox1: true, // หัวข้อ
      checkbox2: false, // ข้อมูล
      checkbox3: false, // url
      checkbox4: false,// tex

      add_select: { id: -1, topic: 'รวม' }, // เลือกกองงาน
      // เอาไว้เช็คว่าสามารถเลือก รายการบุคลากรได้ true หรือไม่ false
      check_select: true,

      ValidationSelect: [(v) => !!v || 'กรุณาเลือกกองงาน',],

      AddDialog: false,
      DetailDialog: false,
      tab: null,

      dialog: {
        select: {
          list_personnel: null,
        },
        input_add: {
          level: null,
          root: null,
          data: {
            topic: null,
          },
          select: {
            list_personnel_id: null,
          },
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
          select: {
            list_personnel_id: null,
            list_personnel_topic: null,
          },
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
          list_company_id: null,
          data: {
            data_list_company: null,
          },
        },
        data_id: {
          id: null,
          type_all_id: null,
          list_company_id: null,
          data: {
            data_list_company: null,
          },
        },
        input_update: {
          list_company_id: null,
          data: {
            data_list_company: null,
          },
        }
      },
    }
  },
  async created() {
    this.token = await useTokenStore().DeCode(PiniaRoot.token.token)
    await this.getRoute()
    await this.ListPersonnelDataStore()
  },
  computed: {
  },
  methods: {
    ...mapActions(useListCompanyStore, ['Get_ListCompany_A', 'Get_ListCompany_ID_A', 'Get_Delete_ListCompany_A', 'Add_ListCompany_ID_A', 'Update_ListCompany_ID_A', 'UnDelete_ListCompany_ID_A', 'DeleteBackup_ListCompany_ID_A', 'DeleteBackup_ListCompany_ID_A']),
    ...mapActions(useListPersonnelStore, ['Get_ListPersonnel_A']),
    ...mapActions(useStatusCompanyStore, ['Get_StatusCompany_A', 'Add_StatusCompany_ID_A', 'Update_StatusCompany_ID_A']),
    async showDialogDetail(data) {
      this.DetailDialog = true
      this.tab = 'one'
      await this.ListCompanyGetID(data)
    },
    async ListCompanyDataStore() {
      // ListCompanyStore
      const ListCompanyStore = await useListCompanyStore()
      await ListCompanyStore.Get_ListCompany_A(PiniaRoot.token.token)
      const response = await ListCompanyStore.$state.data
      this.list_company = typeof response == 'string'
        ? await sweetalert2.warning(response)
        : response

      // StatusCompanyStore
      await this.StatusCompany()
      // ถ้า list_company มี status_company
      this.list_company = this.list_company.map(list => {
        const join = this.status_company.find(status => status.list_company_id === list.id)
        return { ...list, status_company_id: join ? join.id : null }
      })
      // ค้นหา list_company ตาม level root
      this.list_company_show = await this.CheckRouter()
    },
    async StatusCompany() {
      const StatusCompanyStore = await useStatusCompanyStore()
      await StatusCompanyStore.Get_StatusCompany_A(PiniaRoot.token.token)
      const response = await StatusCompanyStore.$state.data
      this.status_company = typeof response == 'string'
        ? null(await sweetalert2.warning(response))
        : response
    },
    async ListCompanyGetDelete() {
      const ListCompanyStore = await useListCompanyStore()
      await ListCompanyStore.Get_Delete_ListCompany_A(PiniaRoot.token.token)
      const response = await ListCompanyStore.$state.delete_data
      this.list_company_delete = typeof response == 'string'
        ? await sweetalert2.warning(response)
        : response
      const Routers = this.$router.currentRoute.value.query
      const ID = parseInt(Routers.id)
      const Level = parseInt(Routers.level)
      return this.list_company_delete_show = !ID && !Level
        ? await response.filter(item => item.root == null && item.level == 1)
        : await response.filter(item => item.root == ID && item.level == Level);
    },
    async ListCompanyDeleteSubmit(ID, Level) {

      const ListData = await this.CheckListIDAndRoot(ID, 'Delete')
      console.log("ListData:", ListData)
      sweetalert2.Delete('ลบข้อมูล', 'คุณแน่ใจใช่หรือไม่', ID, async res => {
        console.log("ID:", ID)
        if (res[0].isConfirmed == true) {
          const ListCompanyStore = await useListCompanyStore()
          const SuccessResponses = [];
          const ErrorResponses = [];

          for (const item of ListData) {
            const response = await ListCompanyStore.Delete_ListCompany_ID_A(PiniaRoot.token.token, item.id);
            typeof response == 'string'
              ? ErrorResponses.push(response)
              : SuccessResponses.push(item.id);
          }
          if (ErrorResponses?.length > 0) {
            await sweetalert2.warning(`เกิดข้อผิดพลาดในการลบข้อมูลบางรายการ:\n${ErrorResponses.join('\n')}`)
          } else {
            const updatedData = await ListCompanyStore.$state.data.filter(Delete => !SuccessResponses.includes(Delete.id) && Delete.level != Level);
            // const updatedData = await ListCompanyStore.$state.data.filter(Delete => Delete.id != SuccessResponses.map(item => item.id) && Delete.level != Level);
            ListCompanyStore.$state.data = updatedData;
            this.list_company = updatedData;
            sweetalert2.success('ลบข้อมูลสำเร็จ');
            await this.ListCompanyDataStore()
            await this.ListCompanyGetDelete()
          }
        }
      });
    },
    async ListCompanyUnDeleteSubmit(ID, Level) {
      const ListData = await this.CheckListIDAndRoot(ID, 'UnDelete')
      sweetalert2.Delete('กู้คืนข้อมูล', 'คุณแน่ใจใช่หรือไม่', ID, async res => {
        if (res[0].isConfirmed == true) {
          const ListCompanyStore = await useListCompanyStore()
          const SuccessResponses = [];
          const ErrorResponses = [];

          for (const item of ListData) {
            const response = await ListCompanyStore.UnDelete_ListCompany_ID_A(PiniaRoot.token.token, item.id);
            typeof response == 'string'
              ? ErrorResponses.push(response)
              : SuccessResponses.push(item.id);
          }
          if (ErrorResponses?.length > 0) {
            await sweetalert2.warning(`เกิดข้อผิดพลาดในการกู้คืนข้อมูลบางรายการ:\n${ErrorResponses.join('\n')}`)
          } else {
            const updatedData = await ListCompanyStore.$state.delete_data.filter(UnDelete => !SuccessResponses.includes(UnDelete.id) && UnDelete.level != Level);
            ListCompanyStore.$state.delete_data = updatedData;
            this.list_company_delete = updatedData;
            sweetalert2.success('กู้ข้อมูลสำเร็จ');
            await this.ListCompanyDataStore()
            await this.ListCompanyGetDelete()
          }
        }
      });
    },
    async ListCompanyDeleteBackupSubmit(ID, Level) {
      const ListData = await this.CheckListIDAndRoot(ID, 'DeleteBackup')
      sweetalert2.Delete('ลบข้อมูลถาวร', 'คุณแน่ใจใช่หรือไม่', ID, async res => {
        if (res[0].isConfirmed == true) {
          const ListCompanyStore = await useListCompanyStore()
          const SuccessResponses = [];
          const ErrorResponses = [];
          for (const item of ListData) {
            const response = await ListCompanyStore.DeleteBackup_ListCompany_ID_A(PiniaRoot.token.token, item.id);
            typeof response == 'string'
              ? ErrorResponses.push(response)
              : SuccessResponses.push(item.id);
          }
          const updatedData = await ListCompanyStore.$state.delete_data.filter(Delete => !SuccessResponses.includes(Delete.id) && Delete.level != Level);
          ListCompanyStore.$state.delete_data = updatedData;
          this.list_company_delete = updatedData;
          sweetalert2.success('ลบข้อมูลถาวรสำเร็จ');
          await this.ListCompanyDataStore()
          await this.ListCompanyGetDelete()
        }
      });
    },
    async ListCompanyRouter(data, Type) {
      const ListCompanyStore = await useListCompanyStore()
      ListCompanyStore.$state.data
      if (Type == 'list') {
        await this.FilterListCompany(data)
        const routerlistcompany = this.router.currentRoute.name == 'AdminListCompany'
          ? await this.router.push({
            path: '/admin/listcompany',
            query: { level: data.level + 1, id: data.id }
          })
          : '';
        this.list_company_show = await this.CheckRouter()
        // await this.CheckRouter()
        return routerlistcompany
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
      return !ID && !Level
        ? this.list_company.filter(item => item.root == null && item.level == 1)
        : this.list_company.filter(item => item.root == ID && item.level == Level)

    },
    async CheckListIDAndRoot(ID, key) {
      const Date = key == 'Delete'
        ? this.list_company
        : this.list_company_delete;
      const Array = []
      const ListID = await Date.find(item => item.id === ID);
      ListID ? Array.push(ListID) : '';
      await Promise.all(Date.map(async item => {
        if (item.root == ID) {
          const children = await tthis.CheckListIDAndRoo(item.id, key);
          Array.push(...children);
        }
      }));
      return Array
    },
    // เรียก ListPersonnelDataStore
    async ListPersonnelDataStore() {
      const ListPersonnelStore = await useListPersonnelStore()
      await ListPersonnelStore.Get_ListPersonnel_A(PiniaRoot.token.token)
      await ListPersonnelStore.$state.data
      this.list_personnel = ListPersonnelStore.$state.data
      this.dialog.select.list_personnel = this.list_personnel.map(({ id, topic }) => ({ id, topic }));
      this.dialog.select.list_personnel.splice(0, 0, { id: -1, topic: 'รวม' });
    },
    // checkbox
    async showDialogAdd() {
      this.AddDialog = true
      this.check_select = true
      if (this.route.query?.level) {
        this.dialog.input_add.level = parseInt(this.route.query.level)
        this.dialog.input_add.root = parseInt(this.route.query.id)
        const list_company_by_id = await this.Get_ListCompany_ID_A(PiniaRoot.token.token, this.route.query.id)
        const list_personnel_id = list_company_by_id[0].list_personnel_id
        if (list_personnel_id != null) {
          return this.check_select = false
        }
        else {
          this.dialog.input_add.select.list_personnel_id = list_personnel_id
        }
      }
      else {
        this.dialog.input_add.level = 1
        this.dialog.input_add.root = null
        this.check_select = true
      }
    },
    handleCheckboxChange(checkbox) {
      const otherCheckbox = checkbox === 1 ? this.checkbox2 : this.checkbox1;
      if (otherCheckbox) {
        this[checkbox === 1 ? 'checkbox2' : 'checkbox1'] = false;
      }
      this.dialog.input_add.data.topic = null
    },
    handleCheckboxChangeTypeAll(checkbox) {
      const otherCheckbox = checkbox === 1 ? this.checkbox4 : this.checkbox3;
      if (otherCheckbox) {
        this[checkbox === 1 ? 'checkbox4' : 'checkbox3'] = false;
      }
      this.DialogStatusCompany.input_add.data.data_list_company = null
    },
    validation(v) {
      return !!v || 'กรุณากรอบข้อมูล'
    },
    async FilterListCompany(data) {
      this.list_company_children = this.list_company.filter(item => item.root == data.id);
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
    async ListCompanyAddSubmit() {
      this.AddDialog = false
      const ListPersonnelStore = useListPersonnelStore()
      if (this.dialog.input_add.select.list_personnel_id == -1) this.dialog.input_add.select.list_personnel_id = null
      let company_id = this.token.DataUser.company_id
      let list_company_id = null
      let add_data = {
        topic: this.dialog.input_add.data.topic,
        level: this.dialog.input_add.level,
        root: this.dialog.input_add.root,
        company_id: company_id,
        list_personnel_id: this.dialog.input_add.select.list_personnel_id,
      }
      const response1 = await this.Add_ListCompany_ID_A(PiniaRoot.token.token, add_data);
      if (typeof response1 == 'string') {
        this.ResetOut('dialog.input_add')
        await sweetalert2.warning(response1)
      }
      else {
        list_company_id = response1.insertId
        await sweetalert2.success('สำเร็จ')
        this.list_personnel = ListPersonnelStore.$state.data
        await this.ListCompanyDataStore()
      }
      // api ดึงข้อมูลจาก type_all โดยใช้สิทธิ ยังไม่มี เลยกำหนดค่าแบบคงที่แทน
      if (this.checkbox2) {
        if (this.checkbox3) {
          this.DialogStatusCompany.input_add.type_all_id = 35
        }
        else {
          this.DialogStatusCompany.input_add.type_all_id = 36,
            this.DialogStatusCompany.input_add.data.data_list_company = JSON.stringify(this.DialogStatusCompany.input_add.data.data_list_company)
        }
        let add_data_status_company = {
          data_list_company: this.DialogStatusCompany.input_add.data.data_list_company,
          type_all_id: this.DialogStatusCompany.input_add.type_all_id,
          list_company_id: list_company_id,
        }
        // ข้อมูลจาก Input Add
        const response2 = await this.Add_StatusCompany_ID_A(PiniaRoot.token.token, add_data_status_company);
        if (typeof response2 == 'string') {
          this.ResetOut('dialog.input_add')
          this.ResetOut('DialogStatusCompany.input_add')
          await sweetalert2.warning(response2)
        }
        else {
          await sweetalert2.success('สำเร็จ')
          this.ResetOut('dialog.input_add')
          this.ResetOut('DialogStatusCompany.input_add')
          await this.ListCompanyDataStore()
        }
      } else {
        this.ResetOut('dialog.input_add')
      }
    },
    async ListCompanyGetID(data) {
      this.dialog.data_id.id = data.id
      this.dialog.data_id.level = data.level
      this.dialog.data_id.root = data.root
      this.dialog.data_id.data.topic = data.topic
      this.dialog.input_update.data.topic = data.topic
      this.dialog.data_id.data.create_time = data.create_time
      this.dialog.data_id.data.update_time = data.update_time
      if (data.list_personnel_id != null) {
        this.dialog.data_id.select.list_personnel_id = data.list_personnel_id
        this.dialog.data_id.select.list_personnel_topic = this.dialog.select.list_personnel.filter(items => items.id == data.list_personnel_id)[0].topic
      }
      else {
        this.dialog.data_id.select.list_personnel_id = null
        this.dialog.data_id.select.list_personnel_topic = 'รวม'
      }
      const StatusCompanyStore = await useStatusCompanyStore()
      const response1 = await this.Get_StatusCompany_A(PiniaRoot.token.token);
      if (typeof response1 == 'string') {
        this.ResetOut('dialog.input_add')
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
          this.DialogStatusCompany.data_id.data.data_list_company = new Delta(data_json?.ops)
          // เอาไปแสดงตรง Update
          // this.DialogStatusCompany.input_update.data.data_list_company = data_json.ops
          this.DialogStatusCompany.input_update.data.data_list_company = new Delta(data_json?.ops)
        }
      }
      else {
        this.DialogStatusCompany.data_id.type_all_id = null
      }
    },
    async ListCompanyUpdateSubmit(list_company_id, status_company_id) {
      const ListCompanyStore = useListCompanyStore()
      const temp_update1 = await ListCompanyStore.$state.data.find(p => p.id == list_company_id)
      let update_data = {
        topic: this.dialog.input_update.data.topic,
        company_id: this.token.DataUser.company_id,
      }
      const response1 = await this.Update_ListCompany_ID_A(PiniaRoot.token.token, update_data, list_company_id)
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
      if (status_company_id) {
        const StatusCompanyStore = useStatusCompanyStore()
        const temp_update2 = await StatusCompanyStore.$state.data.find(p => p.id == status_company_id)
        // ข้อมูลจาก Input Update
        let update_data_status_company = {
          data_list_company: JSON.stringify(this.DialogStatusCompany.input_update.data.data_list_company),
          type_all_id: temp_update2.type_all_id,
          list_company_id: list_company_id,
        }
        const response2 = await this.Update_StatusCompany_ID_A(PiniaRoot.token.token, update_data_status_company, status_company_id)
        if (typeof response2 == 'string') {
          this.ResetOut('dialog.input_update')
          this.ResetOut('DialogStatusCompany.input_update')
          await sweetalert2.warning(response2)
        }
        else {
          for (const key in this.dialog.input_update.data) {
            temp_update2[key] = update_data_status_company[key]
          }
          this.ResetOut('dialog.input_update')
          this.ResetOut('DialogStatusCompany.input_update')
          await sweetalert2.success('สำเร็จ')
        }
      } else {
        this.ResetOut('dialog.input_update')
      }
    },
    ResetOut(typ) {
      this.AddDialog = false
      this.DetailDialog = false
      this.check_select = false
      this.add_select = { id: -1, topic: 'รวม' }

      this.checkbox1 = true
      this.checkbox2 = false
      this.checkbox3 = false
      this.checkbox4 = false
      if (typ == "dialog.input_add") {
        Object.assign(this.$data.dialog.input_add, this.$options.data().dialog.input_add)
      } else if (typ == "dialog.input_update") {
        Object.assign(this.$data.dialog.input_update, this.$options.data().dialog.input_update);
      } else if (typ == "DialogStatusCompany.input_add") {
        Object.assign(this.$data.DialogStatusCompany.input_add, this.$options.data().DialogStatusCompany.input_add);
      } else {
        Object.assign(this.$data.DialogStatusCompany.input_update, this.$options.data().DialogStatusCompany.input_update);
      }
    },
    async getRoute() {
      this.route = this.$route
      await this.ListCompanyDataStore()
      await this.ListCompanyGetDelete()
    },
  },
  watch: {
    async $route() {
      await this.getRoute()
    },
  },
}
</script>
<style>
html {
  scroll-behavior: smooth !important;
}
</style>