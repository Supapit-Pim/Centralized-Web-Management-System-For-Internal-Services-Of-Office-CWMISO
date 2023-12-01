<script setup>
import sweetalert2 from '@/assets/js/controller/switchalert'
import { mapActions } from 'pinia'
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useTokenStore, useUserStore, useCompanyStore, useListPersonnelStore, PiniaRoot } from '@/stores/'
import { useRouter } from 'vue-router'
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

<template v-slot:default="{ isHovering, props }" v-slot:activator="{ props }">
  <div class="w-full h-full">

    <div class="p-5 space-y-5 w-full h-full">
      <h1 class="text-3xl">{{ view_bin ? 'ถังขยะของผู้ใช้งาน' : 'ผู้ใช้งาน' }}</h1>


      <div class="" v-if="(view_bin == false && !user?.loading)">
        <div class="flex justify-between my-6">
          <v-card class="rounded-pill" elevation="1" width="50%">
            <v-text-field v-model="searchData" density="compact" variant="solo" label="ค้นหาชื่อ-นามสกุล หรือ ชื่อผู้ใช้"
              append-inner-icon="mdi-magnify" single-line hide-details>
            </v-text-field>
          </v-card>

          <v-sheet class="space-x-2">
            <v-btn color="brown" @click="changeView(true)" v-bind="props"><v-icon start>mdi
                mdi-delete-clock</v-icon>ถังขยะ</v-btn>
            <v-btn color="deep-purple" @click="onShowDialog('add')" v-bind="props"><v-icon start>mdi
                mdi-plus</v-icon>เพิ่มผู้ใช้งาน</v-btn>
          </v-sheet>
        </div>

        <v-row no-gutters v-if="list?.length">
          <LayoutList :layout="displayed" v-on:showDialog="onShowDialog" v-on:getid="UserGetID"
            v-on:delete="UserDelete" v-on:url="RouterLinkID"/>
        </v-row>

        <h1 v-if="!list?.length" class="text-2xl flex justify-center">ไม่มีข้อมูล</h1>

        <v-pagination v-if="(searchData == '' && list?.length)" class="page" v-model="currentPage"
          :length="totalPages"></v-pagination>

        <v-dialog class="z-0 " v-model="showDialog" width="1024" persistent>
          <Dialog :dialog="dialog" v-on:out="reset" v-on:add="UserAddSubmit" v-on:update="UserUpdateSubmit"
            v-on:delete="UserDelete">
          </Dialog>
        </v-dialog>
      </div>

      <div class="" v-if="(view_bin == true && !delete_user?.loading)">
        <div class="flex justify-end p-4">
          <v-sheet class="space-x-2">
            <v-btn color="grey-darken-1" @click="changeView(false)" v-bind="props"><v-icon
                start>mdi-arrow-left</v-icon>ย้อนกลับ</v-btn>
          </v-sheet>
        </div>

        <v-row no-gutters v-if="list?.length">
          <LayoutListDelete :layout="displayed" v-on:restore="UserUnDelete" v-on:deletebackup="UserDeleteBackup" />
        </v-row>

        <h1 v-if="!list?.length" class="text-2xl flex justify-center">ไม่มีข้อมูล</h1>

        <v-pagination v-if="(searchData == '' && list?.length)" class="page" v-model="currentPage"
          :length="totalPages"></v-pagination>
      </div>

      <div v-if="(user?.loading || delete_user?.loading)">
        <loading3 />
      </div>

    </div>

  </div>
</template>

<script>
export default {
  name: 'User',
  setup() { },
  data() {
    return {
      view_bin: false,
      route: null,

      user: { loading: true },
      user_id: null,
      delete_user: { loading: true },

      token: null,

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
            password: null,
          },
          image: {
            photo: null,
          }
        },
        input_update: {
          data: {
            name: null,
            username: null,
            password: null,
          },
          image: {
            photo: null,
          }
        },
        data_id: {
          id: null,
          data: {
            name: null,
            username: null,
            create_time: null,
            update_time: null,
          },
          image: {
            photo: null,
          }
        },
        title: {
          name: Title().name,
          username: Title().username,
          password: Title().password,
          photo: Title().photo,
          create_time: Title().create_time,
          update_time: Title().update_time,
        }
      },
      layout: {
        type: "manage",
        id: null,
        data: {
          name: null,
          username: null,
        },
        image: {
          photo: null,
        },
        title: {
          name: Title().name,
          username: Title().username,
          photo: Title().photo,
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
    this.getRoute()
    this.token = await useTokenStore().DeCode(PiniaRoot.token.token)
    this.UserDataStore()
    this.UserGetDelete()
  },
  methods: {
    // ...mapActions(useTokenStore, ['GetToken']),
    // ...mapActions(useCompanyStore, ['GetID_admin']),
    ...mapActions(useUserStore, ['Get_User_A', 'Get_User_ID_A', 'Add_User_ID_A', 'Update_User_ID_A',
      'Delete_User_ID_A', 'Get_Delete_User_A', 'UnDelete_User_ID_A', 'DeleteBackup_User_ID_A', 'Filter_User_By_Company_ID']),
    ...mapActions(useTokenStore, ['TokenGetIDuser']),
    getRoute() {
      this.route = this.$route
    },
    // แก้ไข เพิ่ม ฟังชั้น สลับ ผู้ใช้ จาก Admin ไป User
    async SelectUser(id) {
      //เรียกข้อมูล token user
      let tokenswitching = await useTokenStore().TokenGetIDuser(id)
      // set localStorage
      localStorage.setItem('token', tokenswitching)
      localStorage.setItem('token_admin', useTokenStore().token)
      localStorage.setItem('menu', 'user')
      // เรียกใช้ Action store CheckDateToken เพื่อยืนยันตัวตนใหม่อีกรอบ
      useTokenStore().CheckDateToken()
      // นำทางไป หน้า Dashboard User
      this.$router.push('/user/dashboard')
    },
    async onShowDialog(type) {
      this.showDialog = true
      this.dialog.type = type
    },
    async changeView(type) {
      this.view_bin = type;
      this.view_bin == false
        ? this.list = await this.filteredList(this.user)
        : this.list = await this.filteredList(this.delete_user)
      this.currentPage = 1
    },
    async filteredList(data) {
      let queryID = this.route?.query?.id
      return data.filter(item => item.list_personnel_id == queryID);
    },
    async UserDataStore() {
      
      let company_id = this.token.DataUser.company_id
      const UserStore = useUserStore()
      this.user = { loading: true }
      const response = await this.Get_User_A(PiniaRoot.token.token)
      if (typeof response == 'string') {
        await sweetalert2.warning(response)
      }
      this.user = await UserStore.$state.data
      // this.user = await this.Filter_User_By_Company_ID(company_id)
      this.list = await this.filteredList(this.user)
    },
    async UserGetID(id) {
      let company_id = this.token.DataUser.company_id
      const UserStore = useUserStore()
      this.user_id = { loading: true }
      const response = await this.Get_User_A(PiniaRoot.token.token)
      if (typeof response == 'string') {
        await sweetalert2.warning(response)
      }
      this.user_id = await UserStore.$state.data.find(p => p.id == id)
      if (!this.user_id) {
        this.user_id = { loading: true }
        const response = await this.Get_User_ID_A(PiniaRoot.token.token, id)
        if (typeof response == 'string') {
          await sweetalert2.warning(response)
        }
        this.user_id = UserStore.$state.data_id
      }
      this.dialog.data_id.id = id
      for (const key in this.user_id) {
        if (this.dialog.data_id.data[key] !== undefined) {
          this.dialog.data_id.data[key] = this.user_id[key]
        } else if (this.dialog.data_id.image[key] !== undefined) {
          this.dialog.data_id.image[key] = this.user_id[key]
        }

        if (this.dialog.input_update.data[key] !== undefined) {
          this.dialog.input_update.data[key] = this.user_id[key]
        } else if (this.dialog.input_update.image[key] !== undefined) {
          this.dialog.input_update.image[key] = this.user_id[key]
          this.dialog.base64String = this.user_id[key]
        }
      }
    },
    async UserAddSubmit(datas) {
      let queryID = this.route?.query?.id
      let add_data = {
        ...datas.data, ...datas.image,
        company_id: this.token.DataUser.company_id,
        list_personnel_id: queryID,
      }
      const response = await this.Add_User_ID_A(PiniaRoot.token.token, add_data);
      if (typeof response == 'string') {
        this.reset('dialog.input_add')
        await sweetalert2.warning(response)
      }
      else {
        this.reset('dialog.input_add')
        await sweetalert2.success('สำเร็จ')
      }
      await this.UserDataStore()
    },
    async UserUpdateSubmit(id, datas) {
      let company_id = this.token.DataUser.company_id
      const UserStore = useUserStore()
      const temp_update = await UserStore.$state.data.find(p => p.id == id)
      let update_data = {
        ...datas.data, ...datas.image,
        company_id: company_id,
      }
      const response = await this.Update_User_ID_A(PiniaRoot.token.token, update_data, id)
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
        this.user = UserStore.$state.data
        this.list = await this.filteredList(this.user)
        this.reset('dialog.input_update')
        await sweetalert2.success('สำเร็จ')
      }
    },
    async UserDelete(id) {
      sweetalert2.Delete('ลบข้อมูล', 'คุณแน่ใจใช่หรือไม่', id, async res => {
        if (res[0].isConfirmed == true) {
          let company_id = this.token.DataUser.company_id
          const UserStore = useUserStore()
          const response = await this.Delete_User_ID_A(PiniaRoot.token.token, id);
          if (typeof response == 'string') {
            await sweetalert2.warning(response)
          }
          else {
            const temp_Delete = await UserStore.$state.data.find(p => p.id == id)
            await UserStore.$state.delete_data.push(temp_Delete)
            UserStore.$state.data = await UserStore.$state.data.filter((Delete) => Delete.id != id);
            this.user = UserStore.$state.data
            this.list = await this.filteredList(this.user)
            sweetalert2.success('สำเร็จ')
          }
        };
      });
    },
    async UserGetDelete() {
      let company_id = this.token.DataUser.company_id
      const UserStore = useUserStore()
      this.delete_user = { loading: true }
      const response = await this.Get_Delete_User_A(PiniaRoot.token.token)
      if (typeof response == 'string') {
        await sweetalert2.warning(response)
      }
      this.delete_user = UserStore.$state.delete_data
    },
    async UserUnDelete(id) {
      sweetalert2.Delete('กู้คืนข้อมูล', 'คุณแน่ใจใช่หรือไม่', id, async res => {
        if (res[0].isConfirmed == true) {
          let company_id = this.token.DataUser.company_id
          const UserStore = useUserStore()
          const response = await this.UnDelete_User_ID_A(PiniaRoot.token.token, id);
          if (typeof response == 'string') {
            await sweetalert2.warning(response)
          }
          else {
            const temp_UnDelete = await UserStore.$state.delete_data.find(p => p.id == id)
            let i = 0
            while (i < this.user?.length && this.user[i].id < temp_UnDelete.id) i++
            await UserStore.$state.data.splice(i, 0, temp_UnDelete)

            UserStore.$state.delete_data = await UserStore.$state.delete_data.filter((UnDelete) => UnDelete.id != id);
            this.delete_user = UserStore.$state.delete_data
            this.list = await this.filteredList(this.delete_user)
            sweetalert2.success('สำเร็จ')
          }
        };
      });
    },
    async UserDeleteBackup(id) {
      sweetalert2.Delete('ลบข้อมูลถาวร', 'คุณแน่ใจใช่หรือไม่', id, async res => {
        if (res[0].isConfirmed == true) {
          let company_id = this.token.DataUser.company_id
          const UserStore = useUserStore()
          const response = await this.DeleteBackup_User_ID_A(PiniaRoot.token.token, id);
          if (typeof response == 'string') {
            await sweetalert2.warning(response)
          }
          else {
            UserStore.$state.delete_data = await UserStore.$state.delete_data.filter((UnDelete) => UnDelete.id != id);
            this.delete_user = UserStore.$state.delete_data
            this.list = await this.filteredList(this.delete_user)
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
    async RouterLinkID(id) {
      
      const TokenStore = useTokenStore()
      const token_second = await TokenStore.TokenGetIDuser(id)
      const response = await TokenStore.DeCode(token_second)
      await TokenStore.SwitchToken(response.DataUser.roles, token_second)
      
      if (response.DataUser.roles == 'user') {
        useTokenStore().menu = response.DataUser.roles;
        localStorage.setItem('menu', response.DataUser.roles)
        this.$router.push('/user/dashboard')
      }
    },
  }
}
</script>
<style>
html {
  scroll-behavior: smooth !important;
}
</style>
