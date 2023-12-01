<script setup>
import sweetalert2 from '@/assets/js/controller/switchalert'
import { mapActions } from 'pinia'
import { computed } from 'vue'
import { useTypeCompanyStore, useTokenStore, PiniaRoot } from '@/stores/'
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
  <div class="p-5 space-y-5 w-full h-auto" id="company">
    <h1 class="text-3xl">{{ view_bin ? 'ถังขยะของประเภทสำนักงาน' : 'ประเภทสำนักงาน' }}</h1>

    <div class="" v-if="(view_bin == false && !type_company?.loading)">
      <div class="flex justify-end p-4">
        <v-sheet class="space-x-2 bg-transparent">
          <v-btn color="brown" @click="changeView(true)" v-bind="props"><v-icon start>mdi
              mdi-delete-clock</v-icon>ถังขยะ</v-btn>
          <v-btn color="deep-purple" @click="onShowDialog('add')" v-bind="props"><v-icon start>mdi
              mdi-plus</v-icon>เพิ่มประเภทสำนักงาน</v-btn>
        </v-sheet>
      </div>

      <v-row no-gutters v-if="type_company?.length">
        <LayoutList :layout="displayed" v-on:showDialog="onShowDialog" v-on:getid="TypeCompanyGetID"
          v-on:delete="TypeCompanyDelete" />
      </v-row>

      <h1 v-if="!type_company?.length" class="text-2xl flex justify-center">ไม่มีข้อมูล</h1>

      <v-pagination v-if="(searchData == '' && type_company?.length)" class="page" v-model="currentPage"
        :length="totalPages"></v-pagination>

      <v-dialog class="z-0 " v-model="showDialog" width="1024" persistent>
        <Dialog :dialog="dialog" v-on:out="reset" v-on:add="TypeCompanyAddSubmit" v-on:update="TypeCompanyUpdateSubmit"
          v-on:delete="TypeCompanyDelete">
        </Dialog>
      </v-dialog>
    </div>

    <div class="" v-if="(view_bin == true && !delete_type_company?.loading)">
      <div class="flex justify-end p-4">
        <v-sheet class="space-x-2">
          <v-btn color="grey-darken-1" @click="changeView(false)" v-bind="props"><v-icon
              start>mdi-arrow-left</v-icon>ย้อนกลับ</v-btn>
        </v-sheet>
      </div>

      <v-row no-gutters v-if="delete_type_company?.length">
        <LayoutListDelete :layout="displayed" v-on:restore="TypeCompanyUnDelete"
          v-on:deletebackup="TypeCompanyDeleteBackup" />
      </v-row>

      <h1 v-if="!delete_type_company?.length" class="text-2xl flex justify-center">ไม่มีข้อมูล</h1>

      <v-pagination v-if="(searchData == '' && delete_type_company?.length)" class="page" v-model="currentPage"
        :length="totalPages"></v-pagination>
    </div>

    <div v-if="(type_company?.loading || delete_type_company?.loading)">
      <loading3 />
    </div>

  </div>
</template>

<script>
export default {
  name: 'TypeCompany',
  setup() {
  },
  data() {
    return {
      view_bin: false,

      type_company: null,
      type_company_id: null,
      delete_type_company: null,

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
            initials: null,
          },
        },
        input_update: {
          data: {
            name: null,
            initials: null,
          },
        },
        data_id: {
          id: null,
          data: {
            name: null,
            initials: null,
            create_time: null,
            update_time: null,
          }
        },
        title: {
          name: "ชื่อประเภทสำนักงาน",
          initials: "ชื่อย่อ",
          create_time: Title().create_time,
          update_time: Title().update_time,
        }
      },
      layout: {
        type: "detail",
        id: [],
        data: [],
        title: {
          name: "ชื่อประเภทสำนักงาน",
          initials: "ชื่อย่อ",
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
      const response = this.list != '' && this.currentPage != ''
        ? useHandlePage.getdata_pages(this.currentPage, this.itemsPerPage, this.list)
        : ''

      const data = this.searchData != ''
        ? this.filtered
        : this.list.slice(response[0], response[1])

      this.layout.id = data.map((data) => data.id)
      this.layout.data = data.map(({ name, initials }) => ({ name, initials }));
      return this.layout
    }
  },
  async created() {
    this.TypeCompanyDataStore()
    this.TypeCompanyGetDelete()
  },
  methods: {
    ...mapActions(useTypeCompanyStore, ['Get_TypeCompany_S', 'Get_TypeCompany_ID_S', 'Add_TypeCompany_ID_S', 'Update_TypeCompany_ID_S',
      'Delete_TypeCompany_ID_S', 'Get_Delete_TypeCompany_S', 'UnDelete_TypeCompany_ID_S', 'DeleteBackup_TypeCompany_ID_S']),
    async onShowDialog(type) {
      this.showDialog = true;
      this.dialog.type = type;
    },
    async changeView(type) {
      this.view_bin = type;
      this.view_bin == false
        ? this.list = this.type_company
        : this.list = this.delete_type_company
      this.currentPage = 1
    },
    async TypeCompanyDataStore() {
      const TypeCompanyStore = useTypeCompanyStore()
      this.type_company = { loading: true }
      const response = await this.Get_TypeCompany_S(PiniaRoot.token.token)
      if (typeof response == 'string') {
        await sweetalert2.warning(response)
      }
      this.type_company = TypeCompanyStore.$state.data
      this.list = this.type_company
    },
    async TypeCompanyGetID(id) {
      const TypeCompanyStore = useTypeCompanyStore()
      this.type_company_id = { loading: true }
      const response = await this.Get_TypeCompany_S(PiniaRoot.token.token)
      if (typeof response == 'string') {
        await sweetalert2.warning(response)
      }
      this.type_company_id = await TypeCompanyStore.$state.data.find(p => p.id == id)
      if (!this.type_company_id) {
        this.type_company_id = { loading: true }
        const response = await this.Get_TypeCompany_ID_S(PiniaRoot.token.token, id)
        if (typeof response == 'string') {
          await sweetalert2.warning(response)
        }
        this.type_company_id = TypeCompanyStore.$state.data_id
      }
      this.dialog.data_id.id = id
      for (const key in this.type_company_id) {
        if (this.dialog.data_id.data[key] !== undefined) {
          this.dialog.data_id.data[key] = this.type_company_id[key]
        }
        if (this.dialog.input_update.data[key] !== undefined) {
          this.dialog.input_update.data[key] = this.type_company_id[key]
        }
      }
    },
    async TypeCompanyAddSubmit(datas) {
      const data_token = await useTokenStore().DeCode(PiniaRoot.token.token)
      let add_data = { ...datas.data }
      const response = await this.Add_TypeCompany_ID_S(PiniaRoot.token.token, add_data);
      if (typeof response == 'string') {
        this.reset('dialog.input_add')
        await sweetalert2.warning(response)
      }
      else {
        this.reset('dialog.input_add')
        await sweetalert2.success('สำเร็จ')
      }
      this.TypeCompanyDataStore()
    },
    async TypeCompanyUpdateSubmit(id, datas) {
      const data_token = await useTokenStore().DeCode(PiniaRoot.token.token)
      const TypeCompanyStore = useTypeCompanyStore()
      const temp_update = await TypeCompanyStore.$state.data.find(p => p.id == id)
      let update_data = { ...datas.data }
      const response = await this.Update_TypeCompany_ID_S(PiniaRoot.token.token, update_data, id)
      if (typeof response == 'string') {
        this.reset('dialog.input_update')
        await sweetalert2.warning(response)
      }
      else {
        for (const key in this.dialog.input_update.data) {
          temp_update[key] = update_data[key]
        }
        temp_update.update_time = useHandleDatetime.isoStrToLocalStr(new Date())
        this.type_company = TypeCompanyStore.$state.data
        this.list = this.type_company
        this.reset('dialog.input_update')
        await sweetalert2.success('สำเร็จ')
      }
    },
    async TypeCompanyDelete(id) {
      sweetalert2.Delete('ลบข้อมูล', 'คุณแน่ใจใช่หรือไม่', id, async res => {
        if (res[0].isConfirmed == true) {
          const TypeCompanyStore = useTypeCompanyStore()
          const response = await this.Delete_TypeCompany_ID_S(PiniaRoot.token.token, id);
          if (typeof response == 'string') {
            await sweetalert2.warning(response)
          }
          else {
            const temp_Delete = await TypeCompanyStore.$state.data.find(p => p.id == id)
            await TypeCompanyStore.$state.delete_data.push(temp_Delete)
            TypeCompanyStore.$state.data = await TypeCompanyStore.$state.data.filter((Delete) => Delete.id != id);
            this.type_company = TypeCompanyStore.$state.data
            this.list = this.type_company
            sweetalert2.success('สำเร็จ')
          }
        };
      });
    },
    async TypeCompanyGetDelete() {
      const TypeCompanyStore = useTypeCompanyStore()
      if (TypeCompanyStore.$state.delete_data == null) {
        this.delete_type_company = { loading: true }
        const response = await this.Get_Delete_TypeCompany_S(PiniaRoot.token.token)
        if (typeof response == 'string') {
          await sweetalert2.warning(response)
        }
      }
      this.delete_type_company = TypeCompanyStore.$state.delete_data
    },
    async TypeCompanyUnDelete(id) {
      sweetalert2.Delete('กู้คืนข้อมูล', 'คุณแน่ใจใช่หรือไม่', id, async res => {
        if (res[0].isConfirmed == true) {
          const TypeCompanyStore = useTypeCompanyStore()
          const response = await this.UnDelete_TypeCompany_ID_S(PiniaRoot.token.token, id);
          if (typeof response == 'string') {
            await sweetalert2.warning(response)
          }
          else {
            const temp_UnDelete = await TypeCompanyStore.$state.delete_data.find(p => p.id == id)
            let i = 0
            while (i < this.type_company?.length && this.type_company[i].id < temp_UnDelete.id) i++
            await TypeCompanyStore.$state.data.splice(i, 0, temp_UnDelete)

            TypeCompanyStore.$state.delete_data = await TypeCompanyStore.$state.delete_data.filter((UnDelete) => UnDelete.id != id);
            this.delete_type_company = TypeCompanyStore.$state.delete_data
            this.list = this.delete_type_company
            sweetalert2.success('สำเร็จ')
          }
        };
      });
    },
    async TypeCompanyDeleteBackup(id) {
      sweetalert2.Delete('ลบข้อมูลถาวร', 'คุณแน่ใจใช่หรือไม่', id, async res => {
        if (res[0].isConfirmed == true) {
          const TypeCompanyStore = useTypeCompanyStore()
          const response = await this.DeleteBackup_TypeCompany_ID_S(PiniaRoot.token.token, id);
          if (typeof response == 'string') {
            await sweetalert2.warning(response)
          }
          else {
            TypeCompanyStore.$state.delete_data = await TypeCompanyStore.$state.delete_data.filter((UnDelete) => UnDelete.id != id);
            this.delete_type_company = TypeCompanyStore.$state.delete_data
            this.list = this.delete_type_company
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
