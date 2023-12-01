<script setup>
import sweetalert2 from '@/assets/js/controller/switchalert'
import { mapActions } from 'pinia'
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useTokenStore, useListPersonnelStore, useDataPersonnelStore, useUserStore, PiniaRoot, } from '@/stores/';
import { useRouter } from 'vue-router'
import PictureInput from 'vue-picture-input'
import useHandlePage from '@/utils/handlePage'
import useHandleDecode from '@/utils/handleDecode'
import useHandleDatetime from '@/utils/handleDatetime'
import loading3 from '@/components/Loading-Layout-List-Col2.vue'

import Title from '@/utils/Title'
import Dialog from '@/components/Dialog.vue'
import LayoutCard from '@/components/Layout-Card-List-Personnel.vue'
import LayoutListDelete from '@/components/Layout-List-Delete.vue'

const { name } = useDisplay()

</script>

<template>
  <div class="p-5 space-y-5 w-full h-full">
    <h1 class="text-3xl">{{ view_bin ? 'ถังขยะของรายการบุคลากร' : 'รายการบุคลากร' }}</h1>

    <div class="" v-if="(view_bin == false && !list_personnel?.loading)">

      <div class="flex justify-between my-6">
        <v-card class="rounded-pill" elevation="1" width="50%">
          <v-text-field v-model="searchData" density="compact" variant="solo" label="ค้นหารายการบุคลากร"
            append-inner-icon="mdi-magnify" single-line hide-details>
          </v-text-field>
        </v-card>

        <v-sheet class="space-x-2 bg-transparent">
          <v-btn color="brown" @click="changeView(true)" v-bind="props"><v-icon start>mdi
              mdi-delete-clock</v-icon>ถังขยะ</v-btn>
          <v-btn color="deep-purple" @click="onShowDialog('add')" v-bind="props"><v-icon start>mdi
              mdi-plus</v-icon>เพิ่มรายการบุคลากร</v-btn>
        </v-sheet>
      </div>

      <LayoutCard v-if="list_personnel?.length" :layout="displayed" v-on:urldatapersonnel="RouterLink_DataPersonnel"
        v-on:urlpersonneluser="RouterLink_PersonnelUser" v-on:showDialog="onShowDialog" v-on:getid="ListPersonnelGetID"
        v-on:delete="ListPersonnelDelete" />

      <h1 v-if="!list_personnel?.length" class="text-2xl flex justify-center">ไม่มีข้อมูล</h1>

      <v-pagination v-if="(searchData == '' && list_personnel?.length)" class="page" v-model="currentPage"
        :length="totalPages"></v-pagination>

      <v-dialog class="z-0 " v-model="showDialog" width="1024" persistent>
        <Dialog :dialog="dialog" v-on:out="reset" v-on:add="ListPersonnelAddSubmit"
          v-on:update="ListPersonnelUpdateSubmit" v-on:delete="ListPersonnelDelete">
        </Dialog>
      </v-dialog>
    </div>

    <div class="" v-if="(view_bin == true)">
      <!-- กดกู้ข้อมูล -->
      <div class="flex justify-end p-4">
        <v-sheet class="space-x-2">
          <v-btn color="grey-darken-1" @click="changeView(false)" v-bind="props"><v-icon
              start>mdi-arrow-left</v-icon>ย้อนกลับ</v-btn>
        </v-sheet>
      </div>

      <v-row no-gutters v-if="delete_list_personnel?.length">
        <LayoutListDelete :layout="displayed" v-on:restore="ListPersonnelUnDelete"
          v-on:deletebackup="ListPersonnelDeleteBackup" />
      </v-row>

      <h1 v-if="!delete_list_personnel?.length" class="text-2xl flex justify-center">ไม่มีข้อมูล</h1>

      <v-pagination v-if="(searchData == '' && delete_list_personnel?.length)" class="page" v-model="currentPage"
        :length="totalPages"></v-pagination>
    </div>

    <div v-if="(list_personnel?.loading || delete_list_personnel?.loading)">
      <loading3 />
    </div>

  </div>
</template>

<script>

export default {
  name: 'List_Personnel',
  setup() { },
  data() {
    return {
      view_bin: false,

      list_personnel: { loading: true },
      list_personnel_id: null,
      delete_list_personnel: { loading: true },

      token: null,

      router: useRouter(),

      list: [1],
      itemsPerPage: 9,
      currentPage: 1,

      searchData: '',

      showDialog: false,
      dialog: {
        type: null,
        input_add: {
          data: {
            topic: null,
          },
        },
        input_update: {
          data: {
            topic: null,
          },
        },
        data_id: {
          id: null,
          data: {
            topic: null,
            create_time: null,
            update_time: null,
          }
        },
        title: {
          topic: "รายการบุคลากร",
          create_time: Title().create_time,
          update_time: Title().update_time,
        }
      },
      layout: {
        type: "detail",
        id: [],
        data: {
          topic: null,
        }
      },
    }
  },
  computed: {
    PictureInput,
    totalPages() {
      return this.list != '' ? useHandlePage.total_pages(this.list?.length, this.itemsPerPage)
        : ''
    },
    filtered() {
      return this.list.filter((item) => {
        const lowerCaseQuery = this.searchData.toLowerCase()
        return (
          item.topic.toLowerCase().match(lowerCaseQuery)
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

      // Fotmat list to layout
      this.layout.id = data.map((data) => data.id)
      this.layout.data = data.map(({ topic }) => ({ topic }));
      return this.layout
    },
  },
  async created() {
    this.token = await useTokenStore().DeCode(PiniaRoot.token.token)
    this.ListPersonnelDataStore()
    this.ListPersonnelGetDelete()
  },
  methods: {
    ...mapActions(useListPersonnelStore, ['Get_ListPersonnel_A', 'Get_ListPersonnel_ID_A', 'Add_ListPersonnel_ID_A', 'Update_ListPersonnel_ID_A', 'Delete_ListPersonnel_ID_A', 'Get_Delete_ListPersonnel_A', 'UnDelete_ListPersonnel_ID_A', 'DeleteBackup_ListPersonnel_ID_A', 'Filter_ListPersonnel_By_Company_ID']),
    ...mapActions(useTokenStore, ['GetToken']),
    async RouterLink_DataPersonnel(id) {
      return await this.router.push({
        path: '/admin/datapersonnel', // เปลี่ยน path ตรงนี้
        query: { id: id }
      })
    },
    async RouterLink_PersonnelUser(id) {
      return await this.router.push({
        path: '/admin/user',
        query: { id: id }
      })
    },
    async onShowDialog(type) {
      this.showDialog = true;
      this.dialog.type = type;
    },
    async changeView(type) {
      this.view_bin = type;
      this.view_bin == false
        ? this.list = this.list_personnel
        : this.list = this.delete_list_personnel
      this.currentPage = 1
    },
    async ListPersonnelDataStore() {
      let company_id = this.token.DataUser.company_id
      const ListPersonnelStore = useListPersonnelStore()
      this.list_personnel = { loading: true }
      const response = await this.Get_ListPersonnel_A(PiniaRoot.token.token)
      if (typeof response == 'string') {
        await sweetalert2.warning(response)
      }
      this.list_personnel = await ListPersonnelStore.$state.data
      // this.list_personnel = await this.Filter_ListPersonnel_By_Company_ID(company_id)
      this.list = this.list_personnel
    },
    async ListPersonnelGetID(id) {
      let company_id = this.token.DataUser.company_id
      const ListPersonnelStore = useListPersonnelStore()
      this.list_personnel_id = { loading: true }
      const response = await this.Get_ListPersonnel_A(PiniaRoot.token.token)
      if (typeof response == 'string') {
        await sweetalert2.warning(response)
      }
      this.list_personnel_id = await ListPersonnelStore.$state.data.find(p => p.id == id)
      if (!this.list_personnel_id) {
        this.list_personnel_id = { loading: true }
        const response = await this.Get_ListPersonnel_ID_A(PiniaRoot.token.token, id)
        if (typeof response == 'string') {
          await sweetalert2.warning(response)
        }
        this.list_personnel_id = ListPersonnelStore.$state.data_id
      }
      this.dialog.data_id.id = id
      for (const key in this.list_personnel_id) {
        if (this.dialog.data_id.data[key] !== undefined) {
          this.dialog.data_id.data[key] = this.list_personnel_id[key]
        }
        if (this.dialog.input_update.data[key] !== undefined) {
          this.dialog.input_update.data[key] = this.list_personnel_id[key]
        }
      }
    },
    async ListPersonnelAddSubmit(datas) {
      let add_data = {
        ...datas.data,
        company_id: this.token.DataUser.company_id,
      }
      const response = await this.Add_ListPersonnel_ID_A(PiniaRoot.token.token, add_data);
      if (typeof response == 'string') {
        this.reset('dialog.input_add')
        await sweetalert2.warning(response)
      }
      else {
        this.reset('dialog.input_add')
        await sweetalert2.success('สำเร็จ')
      }
      this.ListPersonnelDataStore()
    },
    async ListPersonnelUpdateSubmit(id, datas) {
      let company_id = this.token.DataUser.company_id
      const ListPersonnelStore = useListPersonnelStore()
      const temp_update = await ListPersonnelStore.$state.data.find(p => p.id == id)
      let update_data = {
        ...datas.data,
        company_id: company_id,
      }
      const response = await this.Update_ListPersonnel_ID_A(PiniaRoot.token.token, update_data, id)
      if (typeof response == 'string') {
        this.reset('dialog.input_update')
        await sweetalert2.warning(response)
      }
      else {
        for (const key in this.dialog.input_update.data) {
          temp_update[key] = update_data[key]
        }
        temp_update.update_time = useHandleDatetime.isoStrToLocalStr(new Date())
        this.list_personnel = ListPersonnelStore.$state.data
        this.list = this.list_personnel
        this.reset('dialog.input_update')
        await sweetalert2.success('สำเร็จ')
      }
    },
    async ListPersonnelDelete(id) {
      sweetalert2.Delete('ลบข้อมูล', 'คุณแน่ใจใช่หรือไม่', id, async res => {
        if (res[0].isConfirmed == true) {
          let company_id = this.token.DataUser.company_id
          const ListPersonnelStore = useListPersonnelStore()
          const response = await this.Delete_ListPersonnel_ID_A(PiniaRoot.token.token, id);
          if (typeof response == 'string') {
            await sweetalert2.warning(response)
          }
          else {
            const temp_Delete = await ListPersonnelStore.$state.data.find(p => p.id == id)
            await ListPersonnelStore.$state.delete_data.push(temp_Delete)
            ListPersonnelStore.$state.data = await ListPersonnelStore.$state.data.filter((Delete) => Delete.id != id);
            this.list_personnel = ListPersonnelStore.$state.data
            this.list = this.list_personnel
            sweetalert2.success('สำเร็จ')
          }
        };
      });
    },
    async ListPersonnelGetDelete() {
      let company_id = this.token.DataUser.company_id
      const ListPersonnelStore = useListPersonnelStore()
      this.delete_list_personnel = { loading: true }
      const response = await this.Get_Delete_ListPersonnel_A(PiniaRoot.token.token)
      if (typeof response == 'string') {
        await sweetalert2.warning(response)
      }
      this.delete_list_personnel = ListPersonnelStore.$state.delete_data
    },
    async ListPersonnelUnDelete(id) {
      sweetalert2.Delete('กู้คืนข้อมูล', 'คุณแน่ใจใช่หรือไม่', id, async res => {
        if (res[0].isConfirmed == true) {
          let company_id = this.token.DataUser.company_id
          const ListPersonnelStore = useListPersonnelStore()
          const response = await this.UnDelete_ListPersonnel_ID_A(PiniaRoot.token.token, id);
          if (typeof response == 'string') {
            await sweetalert2.warning(response)
          }
          else {
            const temp_UnDelete = await ListPersonnelStore.$state.delete_data.find(p => p.id == id)
            let i = 0
            while (i < this.list_personnel?.length && this.list_personnel[i].id < temp_UnDelete.id) i++
            await ListPersonnelStore.$state.data.splice(i, 0, temp_UnDelete)

            ListPersonnelStore.$state.delete_data = await ListPersonnelStore.$state.delete_data.filter((UnDelete) => UnDelete.id != id);
            this.delete_list_personnel = ListPersonnelStore.$state.delete_data
            this.list = this.delete_list_personnel
            sweetalert2.success('สำเร็จ')
          }
        };
      });
    },
    async ListPersonnelDeleteBackup(id) {
      sweetalert2.Delete('ลบข้อมูลถาวร', 'คุณแน่ใจใช่หรือไม่', id, async res => {
        if (res[0].isConfirmed == true) {
          let company_id = this.token.DataUser.company_id
          const ListPersonnelStore = useListPersonnelStore()
          const response = await this.DeleteBackup_ListPersonnel_ID_A(PiniaRoot.token.token, id);
          if (typeof response == 'string') {
            await sweetalert2.warning(response)
          }
          else {
            ListPersonnelStore.$state.delete_data = await ListPersonnelStore.$state.delete_data.filter((UnDelete) => UnDelete.id != id);
            this.delete_list_personnel = ListPersonnelStore.$state.delete_data
            this.list = this.delete_list_personnel
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
