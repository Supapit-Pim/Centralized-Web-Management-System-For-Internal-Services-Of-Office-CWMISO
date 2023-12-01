<script setup>
import sweetalert2 from '@/assets/js/controller/switchalert'
import { mapActions } from 'pinia'
import { computed } from 'vue'
import { useTypeFormStore, useTokenStore, PiniaRoot } from '@/stores/'
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
  <div class="p-5 space-y-5 w-full h-auto" id="form">
    <h1 class="text-3xl">{{ view_bin ? 'ถังขยะของประเภทแบบฟอร์ม' : 'ประเภทแบบฟอร์ม' }}</h1>


    <div class="" v-if="(view_bin == false && !type_form?.loading)">
      <div class="flex justify-end p-4">
        <v-sheet class="space-x-2 bg-transparent">
          <v-btn color="brown" @click="changeView(true)" v-bind="props"><v-icon start>mdi
              mdi-delete-clock</v-icon>ถังขยะ</v-btn>
          <v-btn color="deep-purple" @click="onShowDialog('add')" v-bind="props"><v-icon start>mdi
              mdi-plus</v-icon>เพิ่มประเภทแบบฟอร์ม</v-btn>
        </v-sheet>
      </div>

      <v-row no-gutters v-if="type_form?.length">
        <LayoutList :layout="displayed" v-on:showDialog="onShowDialog" v-on:getid="TypeFormGetID"
          v-on:delete="TypeFormDelete" />
      </v-row>

      <h1 v-if="!type_form?.length" class="text-2xl flex justify-center">ไม่มีข้อมูล</h1>

      <v-pagination v-if="(searchData == '' && type_form?.length)" class="page" v-model="currentPage"
        :length="totalPages"></v-pagination>

      <v-dialog class="z-0 " v-model="showDialog" width="1024" persistent>
        <Dialog :dialog="dialog" v-on:out="reset" v-on:add="TypeFormAddSubmit" v-on:update="TypeFormUpdateSubmit"
          v-on:delete="TypeFormDelete">
        </Dialog>
      </v-dialog>
    </div>

    <div class="" v-if="(view_bin == true && !delete_type_form?.loading)">
      <div class="flex justify-end p-4">
        <v-sheet class="space-x-2">
          <v-btn color="grey-darken-1" @click="changeView(false)" v-bind="props"><v-icon
              start>mdi-arrow-left</v-icon>ย้อนกลับ</v-btn>
        </v-sheet>
      </div>

      <v-row no-gutters v-if="delete_type_form?.length">
        <LayoutListDelete :layout="displayed" v-on:restore="TypeFormUnDelete" v-on:deletebackup="TypeFormDeleteBackup" />
      </v-row>

      <h1 v-if="!delete_type_form?.length" class="text-2xl flex justify-center">ไม่มีข้อมูล</h1>

      <v-pagination v-if="(searchData == '' && delete_type_form?.length)" class="page" v-model="currentPage"
        :length="totalPages"></v-pagination>
    </div>

    <div v-if="(type_form?.loading || delete_type_form?.loading)">
      <loading3 />
    </div>

  </div>
</template>

<script>
export default {
  name: 'TypeForm',
  setup() {
  },
  data() {
    return {
      view_bin: false,

      type_form: null,
      type_form_id: null,
      delete_type_form: null,

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
          },
        },
        input_update: {
          data: {
            name: null,
          },
        },
        data_id: {
          id: null,
          data: {
            name: null,
            create_time: null,
            update_time: null,
          }
        },
        title: {
          name: "ชื่อประเภทแบบฟอร์ม",
          create_time: Title().create_time,
          update_time: Title().update_time,
        }
      },
      layout: {
        type: "detail",
        id: [],
        data: [],
        title: {
          name: "ชื่อประเภทแบบฟอร์ม",
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
      this.layout.data = data.map(({ name }) => ({ name }));
      return this.layout
    }
  },
  async created() {
    this.TypeFormDataStore()
    this.TypeFormGetDelete()
  },
  methods: {
    ...mapActions(useTypeFormStore, ['Get_TypeForm_S', 'Get_TypeForm_ID_S', 'Add_TypeForm_ID_S', 'Update_TypeForm_ID_S',
      'Delete_TypeForm_ID_S', 'Get_Delete_TypeForm_S', 'UnDelete_TypeForm_ID_S', 'DeleteBackup_TypeForm_ID_S']),
    async onShowDialog(type) {
      this.showDialog = true;
      this.dialog.type = type;
    },
    async changeView(type) {
      this.view_bin = type;
      this.view_bin == false
        ? this.list = this.type_form
        : this.list = this.delete_type_form
      this.currentPage = 1
    },
    async TypeFormDataStore() {
      const TypeFormStore = useTypeFormStore()
      this.type_form = { loading: true }
      const response = await this.Get_TypeForm_S(PiniaRoot.token.token)
      if (typeof response == 'string') {
        await sweetalert2.warning(response)
      }
      this.type_form = TypeFormStore.$state.data
      this.list = this.type_form
    },
    async TypeFormGetID(id) {
      const TypeFormStore = useTypeFormStore()
      this.type_form_id = { loading: true }
      const response = await this.Get_TypeForm_S(PiniaRoot.token.token)
      if (typeof response == 'string') {
        await sweetalert2.warning(response)
      }
      this.type_form_id = await TypeFormStore.$state.data.find(p => p.id == id)
      if (!this.type_form_id) {
        this.type_form_id = { loading: true }
        const response = await this.Get_TypeForm_ID_S(PiniaRoot.token.token, id)
        if (typeof response == 'string') {
          await sweetalert2.warning(response)
        }
        this.type_form_id = TypeFormStore.$state.data_id
      }
      this.dialog.data_id.id = id
      for (const key in this.type_form_id) {
        if (this.dialog.data_id.data[key] !== undefined) {
          this.dialog.data_id.data[key] = this.type_form_id[key]
        }
        if (this.dialog.input_update.data[key] !== undefined) {
          this.dialog.input_update.data[key] = this.type_form_id[key]
        }
      }
    },
    async TypeFormAddSubmit(datas) {
      const data_token = await useTokenStore().DeCode(PiniaRoot.token.token)
      let add_data = { ...datas.data }
      const response = await this.Add_TypeForm_ID_S(PiniaRoot.token.token, add_data);
      if (typeof response == 'string') {
        this.reset('dialog.input_add')
        await sweetalert2.warning(response)
      }
      else {
        this.reset('dialog.input_add')
        await sweetalert2.success('สำเร็จ')
      }
      this.TypeFormDataStore()
    },
    async TypeFormUpdateSubmit(id, datas) {
      const data_token = await useTokenStore().DeCode(PiniaRoot.token.token)
      const TypeFormStore = useTypeFormStore()
      const temp_update = await TypeFormStore.$state.data.find(p => p.id == id)
      let update_data = { ...datas.data }
      const response = await this.Update_TypeForm_ID_S(PiniaRoot.token.token, update_data, id)
      if (typeof response == 'string') {
        this.reset('dialog.input_update')
        await sweetalert2.warning(response)
      }
      else {
        for (const key in this.dialog.input_update.data) {
          temp_update[key] = update_data[key]
        }
        temp_update.update_time = useHandleDatetime.isoStrToLocalStr(new Date())
        this.type_form = TypeFormStore.$state.data
        this.list = this.type_form
        this.reset('dialog.input_update')
        await sweetalert2.success('สำเร็จ')
      }
    },
    async TypeFormDelete(id) {
      sweetalert2.Delete('ลบข้อมูล', 'คุณแน่ใจใช่หรือไม่', id, async res => {
        if (res[0].isConfirmed == true) {
          const TypeFormStore = useTypeFormStore()
          const response = await this.Delete_TypeForm_ID_S(PiniaRoot.token.token, id);
          if (typeof response == 'string') {
            await sweetalert2.warning(response)
          }
          else {
            const temp_Delete = await TypeFormStore.$state.data.find(p => p.id == id)
            await TypeFormStore.$state.delete_data.push(temp_Delete)
            TypeFormStore.$state.data = await TypeFormStore.$state.data.filter((Delete) => Delete.id != id);
            this.type_form = TypeFormStore.$state.data
            this.list = this.type_form
            sweetalert2.success('สำเร็จ')
          }
        };
      });
    },
    async TypeFormGetDelete() {
      const TypeFormStore = useTypeFormStore()
      if (TypeFormStore.$state.delete_data == null) {
        const response = await this.Get_Delete_TypeForm_S(PiniaRoot.token.token)
        if (typeof response == 'string') {
          await sweetalert2.warning(response)
        }
      }
      this.delete_type_form = TypeFormStore.$state.delete_data
    },
    async TypeFormUnDelete(id) {
      sweetalert2.Delete('กู้คืนข้อมูล', 'คุณแน่ใจใช่หรือไม่', id, async res => {
        if (res[0].isConfirmed == true) {
          const TypeFormStore = useTypeFormStore()
          const response = await this.UnDelete_TypeForm_ID_S(PiniaRoot.token.token, id);
          if (typeof response == 'string') {
            await sweetalert2.warning(response)
          }
          else {
            const temp_UnDelete = await TypeFormStore.$state.delete_data.find(p => p.id == id)
            let i = 0
            while (i < this.type_form?.length && this.type_form[i].id < temp_UnDelete.id) i++
            await TypeFormStore.$state.data.splice(i, 0, temp_UnDelete)

            TypeFormStore.$state.delete_data = await TypeFormStore.$state.delete_data.filter((UnDelete) => UnDelete.id != id);
            this.delete_type_form = TypeFormStore.$state.delete_data
            this.list = this.delete_type_form
            sweetalert2.success('สำเร็จ')
          }
        };
      });
    },
    async TypeFormDeleteBackup(id) {
      sweetalert2.Delete('ลบข้อมูลถาวร', 'คุณแน่ใจใช่หรือไม่', id, async res => {
        if (res[0].isConfirmed == true) {
          const TypeFormStore = useTypeFormStore()
          const response = await this.DeleteBackup_TypeForm_ID_S(PiniaRoot.token.token, id);
          if (typeof response == 'string') {
            await sweetalert2.warning(response)
          }
          else {
            TypeFormStore.$state.delete_data = await TypeFormStore.$state.delete_data.filter((UnDelete) => UnDelete.id != id);
            this.delete_type_form = TypeFormStore.$state.delete_data
            this.list = this.delete_type_form
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