<script setup>
import sweetalert2 from '@/assets/js/controller/switchalert'
import { mapActions } from 'pinia'
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useSuperAdminStore, PiniaRoot } from '@/stores/'
import PictureInput from 'vue-picture-input'
import useHandlePage from '@/utils/handlePage'
import useHandleDatetime from '@/utils/handleDatetime'
import loading3 from '@/components/Loading-Layout-List-Col2.vue'

import Title from '@/utils/Title'
import Dialog from '@/components/Dialog.vue'
import LayoutList from '@/components/Layout-List.vue'
import LayoutListDelete from '@/components/Layout-List-Delete.vue'

const { name } = useDisplay()

</script>

<template v-slot:activator="{ props }">
  <div class="w-full h-full">

    <div class="p-5 space-y-5 w-full h-full">
      <h1 class="text-3xl">{{ view_bin ? 'ถังขยะของผู้พัฒนาระบบ' : 'ผู้พัฒนาระบบ' }}</h1>

      <div class="" v-if="(view_bin == false && !superadmin?.loading)">
        <div class="flex justify-between my-6">
          <v-card class="rounded-pill" elevation="1" width="50%">
            <v-text-field v-model="searchData" density="compact" variant="solo" label="ค้นหาชื่อ-นามสกุล หรือ ชื่อผู้ใช้"
              append-inner-icon="mdi-magnify" single-line hide-details>
            </v-text-field>
          </v-card>

          <v-sheet class="space-x-2 bg-transparent">
            <v-btn color="brown" @click="changeView(true)" v-bind="props"><v-icon start>mdi
                mdi-delete-clock</v-icon>ถังขยะ</v-btn>
            <v-btn color="deep-purple" @click="onShowDialog('add')" v-bind="props"><v-icon start>mdi
                mdi-plus</v-icon>เพิ่มผู้พัฒนาระบบ</v-btn>
          </v-sheet>
        </div>

        <v-row no-gutters v-if="superadmin?.length">
          <LayoutList :layout="displayed" v-on:showDialog="onShowDialog" v-on:getid="SuperAdminGetID"
            v-on:delete="SuperAdminDelete" />
        </v-row>

        <h1 v-if="!superadmin?.length" class="text-2xl flex justify-center">ไม่มีข้อมูล</h1>

        <v-pagination v-if="(searchData == '' && superadmin?.length)" class="page" v-model="currentPage"
          :length="totalPages"></v-pagination>

        <v-dialog class="z-0 " v-model="showDialog" width="1024" persistent>
          <Dialog :dialog="dialog" v-on:out="reset" v-on:add="SuperAdminAddSubmit" v-on:update="SuperAdminUpdateSubmit"
            v-on:delete="SuperAdminDelete">
          </Dialog>
        </v-dialog>
      </div>

      <div class="" v-if="(view_bin == true && !delete_superadmin?.loading)">
        <div class="flex justify-end p-4">
          <v-sheet class="space-x-2">
            <v-btn color="grey-darken-1" @click="changeView(false)" v-bind="props"><v-icon
                start>mdi-arrow-left</v-icon>ย้อนกลับ</v-btn>
          </v-sheet>
        </div>

        <v-row no-gutters v-if="delete_superadmin?.length">
          <LayoutListDelete :layout="displayed" v-on:restore="SuperAdminUnDelete"
            v-on:deletebackup="SuperAdminDeleteBackup" />
        </v-row>

        <h1 v-if="!delete_superadmin?.length" class="text-2xl flex justify-center">ไม่มีข้อมูล</h1>

        <v-pagination v-if="(searchData == '' && delete_superadmin?.length)" class="page" v-model="currentPage"
          :length="totalPages"></v-pagination>
      </div>

      <div v-if="(superadmin?.loading || delete_superadmin?.loading)">
        <loading3 />
      </div>

    </div>

  </div>
</template>

<script>
export default {
  name: 'Superadmin',
  setup() {
  },
  data() {
    return {
      view_bin: false,

      superadmin: null,
      superadmin_id: null,
      delete_superadmin: null,

      list: [1],
      itemsPerPage: 10,
      currentPage: 1,

      searchData: '',

      showDialog: false,
      dialog: {
        type: null,
        base64String: null,
        input_add: {
          data: {
            name: null,
            username: null,
            password: null
          },
          image: {
            photo: null
          }
        },
        input_update: {
          data: {
            name: null,
            username: null,
            password: null
          },
          image: {
            photo: null
          }
        },
        data_id: {
          id: null,
          data: {
            name: null,
            username: null,
            create_time: null,
            update_time: null
          },
          image: {
            photo: null
          }
        },
        title: {
          name: Title().name,
          username: Title().username,
          password: Title().password,
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
          username: null,
        },
        image: {
          photo: null
        },
        title: {
          name: Title().name,
          username: Title().username,
          photo: Title().photo,
        }
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
          item.username.toLowerCase().match(lowerCaseQuery)
        )
      });
    },
    displayed() {
      if (this.currentPage > this.totalPages) this.currentPage = this.totalPages
      // this.list.filter(item => item.id != )
      const respones = this.list != '' && this.currentPage != ''
        ? useHandlePage.getdata_pages(this.currentPage, this.itemsPerPage, this.list)
        : ''

      const data = this.searchData != ''
        ? this.filtered
        : this.list.slice(respones[0], respones[1])

      this.layout.id = data.map((data) => data.id)
      this.layout.data = data.map(({ name, username }) => ({ name, username }));
      this.layout.image.photo = data.map((data) => data.photo)
      return this.layout
    }
  },
  async created() {
    this.SuperAdminDataStore()
    this.SuperAdminGetDelete()
  },
  methods: {
    ...mapActions(useSuperAdminStore, ['Get_SuperAdmin_S', 'Get_SuperAdmin_ID_S', 'Add_SuperAdmin_ID_S', 'Update_SuperAdmin_ID_S',
      'Delete_SuperAdmin_ID_S', 'Get_Delete_SuperAdmin_S', 'UnDelete_SuperAdmin_ID_S', 'DeleteBackup_SuperAdmin_ID_S']),
    async onShowDialog(type) {
      this.showDialog = true
      this.dialog.type = type
    },
    async changeView(type) {
      this.view_bin = type;
      this.view_bin == false
        ? this.list = this.superadmin
        : this.list = this.delete_superadmin
      this.currentPage = 1
    },
    async SuperAdminDataStore() {
      const SuperAdminStore = useSuperAdminStore()
      this.superadmin = { loading: true }
      const response = await this.Get_SuperAdmin_S(PiniaRoot.token.token)
      if (typeof response == 'string') {
        await sweetalert2.warning(response)
      }
      this.superadmin = SuperAdminStore.$state.data
      this.list = this.superadmin
    },
    async SuperAdminGetID(id) {
      const SuperAdminStore = useSuperAdminStore()
      this.superadmin_id = { loading: true }
      const response = await this.Get_SuperAdmin_S(PiniaRoot.token.token)
      if (typeof response == 'string') {
        await sweetalert2.warning(response)
      }
      this.superadmin_id = await SuperAdminStore.$state.data.find(p => p.id == id)
      if (!this.superadmin_id) {
        this.superadmin_id = { loading: true }
        const response = await this.Get_SuperAdmin_ID_S(PiniaRoot.token.token, id)
        if (typeof response == 'string') {
          await sweetalert2.warning(response)
        }
        this.superadmin_id = SuperAdminStore.$state.data_id
      }
      this.dialog.data_id.id = id
      for (const key in this.superadmin_id) {
        if (this.dialog.data_id.data[key] !== undefined) {
          this.dialog.data_id.data[key] = this.superadmin_id[key]
        } else if (this.dialog.data_id.image[key] !== undefined) {
          this.dialog.data_id.image[key] = this.superadmin_id[key]
        }

        if (this.dialog.input_update.data[key] !== undefined) {
          this.dialog.input_update.data[key] = this.superadmin_id[key]
        } else if (this.dialog.input_update.image[key] !== undefined) {
          this.dialog.input_update.image[key] = this.superadmin_id[key]
          this.dialog.base64String = this.superadmin_id[key]
        }
      }
    },
    async SuperAdminAddSubmit(datas) {
      let add_data = { ...datas.data, ...datas.image }
      const response = await this.Add_SuperAdmin_ID_S(PiniaRoot.token.token, add_data);
      if (typeof response == 'string') {
        this.reset('dialog.input_add')
        await sweetalert2.warning(response)
      }
      else {
        this.reset('dialog.input_add')
        await sweetalert2.success('สำเร็จ')
      }
      this.SuperAdminDataStore()
    },
    async SuperAdminUpdateSubmit(id, datas) {
      const SuperAdminStore = useSuperAdminStore()
      const temp_update = await SuperAdminStore.$state.data.find(p => p.id == id)
      let update_data = { ...datas.data, ...datas.image }
      const response = await this.Update_SuperAdmin_ID_S(PiniaRoot.token.token, update_data, id)
      if (typeof response == 'string') {
        this.reset('dialog.input_update')
        await sweetalert2.warning(response)
      }
      else {
        update_data.password = ''
        for (const key in this.dialog.input_update.data) {
          temp_update[key] = update_data[key]
        }
        temp_update.photo = update_data.photo;
        temp_update.update_time = useHandleDatetime.isoStrToLocalStr(new Date())
        this.superadmin = SuperAdminStore.$state.data
        this.list = this.superadmin
        this.reset('dialog.input_update')
        await sweetalert2.success('สำเร็จ')
      }
    },
    async SuperAdminDelete(id) {
      sweetalert2.Delete('ลบข้อมูล', 'คุณแน่ใจใช่หรือไม่', id, async res => {
        if (res[0].isConfirmed == true) {
          const SuperAdminStore = useSuperAdminStore()
          const response = await this.Delete_SuperAdmin_ID_S(PiniaRoot.token.token, id);
          if (typeof response == 'string') {
            await sweetalert2.warning(response)
          }
          else {
            const temp_Delete = await SuperAdminStore.$state.data.find(p => p.id == id)
            await SuperAdminStore.$state.delete_data.push(temp_Delete)
            SuperAdminStore.$state.data = await SuperAdminStore.$state.data.filter((Delete) => Delete.id != id);
            this.superadmin = SuperAdminStore.$state.data
            this.list = this.superadmin
            sweetalert2.success('สำเร็จ')
          }
        };
      });
    },
    async SuperAdminGetDelete() {
      const SuperAdminStore = useSuperAdminStore()
      if (SuperAdminStore.$state.delete_data == null) {
        const response = await this.Get_Delete_SuperAdmin_S(PiniaRoot.token.token)
        if (typeof response == 'string') {
          await sweetalert2.warning(response)
        }
      }
      this.delete_superadmin = SuperAdminStore.$state.delete_data
    },
    async SuperAdminUnDelete(id) {
      sweetalert2.Delete('กู้คืนข้อมูล', 'คุณแน่ใจใช่หรือไม่', id, async res => {
        if (res[0].isConfirmed == true) {
          const SuperAdminStore = useSuperAdminStore()
          const response = await this.UnDelete_SuperAdmin_ID_S(PiniaRoot.token.token, id);
          if (typeof response == 'string') {
            await sweetalert2.warning(response)
          }
          else {
            const temp_UnDelete = await SuperAdminStore.$state.delete_data.find(p => p.id == id)
            let i = 0
            while (i < this.superadmin?.length && this.superadmin[i].id < temp_UnDelete.id) i++
            await SuperAdminStore.$state.data.splice(i, 0, temp_UnDelete)

            SuperAdminStore.$state.delete_data = await SuperAdminStore.$state.delete_data.filter((UnDelete) => UnDelete.id != id);
            this.delete_superadmin = SuperAdminStore.$state.delete_data
            this.list = this.delete_superadmin
            sweetalert2.success('สำเร็จ')
          }
        };
      });
    },
    async SuperAdminDeleteBackup(id) {
      sweetalert2.Delete('ลบข้อมูลถาวร', 'คุณแน่ใจใช่หรือไม่', id, async res => {
        if (res[0].isConfirmed == true) {
          const SuperAdminStore = useSuperAdminStore()
          const response = await this.DeleteBackup_SuperAdmin_ID_S(PiniaRoot.token.token, id);
          if (typeof response == 'string') {
            await sweetalert2.warning(response)
          }
          else {
            SuperAdminStore.$state.delete_data = await SuperAdminStore.$state.delete_data.filter((UnDelete) => UnDelete.id != id);
            this.delete_superadmin = SuperAdminStore.$state.delete_data
            this.list = this.delete_superadmin
            sweetalert2.success('สำเร็จ')
          }
        };
      });
    },
    async reset(nameinput) {
      this.showDialog = false;
      this.dialog.base64String = null
      nameinput == "dialog.input_add"
        ? Object.assign(this.$data.dialog.input_add, this.$options.data().dialog.input_add)
        : Object.assign(this.$data.dialog.input_update, this.$options.data().dialog.input_update);
    },
  },
}
</script>
<style>
.size-btn {
  width: 20px;
  height: 200px;
  background-color: blueviolet;
}

html {
  scroll-behavior: smooth !important;
}
</style>
