<script setup>
import sweetalert2 from '@/assets/js/controller/switchalert'
import { mapActions } from 'pinia'
import { computed } from 'vue'
import { useTypeAllStore, useTokenStore, PiniaRoot } from '@/stores/'
import PictureInput from 'vue-picture-input'
import useHandlePage from '@/utils/handlePage'
import useHandleDatetime from '@/utils/handleDatetime'
import loading3 from '@/components/Loading-Layout-List-Col2.vue'

import Title from '@/utils/Title'
import Dialog from '@/components/Dialog.vue'
import LayoutList from '@/components/Layout-List.vue'
import LayoutListDelete from '@/components/Layout-List-Delete.vue'
</script>

<template>
  <div class="p-5 space-y-5 w-full h-auto" id="all">
    <h1 class="text-3xl">{{ view_bin ? 'ถังขยะของประเภทไฟล์' : 'ประเภทไฟล์' }}</h1>


    <div class="" v-if="(view_bin == false && !type_all?.loading)">
      <div class="flex justify-end p-4">
        <v-sheet class="space-x-2 bg-transparent">
          <v-btn color="brown" @click="changeView(true)" v-bind="props"><v-icon start>mdi
              mdi-delete-clock</v-icon>ถังขยะ</v-btn>
          <v-btn color="deep-purple" @click="onShowDialog('add')" v-bind="props"><v-icon start>mdi
              mdi-plus</v-icon>เพิ่มประเภทไฟล์</v-btn>
        </v-sheet>
      </div>

      <v-row no-gutters v-if="type_all?.length">
        <LayoutList :layout="displayed" v-on:showDialog="onShowDialog" v-on:getid="TypeAllGetID"
          v-on:delete="TypeAllDelete" />
      </v-row>

      <h1 v-if="!type_all?.length" class="text-2xl flex justify-center">ไม่มีข้อมูล</h1>

      <v-pagination v-if="(searchData == '' && type_all?.length)" class="page" v-model="currentPage"
        :length="totalPages"></v-pagination>

      <v-dialog class="z-0 " v-model="showDialog" width="1024" persistent>
        <Dialog :dialog="dialog" v-on:out="reset" v-on:add="TypeAllAddSubmit" v-on:update="TypeAllUpdateSubmit"
          v-on:delete="TypeAllDelete">
        </Dialog>
      </v-dialog>
    </div>

    <div class="" v-if="(view_bin == true && !delete_type_all?.loading)">
      <div class="flex justify-end p-4">
        <v-sheet class="space-x-2 bg-transparent">
          <v-btn color="grey-darken-1" @click="changeView(false)" v-bind="props"><v-icon
              start>mdi-arrow-left</v-icon>ย้อนกลับ</v-btn>
        </v-sheet>
      </div>

      <v-row no-gutters v-if="delete_type_all?.length">
        <LayoutListDelete :layout="displayed" v-on:restore="TypeAllUnDelete" v-on:deletebackup="TypeAllDeleteBackup" />
      </v-row>

      <h1 v-if="!delete_type_all?.length" class="text-2xl flex justify-center">ไม่มีข้อมูล</h1>

      <v-pagination v-if="(searchData == '' && delete_type_all?.length)" class="page" v-model="currentPage"
        :length="totalPages"></v-pagination>
    </div>

    <div v-if="(type_all?.loading || delete_type_all?.loading)">
      <loading3 />
    </div>

  </div>
</template>

<script>
export default {
  name: 'TypeAll',
  setup() {
  },
  data() {
    return {
      view_bin: false,

      type_all: null,
      type_all_id: null,
      delete_type_all: null,

      list: [1],
      itemsPerPage: 4,
      currentPage: 1,

      searchData: '',

      showDialog: false,
      dialog: {
        type: null,
        input_add: {
          data: {
            name: null,
            type: null,
          },
        },
        input_update: {
          data: {
            name: null,
            type: null,
          },
        },
        data_id: {
          id: null,
          data: {
            name: null,
            type: null,
            create_time: null,
            update_time: null,
          }
        },
        title: {
          name: "ชื่อประเภทไฟล์",
          type: "ประเภทไฟล์",
          create_time: Title().create_time,
          update_time: Title().update_time,
        }
      },
      layout: {
        type: "detail",
        id: [],
        data: [],
        title: {
          name: "ชื่อประเภทไฟล์",
          type: "ประเภทไฟล์",
        },
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
      const respones = this.list != '' && this.currentPage != ''
        ? useHandlePage.getdata_pages(this.currentPage, this.itemsPerPage, this.list)
        : ''

      const data = this.searchData != ''
        ? this.filtered
        : this.list.slice(respones[0], respones[1])

      this.layout.id = data.map((data) => data.id)
      this.layout.data = data.map(({ name, type }) => ({ name, type }));
      return this.layout
    }
  },
  async created() {
    this.TypeAllDataStore()
    this.TypeAllGetDelete()
  },
  methods: {
    ...mapActions(useTypeAllStore, ['Get_TypeAll_S', 'Get_TypeAll_ID_S', 'Add_TypeAll_ID_S', 'Update_TypeAll_ID_S',
      'Delete_TypeAll_ID_S', 'Get_Delete_TypeAll_S', 'UnDelete_TypeAll_ID_S', 'DeleteBackup_TypeAll_ID_S']),
    async onShowDialog(type) {
      this.showDialog = true;
      this.dialog.type = type;
    },
    async changeView(type) {
      this.view_bin = type;
      this.view_bin == false
        ? this.list = this.type_all
        : this.list = this.delete_type_all
      this.currentPage = 1
    },
    async TypeAllDataStore() {
      const TypeAllStore = useTypeAllStore()
      this.type_all = { loading: true }
      const response = await this.Get_TypeAll_S(PiniaRoot.token.token)
      if (typeof response == 'string') {
        await sweetalert2.warning(response)
      }
      this.type_all = TypeAllStore.$state.data
      this.list = this.type_all
    },
    async TypeAllGetID(id) {
      const TypeAllStore = useTypeAllStore()
      this.type_all_id = { loading: true }
      const response = await this.Get_TypeAll_S(PiniaRoot.token.token)
      if (typeof response == 'string') {
        await sweetalert2.warning(response)
      }
      this.type_all_id = await TypeAllStore.$state.data.find(p => p.id == id)
      if (!this.type_all_id) {
        this.type_all_id = { loading: true }
        const response = await this.Get_TypeAll_ID_S(PiniaRoot.token.token, id)
        if (typeof response == 'string') {
          await sweetalert2.warning(response)
        }
        this.type_all_id = TypeAllStore.$state.data_id
      }
      this.dialog.data_id.id = id
      for (const key in this.type_all_id) {
        if (this.dialog.data_id.data[key] !== undefined) {
          this.dialog.data_id.data[key] = this.type_all_id[key]
        }
        if (this.dialog.input_update.data[key] !== undefined) {
          this.dialog.input_update.data[key] = this.type_all_id[key]
        }
      }
    },
    async TypeAllAddSubmit(datas) {
      const data_token = await useTokenStore().DeCode(PiniaRoot.token.token)
      let add_data = { ...datas.data }
      const response = await this.Add_TypeAll_ID_S(PiniaRoot.token.token, add_data);
      if (typeof response == 'string') {
        this.reset('dialog.input_add')
        await sweetalert2.warning(response)
      }
      else {
        this.reset('dialog.input_add')
        await sweetalert2.success('สำเร็จ')
      }
      this.TypeAllDataStore()
    },
    async TypeAllUpdateSubmit(id, datas) {
      const data_token = await useTokenStore().DeCode(PiniaRoot.token.token)
      const TypeAllStore = useTypeAllStore()
      const temp_update = await TypeAllStore.$state.data.find(p => p.id == id)
      let update_data = { ...datas.data }
      const response = await this.Update_TypeAll_ID_S(PiniaRoot.token.token, update_data, id)
      if (typeof response == 'string') {
        this.reset('dialog.input_update')
        await sweetalert2.warning(response)
      }
      else {
        for (const key in this.dialog.input_update.data) {
          temp_update[key] = update_data[key]
        }
        temp_update.update_time = useHandleDatetime.isoStrToLocalStr(new Date())
        this.type_all = TypeAllStore.$state.data
        this.list = this.type_all
        this.reset('dialog.input_update')
        await sweetalert2.success('สำเร็จ')
      }
    },
    async TypeAllDelete(id) {
      sweetalert2.Delete('ลบข้อมูล', 'คุณแน่ใจใช่หรือไม่', id, async res => {
        if (res[0].isConfirmed == true) {
          const TypeAllStore = useTypeAllStore()
          const response = await this.Delete_TypeAll_ID_S(PiniaRoot.token.token, id);
          if (typeof response == 'string') {
            await sweetalert2.warning(response)
          }
          else {
            const temp_Delete = await TypeAllStore.$state.data.find(p => p.id == id)
            await TypeAllStore.$state.delete_data.push(temp_Delete)
            TypeAllStore.$state.data = await TypeAllStore.$state.data.filter((Delete) => Delete.id != id);
            this.type_all = TypeAllStore.$state.data
            this.list = this.type_all
            sweetalert2.success('สำเร็จ')
          }
        };
      });
    },
    async TypeAllGetDelete() {
      const TypeAllStore = useTypeAllStore()
      if (TypeAllStore.$state.delete_data == null) {
        const response = await this.Get_Delete_TypeAll_S(PiniaRoot.token.token)
        if (typeof response == 'string') {
          await sweetalert2.warning(response)
        }
      }
      this.delete_type_all = TypeAllStore.$state.delete_data
    },
    async TypeAllUnDelete(id) {
      sweetalert2.Delete('กู้คืนข้อมูล', 'คุณแน่ใจใช่หรือไม่', id, async res => {
        if (res[0].isConfirmed == true) {
          const TypeAllStore = useTypeAllStore()
          const response = await this.UnDelete_TypeAll_ID_S(PiniaRoot.token.token, id);
          if (typeof response == 'string') {
            await sweetalert2.warning(response)
          }
          else {
            const temp_UnDelete = await TypeAllStore.$state.delete_data.find(p => p.id == id)
            let i = 0
            while (i < this.type_all?.length && this.type_all[i].id < temp_UnDelete.id) i++
            await TypeAllStore.$state.data.splice(i, 0, temp_UnDelete)

            TypeAllStore.$state.delete_data = await TypeAllStore.$state.delete_data.filter((UnDelete) => UnDelete.id != id);
            this.delete_type_all = TypeAllStore.$state.delete_data
            this.list = this.delete_type_all
            sweetalert2.success('สำเร็จ')
          }
        };
      });
    },
    async TypeAllDeleteBackup(id) {
      sweetalert2.Delete('ลบข้อมูลถาวร', 'คุณแน่ใจใช่หรือไม่', id, async res => {
        if (res[0].isConfirmed == true) {
          const TypeAllStore = useTypeAllStore()
          const response = await this.DeleteBackup_TypeAll_ID_S(PiniaRoot.token.token, id);
          if (typeof response == 'string') {
            await sweetalert2.warning(response)
          }
          else {
            TypeAllStore.$state.delete_data = await TypeAllStore.$state.delete_data.filter((UnDelete) => UnDelete.id != id);
            this.delete_type_all = TypeAllStore.$state.delete_data
            this.list = this.delete_type_all
            sweetalert2.success('สำเร็จ')
          }
        };
      });
    },
    async reset(nameinput) {
      this.showDialog = false;
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
