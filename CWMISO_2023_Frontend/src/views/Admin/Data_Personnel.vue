<script setup>
import sweetalert2 from '@/assets/js/controller/switchalert'
import { mapActions } from 'pinia'
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useDataPersonnelStore, useTokenStore, PiniaRoot } from '@/stores/'
import useHandlePage from '@/utils/handlePage'
import useHandleDatetime from '@/utils/handleDatetime'
import loading3 from '@/components/Loading-Layout-List-Col2.vue'

import Title from '@/utils/Title'
import Dialog from '@/components/Dialog.vue'
import LayoutListDelete from '@/components/Layout-List-Delete.vue'

const { name } = useDisplay()

</script>

<template>
  <div class="w-full h-full">
    <div class="p-5 space-y-5 w-full h-full">
      <h1 class="text-3xl">{{ view_bin ? 'ถังขยะของบุคลากร' : 'บุคลากร' }}</h1>
      <!-- <div class="flex justify-between">
            <v-card class="rounded-pill" elevation="1" width="50%">
                <v-text-field v-model="searchData" density="compact" variant="solo" label="Search your Name"
                    append-inner-icon="mdi-magnify" single-line hide-details>
                </v-text-field>
            </v-card>
            <v-btn color="deep-purple" @click="onShowDialog('add')" v-bind="props">Add New</v-btn>
        </div> -->

      <!-- เช็คหน้า -->
      <div class="" v-if="(view_bin == false && !data_personnel?.loading)">
        <!-- ไม่กดกู้ข้อมูล -->
        <div class="flex justify-end">
          <v-sheet class="space-x-2">
            <v-btn color="brown" @click="changeView(true)" v-bind="props"><v-icon start>mdi
                mdi-delete-clock</v-icon>ถังขยะ
            </v-btn>
            <v-btn :color="color_Personnel_button_updata" @click="edit_data">
              <v-icon start>mdi-border-color</v-icon>
              {{ update_data ? 'ยกเลิก' : 'แก้ไขบุคลากร' }}
            </v-btn>
          </v-sheet>
        </div>
        <h1 v-if="!data_personnel?.length" class="text-2xl flex justify-center">ไม่มีข้อมูล</h1>
        <!-- ใช้อันนี้ -->
        <div v-for="n in row" :key="n">
          <v-row @drop="onDrop($event, n)" @dragenter.prevent @dragover.prevent>
            <v-card class="pa-4 ma-3 d-flex justify-center align-center" :color="color_Personnel">
              <v-row v-if="update_data == true">
                <!-- ข้อมูล -->
                <v-card v-for="item in filteredData_by_level(n) " width="200" :key="item.id"
                  class="drag-el py-6 px-4 ma-2 rounded-xl text-xs text-sm-caption text-md-body-2 text-lg-body-1"
                  :draggable="update_data" @dragstart="startDrag($event, item)">

                  <v-row class="d-flex justify-center">
                    <v-avatar size="120" color="grey-darken-2" class="rounded-full">
                      <v-img v-if="item.photo" width="200" :aspect-ratio="1" cover :src="item.photo"></v-img>
                      <font-awesome-icon v-else icon="image" class="w-auto h-12 text-white align-end" />
                    </v-avatar>
                  </v-row>

                  <v-row>
                    <v-col col="12" class="d-flex flex-wrap items-center justify-center pa-0" color="transparent">
                      <v-span>
                        <br />
                        <v-span>
                          <p v-if="item.name"> {{ item.name }}</p><br v-else />
                        </v-span>
                        <v-span>
                          <p v-if="item.position"> {{ item.position }}</p><br v-else />
                        </v-span>
                        <br />
                      </v-span>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col col="12" class="d-flex flex-wrap items-center justify-center pa-0" color="transparent">
                      <div class="text-center">
                        <v-btn color="blue-accent-3" class="mr-1" size="40" icon=""
                          @click="onShowDialog('detail'), DataPersonnelGetID(item.id)" v-bind="props">
                          <v-icon icon="mdi mdi-text-box-edit"></v-icon>
                          <v-tooltip activator="parent" location="bottom">รายละเอียด</v-tooltip>
                        </v-btn>
                        <v-btn color="red-darken-1" class="mr-1" size="40" icon="" @click="DataPersonnelDelete(item.id)">
                          <v-icon icon="mdi mdi-delete"></v-icon>
                          <v-tooltip activator="parent" location="bottom">ลบ</v-tooltip>
                        </v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </v-card>

                <v-card v-if="filteredData_by_level(n)?.length < 1" width="200" color="blue-grey-lighten-4"
                  class="drag-el py-6 px-4 ma-2 rounded-xl text-xs text-sm-caption text-md-body-2 text-lg-body-1">
                </v-card>

                <div class="d-flex justify-center align-center">
                  <v-btn color="blue-accent-3" class="mr-1" size="40" icon="" @click="onShowDialog('add', n)"
                    v-bind="props">
                    <v-icon icon="mdi mdi-plus-circle"></v-icon>
                    <v-tooltip activator="parent" location="bottom">เพิ่มบุคลากร</v-tooltip>
                  </v-btn>
                </div>
              </v-row>

              <v-row v-else>
                <!-- ข้อมูล -->
                <v-card v-for="item in filteredData_by_level(n) " width="200" :key="item.id"
                  class="drag-el py-6 px-4 ma-2 rounded-xl text-xs text-sm-caption text-md-body-2 text-lg-body-1">

                  <v-row class="d-flex justify-center">
                    <v-avatar size="120" color="grey-darken-2" class="rounded-full">
                      <v-img v-if="item.photo" width="200" :aspect-ratio="1" cover :src="item.photo"></v-img>
                      <font-awesome-icon v-else icon="image" class="w-auto h-12 text-white align-end " />
                    </v-avatar>
                  </v-row>

                  <v-row>
                    <v-col col="12" class="d-flex flex-wrap items-center justify-center pa-0" color="transparent">
                      <v-span>
                        <br />
                        <v-span>
                          <p v-if="item.name"> {{ item.name }}</p><br v-else />
                        </v-span>
                        <v-span>
                          <p v-if="item.position"> {{ item.position }}</p><br v-else />
                        </v-span>
                        <br />
                      </v-span>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col col="12" class="d-flex flex-wrap items-center justify-center pa-0" color="transparent">
                      <div class="text-center">
                        <v-btn color="blue-accent-3" class="mr-1" size="40" icon=""
                          @click="onShowDialog('detail'), DataPersonnelGetID(item.id)" v-bind="props">
                          <v-icon icon="mdi mdi-text-box-edit"></v-icon>
                          <v-tooltip activator="parent" location="bottom">รายละเอียด</v-tooltip>
                        </v-btn>
                        <v-btn color="red-darken-1" class="mr-1" size="40" icon="" @click="DataPersonnelDelete(item.id)">
                          <v-icon icon="mdi mdi-delete"></v-icon>
                          <v-tooltip activator="parent" location="bottom">ลบ</v-tooltip>
                        </v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </v-card>

                <v-card v-if="filteredData_by_level(n)?.length < 1" width="200" color="blue-grey-lighten-4"
                  class="drag-el py-6 px-4 ma-2 rounded-xl text-xs text-sm-caption text-md-body-2 text-lg-body-1">
                </v-card>
              </v-row>

            </v-card>
          </v-row>
        </div>

        <!-- เพิ่มแถว -->
        <div v-if="update_data == true" class="d-flex justify-start align-center">
          <v-card width="200" class="pa-4 ma-3 d-flex justify-center align-center" color="blue-grey-lighten-4">
          </v-card>
          <v-btn color="blue-accent-3" class="mr-1" size="40" icon="" @click="addRow">
            <v-icon icon="mdi mdi-plus-circle"></v-icon>
            <v-tooltip activator="parent" location="bottom">เพิ่มแถว</v-tooltip>
          </v-btn>
        </div>

        <!-- บันทึก -->
        <v-row class="d-flex justify-center align-center ">
          <v-btn v-if="update_data == true" color="green" @click="update_data_personnel_drop" :loading="loading">
            บันทึก
          </v-btn>
        </v-row>

        <!-- dialog -->
        <v-dialog class="z-0" v-model="showDialog" width="1024" persistent>
          <Dialog :dialog="dialog" v-on:out="reset" v-on:add="DataPersonnelAddSubmit"
            v-on:update="DataPersonnelUpdateSubmit" v-on:delete="DataPersonnelDelete">
          </Dialog>
        </v-dialog>
      </div>

      <!-- เช็คหน้า -->
      <div class="" v-if="(view_bin == true)">
        <!-- กดกู้ข้อมูล -->
        <div class="flex justify-end p-4">
          <v-sheet class="space-x-2">
            <v-btn color="grey-darken-1" @click="changeView(false)" v-bind="props"><v-icon
                start>mdi-arrow-left</v-icon>ย้อนกลับ</v-btn>
          </v-sheet>
        </div>

        <v-row no-gutters v-if="delete_data_personnel?.length">
          <LayoutListDelete :layout="displayed" v-on:restore="DataPersonnelUnDelete"
            v-on:deletebackup="DataPersonnelDeleteBackup" />
        </v-row>

        <h1 v-if="!delete_data_personnel?.length" class="text-2xl flex justify-center">ไม่มีข้อมูล</h1>

        <v-pagination v-if="(searchData == '' && delete_data_personnel?.length)" class="page" v-model="currentPage"
          :length="totalPages"></v-pagination>
      </div>

      <div v-if="(data_personnel?.loading)">
        <loading3 />
      </div>

      <!-- <p>id : {{ data.id }}</p>
                <p>position : {{ data.position }}</p>
                <p>name : {{ data.name }}</p>
                <p>photo : {{ data.photo }}</p>
                <p>tel : {{ data.tel }}</p>
                <p>file : {{ data.file }}</p>
                <p>level : {{ data.level }}</p>
                <p>root : {{ data.root }}</p>
                <p>list_personnel_id : {{ data.list_personnel_id }}</p>
                <p>วันที่สร้าง : {{ data.create_time }}</p>
                <p>วันที่อัปเดต : {{ data.update_time }}</p>
                <p>สถานะลบ : {{ data.delete_status }}</p>
                <p>superadmin_id : {{ data.superadmin_id }}</p>
                <p>admin_id : {{ data.admin_id }}</p>
                <p>user_id : {{ data.user_id }}</p> -->

    </div>
  </div>
</template>

<script>
// import { ref, defineComponent } from 'vue';
export default {
  setup() { },
  // components: {
  //     draggable,
  // },
  data() {
    return {
      view_bin: false,
      route: null,

      data_personnel: [],
      data_personnel_id: null,
      delete_data_personnel: null,

      token: null,

      update_data: false,
      color_Personnel: 'blue-grey-lighten-4',
      color_Personnel_button_updata: 'deep-purple',
      row: 0,
      edit_data_for_save: [],

      list: [],
      itemsPerPage: 12,
      currentPage: 1,

      searchData: '',

      showDialog: false,
      dialog: {
        type: null,
        base64String: null,
        FileBase64: null,
        input_add: {
          level: null,
          data: {
            name: null,
            position: null,
            tel: null,
          },
          image: {
            photo: null,
          },
          file_input: {
            file: null
          }
        },
        input_update: {
          data: {
            name: null,
            position: null,
            tel: null,
          },
          image: {
            photo: null
          },
          file_input: {
            file: null
          }
        },
        data_id: {
          id: null,
          data: {
            name: null,
            position: null,
            tel: null,
            create_time: null,
            update_time: null,
          },
          image: {
            photo: null
          },
          file_input: {
            file: null
          }
        },
        title: {
          id: Title().id,
          name: Title().name,
          tel: Title().tel,
          file: Title().file,
          position: Title().position,
          list_personnel_id: Title().list_personnel_id,
          level: Title().level,
          root: Title().root,
          photo: Title().photo,
          create_time: Title().create_time,
          update_time: Title().update_time
        }
      },
      layout: {
        type: "detail",
        id: null,
        data: {
          name: null,
          position: null,
        },
        image: {
          photo: null
        },
      },
    }
  },
  watch: {
    $route() {
      this.getRoute()
    }
  },
  computed: {
    displayed() {
      if (this.currentPage > this.totalPages) this.currentPage = this.totalPages
      const respones = this.list != '' && this.currentPage != ''
        ? useHandlePage.getdata_pages(this.currentPage, this.itemsPerPage, this.list)
        : ''

      const data = this.searchData != ''
        ? this.filtered
        : this.list.slice(respones[0], respones[1])

      this.layout.id = data.map((data) => data.id)
      this.layout.data = data.map(({ name, position }) => ({ name, position }));
      this.layout.image.photo = data.map((data) => data.photo)
      return this.layout
    },
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
  },
  async created() {
    this.getRoute()
    this.token = await useTokenStore().DeCode(PiniaRoot.token.token)
    this.DataPersonnelDataStore()
    this.DataPersonnelGetDelete()
  },
  methods: {
    ...mapActions(useDataPersonnelStore, ['Get_DataPersonnel_A', 'Get_DataPersonnel_ID_A', 'Add_DataPersonnel_ID_A', 'Update_DataPersonnel_ID_A', 'Delete_DataPersonnel_ID_A', 'Get_Delete_DataPersonnel_A', 'UnDelete_DataPersonnel_ID_A', 'DeleteBackup_DataPersonnel_ID_A', 'Filter_DataPersonnel_By_Company_ID']),
    getRoute() {
      this.route = this.$route
    },
    //  หาข้อมูลเฉพาะที่มีการส่ง id มาจากหน้า รายการบุคกร
    filteredData_by_list_personnel() {
      let queryID = this.route?.query?.id
      this.data_personnel = this.data_personnel.filter((item) => item.list_personnel_id == queryID);
    },
    //// ค่าที่มากที่สุดของ Level ส่งให้ row
    findMaxList() {
      // ใช้ reduce เพื่อหาค่าที่มากที่สุดของ Level
      const maxLevel = this.data_personnel.reduce((max, item) => { return item.level > max ? item.level : max; }, 0);
      this.row = maxLevel
      return maxLevel;
    },
    /// เพิ่มแถว
    addRow() {
      // เพิ่มค่า row ขึ้นอีก 1
      this.row += 1;
    },
    //// หาว่าแต่ละ row filter เฉพาะที่มีการส่ง id มาจากหน้า รายการบุคกร
    filteredData_by_level(level) {
      return this.data_personnel.filter((item) => item.level === level);
    },
    /// เมื่อมีการกดลาก
    startDrag(event, item) {
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('itemID', item.id)

    },
    //// เมื่อมีการวาง
    onDrop(event, level) {
      const itemID = parseInt(event.dataTransfer.getData('itemID'))
      const items = this.data_personnel.find((item) => item.id === itemID);
      // const item = this.data_personnel.value.find((item) => item.id == itemID)
      items.level = level
    },
    // มีการกดแก้ไข จะเปลี่นสี ข้อมูล และ ปุ่ม
    edit_data() {
      this.update_data = !this.update_data
      this.color_Personnel = this.color_Personnel === 'blue-grey-lighten-4' ? 'blue-lighten-3' : 'blue-grey-lighten-4';
      this.color_Personnel_button_updata = this.color_Personnel_button_updata === 'deep-purple' ? 'grey-darken-1' : 'deep-purple';

    },
    // save updata data personnel drop
    async update_data_personnel_drop() {
      this.update_data = false
      this.color_Personnel = this.color_Personnel === 'blue-grey-lighten-4' ? 'blue-lighten-3' : 'blue-grey-lighten-4';
      this.color_Personnel_button_updata = this.color_Personnel_button_updata === 'deep-purple' ? 'grey-darken-1' : 'deep-purple';
      const DataPersonnelStore = useDataPersonnelStore()
      await this.Get_DataPersonnel_A(PiniaRoot.token.token)
      this.edit_data_for_save = DataPersonnelStore.data

      let queryID = this.route?.query?.id
      this.edit_data_for_save = this.edit_data_for_save.filter((item) => item.list_personnel_id == queryID)
      // this.edit_data_for_save ข้อมูลเดิมจาก Database
      // this.data_personnel ข้อมูลใหม่จาก state
      let c = false
      for (let i = 0; i < this.edit_data_for_save?.length; i++) {
        if (this.edit_data_for_save[i].id == this.data_personnel[i].id && this.edit_data_for_save[i].level != this.data_personnel[i].level) {
          let update_data = { level: this.data_personnel[i].level }
          const response = await this.Update_DataPersonnel_ID_A(PiniaRoot.token.token, update_data, this.edit_data_for_save[i].id)
          if (typeof response == 'string') {
            this.reset('dialog.input_update')
            await sweetalert2.warning(response)
            break
          }
          else {
            c = true
            this.edit_data_for_save[i].level = this.data_personnel[i].level
            this.edit_data_for_save[i].update_time = useHandleDatetime.isoStrToLocalStr(new Date())
            this.data_personnel[i].update_time = useHandleDatetime.isoStrToLocalStr(new Date())
            this.findMaxList()
          }
        }
      }
      if (c) {
        this.reset('dialog.input_update')
        await sweetalert2.success('สำเร็จ')
      }
    },
    //// กู่คืน
    async changeView(type) {
      this.view_bin = type;
      this.view_bin == false
        ? this.list = this.data_personnel
        : this.list = this.delete_data_personnel
      this.currentPage = 1
    },
    //// เรียกใช้ dialog
    async onShowDialog(type, level) {
      this.showDialog = true
      this.dialog.type = type
      this.dialog.input_add.level = level
    },
    //// เรียกข้อมูลใส่ create <Function Get Add Update Delete Get_Delete UnDelete DeleteBackup>
    async DataPersonnelDataStore() {
      // เรียกข้อมูลมาเก็บไว้
      const DataPersonnelStore = useDataPersonnelStore()
      this.data_personnel = { loading: true }
      const response = await this.Get_DataPersonnel_A(PiniaRoot.token.token)
      if (typeof response == 'string') {
        await sweetalert2.warning(response)
      }
      this.data_personnel = await DataPersonnelStore.$state.data
      this.filteredData_by_list_personnel()
      this.findMaxList();
      return this.list = this.data_personnel
    },
    async DataPersonnelGetID(id) {
      //getid
      const DataPersonnelStore = useDataPersonnelStore()
      this.data_personnel_id = { loading: true }
      const response = await this.Get_DataPersonnel_A(PiniaRoot.token.token)
      if (typeof response == 'string') {
        await sweetalert2.warning(response)
      }
      this.data_personnel_id = await DataPersonnelStore.$state.data.find(p => p.id == id)
      if (!this.data_personnel_id) {
        this.data_personnel_id = { loading: true }
        const response = await this.Get_DataPersonnel_ID_A(PiniaRoot.token.token, id)
        if (typeof response == 'string') {
          await sweetalert2.warning(response)
        }
        this.data_personnel_id = DataPersonnelStore.data_id
      }
      this.dialog.data_id.id = id
      for (const key in this.data_personnel_id) {
        if (this.dialog.data_id.data[key] !== undefined) {
          this.dialog.data_id.data[key] = this.data_personnel_id[key]
        } else if (this.dialog.data_id.image[key] !== undefined) {
          this.dialog.data_id.image[key] = this.data_personnel_id[key]
        } else if (this.dialog.data_id.file_input[key] !== undefined) {
          let data_obj = JSON.parse(this.data_personnel_id['file']);
          if (data_obj != null) {
            this.dialog.data_id.file_input[key] = data_obj.name
            this.dialog.FileBase64 = data_obj.data
          } else {
            this.dialog.data_id.file_input[key] = null
          }
        }

        if (this.dialog.input_update.data[key] !== undefined) {
          this.dialog.input_update.data[key] = this.data_personnel_id[key]
        } else if (this.dialog.input_update.image[key] !== undefined) {
          this.dialog.input_update.image[key] = this.data_personnel_id[key]
          this.dialog.base64String = this.data_personnel_id[key]
        } else if (this.dialog.input_update.file_input[key] !== undefined) {
          let data_obj = JSON.parse(this.data_personnel_id['file']);
          if (data_obj != null) {
            this.dialog.input_update.file_input[key] = data_obj.name
            this.dialog.FileBase64 = data_obj.data
          } else {
            this.dialog.input_update.file_input[key] = null
          }
        }
      }
    },
    async DataPersonnelAddSubmit(datas) {
      // add เพิ่มข้อมูล
      let queryID = this.route?.query?.id
      let add_data = {
        ...datas.data, ...datas.image, ...datas.file_input, level: datas.level,
        list_personnel_id: queryID,
      }
      const response = await this.Add_DataPersonnel_ID_A(PiniaRoot.token.token, add_data);
      if (typeof response == 'string') {
        this.reset('dialog.input_add')
        await sweetalert2.warning(response)
      }
      else {
        this.reset('dialog.input_add')
        await sweetalert2.success('สำเร็จ')
      }

      this.reset('dialog.input_add')

      this.DataPersonnelDataStore()
    },
    async DataPersonnelUpdateSubmit(id, datas) {
      //updatae
      const DataPersonnelStore = useDataPersonnelStore()
      const temp_update = await DataPersonnelStore.$state.data.find(p => p.id == id)
      let update_data = {
        ...datas.data, ...datas.image, ...datas.file_input, level: datas.level,
      }
      if (!datas.file_input.file) {
        delete update_data.file
      }
      const response = await this.Update_DataPersonnel_ID_A(PiniaRoot.token.token, update_data, id)
      if (typeof response == 'string') {
        this.reset('dialog.input_update')
        await sweetalert2.warning(response)
      }
      else {
        temp_update.name = update_data.name;
        temp_update.position = update_data.position
        temp_update.tel = update_data.tel
        temp_update.photo = update_data.photo
        // temp_update.root = update_data.root
        temp_update.update_time = useHandleDatetime.isoStrToLocalStr(new Date())
        this.data_personnel = DataPersonnelStore.$state.data
        this.filteredData_by_list_personnel()
        this.list = this.data_personnel
        // this.list = DataPersonnelStore.$state.data
        this.reset('dialog.input_update')
        await sweetalert2.success('สำเร็จ')
      }
    },
    async DataPersonnelDelete(id) {
      // ลบข้อมูล
      sweetalert2.Delete('ลบข้อมูล', 'คุณแน่ใจใช่หรือไม่', id, async res => {
        if (res[0].isConfirmed == true) {
          const DataPersonnelStore = useDataPersonnelStore()
          const response = await this.Delete_DataPersonnel_ID_A(PiniaRoot.token.token, id);
          if (typeof response == 'string') {
            await sweetalert2.warning(response)
          }
          else {
            const temp_Delete = await DataPersonnelStore.$state.data.find(p => p.id == id)
            await DataPersonnelStore.$state.delete_data.push(temp_Delete)
            DataPersonnelStore.$state.data = await DataPersonnelStore.$state.data.filter((Delete) => Delete.id != id);
            this.data_personnel = DataPersonnelStore.$state.data
            this.list = this.data_personnel
            sweetalert2.success('สำเร็จ')
          }
        };
      });
    },
    async DataPersonnelGetDelete() {
      const DataPersonnelStore = useDataPersonnelStore()
      this.delete_data_personnel = { loading: true }
      const response = await this.Get_Delete_DataPersonnel_A(PiniaRoot.token.token)
      if (typeof response == 'string') {
        await sweetalert2.warning(response)
      }
      this.delete_data_personnel = DataPersonnelStore.$state.delete_data
    },
    async DataPersonnelUnDelete(id) {
      // กู้คืน
      sweetalert2.Delete('กู้คืนข้อมูล', 'คุณแน่ใจใช่หรือไม่', id, async res => {
        if (res[0].isConfirmed == true) {
          const DataPersonnelStore = useDataPersonnelStore()
          const response = await this.UnDelete_DataPersonnel_ID_A(PiniaRoot.token.token, id);
          if (typeof response == 'string') {
            await sweetalert2.warning(response)
          }
          else {
            const temp_UnDelete = await DataPersonnelStore.$state.delete_data.find(p => p.id == id)
            let i = 0
            while (i < this.data_personnel?.length && this.data_personnel[i].id < temp_UnDelete.id) i++
            await DataPersonnelStore.$state.data.splice(i, 0, temp_UnDelete)

            DataPersonnelStore.$state.delete_data = await DataPersonnelStore.$state.delete_data.filter((UnDelete) => UnDelete.id != id);
            this.delete_data_personnel = DataPersonnelStore.$state.delete_data
            this.list = this.delete_data_personnel
            sweetalert2.success('สำเร็จ')
          }
        };
      });
    },
    async DataPersonnelDeleteBackup(id) {
      // ลบถาวร
      sweetalert2.Delete('ลบข้อมูลถาวร', 'คุณแน่ใจใช่หรือไม่', id, async res => {
        if (res[0].isConfirmed == true) {
          const DataPersonnelStore = useDataPersonnelStore()
          const response = await this.DeleteBackup_DataPersonnel_ID_A(PiniaRoot.token.token, id);
          if (typeof response == 'string') {
            await sweetalert2.warning(response)
          }
          else {
            DataPersonnelStore.$state.delete_data = await DataPersonnelStore.$state.delete_data.filter((UnDelete) => UnDelete.id != id);
            this.delete_data_personnel = DataPersonnelStore.$state.delete_data
            this.list = this.delete_data_personnel
            sweetalert2.success('สำเร็จ')
          }
        };
      });
    },
    async reset(nameinput) {
      this.showDialog = false;
      this.dialog.base64String = null
      this.dialog.FileBase64 = null
      nameinput == "dialog.input_add"
        ? Object.assign(this.$data.dialog.input_add, this.$options.data().dialog.input_add)
        : Object.assign(this.$data.dialog.input_update, this.$options.data().dialog.input_update);
    },
  }
}
</script>
<style>
html {
  scroll-behavior: smooth !important;
}
</style>
