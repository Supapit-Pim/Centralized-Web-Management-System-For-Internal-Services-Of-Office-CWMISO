<script setup>
import sweetalert2 from '@/assets/js/controller/switchalert'
import { mapActions } from 'pinia'
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useCompanyStore, useTypeCompanyStore, useAdminStore, useTokenStore, PiniaRoot } from '@/stores/'
import PictureInput from 'vue-picture-input'
import useHandlePage from '@/utils/handlePage'
import useHandleDatetime from '@/utils/handleDatetime'
import loading5 from '@/components/Loading-Layout-Card-Col3.vue'

import Title from '@/utils/Title'
import Dialog from '@/components/Dialog.vue'
import LayoutCard from '@/components/Layout-Card.vue'
import LayoutListDelete from '@/components/Layout-List-Delete.vue'
import { useRouter } from 'vue-router'

const { name } = useDisplay()

</script>

<template>
  <div class="p-5 space-y-5 w-full h-full ">
    <h1 class="text-3xl">{{ view_bin ? 'ถังขยะของสำนักงานทั้งหมด' : 'สำนักงานทั้งหมด' }}</h1>

    <div class="" v-if="view_bin == false && !company?.loading">
      <!-- NOTE search and betton -->
      <div class="flex justify-between my-6">
        <v-card class="rounded-pill" elevation="1" width="50%">
          <v-text-field v-model="searchData" density="compact" variant="solo" label="ค้นหาชื่อสำนักงาน หรือ ชื่อสำนักงาน ภาษาอังกฤษ"
            append-inner-icon="mdi-magnify" single-line hide-details>
          </v-text-field>
        </v-card>

        <v-sheet class="space-x-2 bg-transparent">
          <v-btn color="brown" @click="changeView(true)" v-bind="props"><v-icon start>mdi
              mdi-delete-clock</v-icon>ถังขยะ</v-btn>
          <v-btn color="deep-purple" @click="onShowDialog('add')" v-bind="props"><v-icon start>mdi
              mdi-plus</v-icon>เพิ่มสำนักงาน</v-btn>
        </v-sheet>
      </div>

      <LayoutCard v-if="company?.length" :layout="displayed" v-on:url="RouterLinkID" v-on:delete="CompanyDelete"
        v-on:add="onShowDialogAddAdmin" v-on:getid="CompanyGetID" v-on:showDialog="onShowDialog" />

      <h1 v-if="!company?.length" class="text-2xl flex justify-center">ไม่มีข้อมูล</h1>

      <v-pagination v-if="(searchData == '' && company?.length)" class="page my-10" v-model="currentPage"
        :length="totalPages"></v-pagination>

      <v-dialog class="z-0" v-model="showDialog" width="1024" persistent>
        <Dialog :dialog="dialog" v-on:out="reset" v-on:getid="CompanyGetID" v-on:add="CompanyAddSubmit"
          v-on:update="CompanyUpdateSubmit" v-on:delete="CompanyDelete">
        </Dialog>
      </v-dialog>

      <!-- NOTE Add Admin -->
      <v-dialog v-model="showDialogAdd" width="1024">
        <v-card>
          <v-card-text>
            <v-card-title class="d-flex align-center flex-column mb-6 text-center text-2xl space-y-1">
              <v-sheet class="text-2xl">เพิ่มผู้ดูแลระบบ</v-sheet>
              <v-divider class="border-opacity-100 w-1/2"></v-divider>
              <v-sheet class="text-lg w-auto">{{ topicAddAdmin.name }}</v-sheet>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>

                  <v-col cols="12" no-gutters class="lg:w-56 pa-0 d-lg-flex justify-center align-center">
                    <v-sheet class="text-center space-y-5">
                      <v-avatar v-if="add_admin.photo != null" rounded-full size="200"
                        :image="add_admin.photo"></v-avatar>
                      <v-avatar v-else rounded-full size="200" color="grey-lighten-3">
                        <v-icon color="grey-darken-3" icon="mdi mdi-account" size="100"></v-icon>
                      </v-avatar>

                      <v-file-input class="xl:w-56" label="File input" variant="underlined" prepend-icon="mdi-camera"
                        type='file' :show-size="1000" :rules="rule" :clearable="false" @change="ReadURL('Add', $event)"
                        required>
                      </v-file-input>
                    </v-sheet>
                  </v-col>

                  <v-col cols="12" sm="6">
                    <v-text-field label="Name" type="text" hint="กรุณากรอกข้อมูล" v-model="add_admin.name"
                      required></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field label="Username" type="text" hint="กรุณากรอกข้อมูล"
                      v-model="add_admin.username"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field label="Password" type="password" hint="กรุณากรอกข้อมูล" v-model="add_admin.password"
                      required></v-text-field>
                  </v-col>

                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="showDialogAdd = false">
                Close
              </v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="showDialogAdd = false, AdminAdd(add_admin)">
                Save
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>

    <div class="" v-if="(view_bin == true && !delete_company?.loading)">
      <div class="flex justify-end p-4">
        <v-sheet class="space-x-2">
          <v-btn color="grey-darken-1" @click="changeView(false)" v-bind="props"><v-icon
              start>mdi-arrow-left</v-icon>ย้อนกลับ</v-btn>
        </v-sheet>
      </div>

      <v-row no-gutters v-if="delete_company?.length">
        <LayoutListDelete :layout="displayed" v-on:restore="CompanyUnDelete" v-on:deletebackup="CompanyDeleteBackup" />
      </v-row>

      <h1 v-if="!delete_company?.length" class="text-2xl flex justify-center">ไม่มีข้อมูล</h1>

      <v-pagination v-if="(searchData == '' && delete_company?.length)" class="page" v-model="currentPage"
        :length="totalPages"></v-pagination>
    </div>

    <div v-if="(company?.loading || delete_company?.loading)">
      <loading5 />
    </div>

  </div>
</template>

<script>
export default {
  name: 'Company',
  setup() { },
  data() {
    return {
      view_bin: false,

      company: null,
      topicAddAdmin: null,
      typecompany: null,
      delete_company: null,

      admins: null,

      list: [1],
      itemsPerPage: 12,
      currentPage: 1,

      searchData: '',

      showDialogAdd: false,
      showDialog: false,
      dialog: {
        type: 'add',
        base64String: null,
        select: { type_company_id: null },
        input_add: {
          data: {
            number: null,
            name: null,
            name_eng: null,
            address: null,
            location: null,
            tel: null,
            flash: null,
          },
          image: {
            logo: null,
          },
          select: {
            type_company_id: null,
          },
        },
        input_update: {
          id: null,
          type_company_id: null,
          data: {
            number: null,
            name: null,
            name_eng: null,
            address: null,
            location: null,
            tel: null,
            flash: null
          },
          image: {
            logo: null,
          },
          select: {
            type_company_id: null,
          },
        },
        data_id: {
          id: null,
          type_company_id: null,
          data: {
            type_company_id: null,
            number: null,
            name: null,
            name_eng: null,
            address: null,
            location: null,
            tel: null,
            flash: null,
            create_time: null,
            update_time: null,
          },
          image: {
            logo: null,
          },
        },
        title: {
          id: Title().id,
          name: Title().name_company,
          name_eng: Title().name_eng,
          logo: Title().photo,
          number: Title().number,
          address: Title().address,
          location: Title().location,
          tel: Title().tel,
          flash: Title().flash,
          type_company_id: Title().type_company_id,
          create_time: Title().create_time,
          update_time: Title().update_time,
        },
      },
      layout: {
        id: null,
        admin: null,
        data: {
          name: null,
          name_eng: null,
          number: null,
        },
        image: {
          logo: null,
        },

      },
      add_admin: {
        name: null,
        username: null,
        password: null,
        company_id: null,
        photo: null,
      },

      base64String: null,
      namephoto: null,

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

      //NOTE - จัดการข้อมูล layout ก่อนส่งไปให้ยัง LayoutCard
      this.layout.id = data.map((data) => data.id)
      this.layout.data = data.map(({ name, name_eng, number }) => ({ name, name_eng, number }));
      this.layout.image.logo = data.map((data) => data.logo)

      //NOTE หา company ที่มี admin ให้แสดง ชื่อ ถ้าไม่มีให้แสดง null และมีปุ่มเพิ่ม admin
      this.layout.admin = this.layout.id.map(com_id => {
        const matching = this.admins.find(item => item.company_id == com_id)
        return matching ? { id: matching.id, name: matching.name } : null
      })
      return this.layout
    },
  },
  async created() {
    //NOTE - call data Company
    this.CompanyDataStore()
    this.CompanyGetDelete()
    //NOTE - if (localStorage have token_second) will remove token_second in localStorage
    this.localStorage()
  },
  methods: {
    ...mapActions(useCompanyStore, ['Get_Company_S', 'Get_Company_ID_S', 'Update_Company_ID_S', 'Add_Company_ID_S', 'Get_Delete_Company_S', 'Delete_Company_ID_S', 'UnDelete_Company_ID_S', 'DeleteBackup_Company_ID_S']),
    ...mapActions(useAdminStore, ['Get_Admin_S', 'Add_Admin_ID_S']),
    ...mapActions(useTypeCompanyStore, ['Get_TypeCompany_S']),
    ...mapActions(useTokenStore, ['TokenGetIDadmin']),

    async onShowDialogAddAdmin(id) {
      this.topicAddAdmin = this.list.find((data) => { return data.id == id ? data.name : null; })
      this.showDialogAdd = true
      this.add_admin.company_id = id
    },
    async AdminAdd(data) {
      data.photo = this.base64String;
      const AdminStore = useAdminStore()
      const response = await AdminStore.Add_Admin_ID_S(PiniaRoot.token.token, data)
      typeof response != "string"
        ? await sweetalert2.success('สำเร็จ')
        : await sweetalert2.warning(response)
    },
    async RouterLinkID(data) {
      const admin = data[1]
      const id = data[0]
      //NOTE - find admin_id from company_id
      // const admin_id = this.admins.find(p => p.company_id == id).id
      //NOTE - Set token_second in LocalStorage

      const TokenStore = useTokenStore()
      const token_second = await TokenStore.TokenGetIDadmin(admin.id)
      const response = await TokenStore.DeCode(token_second)
      await TokenStore.SwitchToken(response.DataUser.roles, token_second)
      if (response.DataUser.roles == 'admin') {
        useTokenStore().menu = response.DataUser.roles;
        localStorage.setItem('menu', response.DataUser.roles)
        this.$router.push('/admin/dashboard')
      }
    },
    async localStorage() {
      localStorage.getItem("token_second") != null
        ? localStorage.removeItem('token_second')
        : '';
    },
    async onShowDialog(type) {
      this.showDialog = true;
      this.dialog.type = type;
    },
    async changeView(type) {
      this.view_bin = type;
      this.view_bin == false
        ? this.list = await this.AddTypeCompany(this.company)
        : this.list = await this.AddTypeCompany(this.delete_company)
      this.currentPage = 1
    },
    async CompanyDataStore() {
      const CompanyStore = useCompanyStore()
      const AdminStore = useAdminStore()
      const TypeCompanyStore = useTypeCompanyStore()

      this.company = { loading: true }
      const response1 = await this.Get_Company_S(PiniaRoot.token.token)
      if (typeof response1 == 'string') {
        await sweetalert2.warning(response1)
      }
      this.admins = { loading: true }
      const response2 = await this.Get_Admin_S(PiniaRoot.token.token)
      if (typeof response2 == 'string') {
        await sweetalert2.warning(response2)
      }
      //NOTE - การเรียก type company และ Check data จาก Store
      this.type_social = { loading: true }
      const response3 = await this.Get_TypeCompany_S(PiniaRoot.token.token)
      if (typeof response3 == 'string') {
        await sweetalert2.warning(response3)
      }
      this.company = CompanyStore.$state.data
      this.admins = AdminStore.$state.data
      this.typecompany = TypeCompanyStore.Typecompany
      this.dialog.select.type_company_id = await TypeCompanyStore.$state.typecompany
      this.list = await this.AddTypeCompany(this.company)
    },
    async CompanyGetID(id) {
      const CompanyStore = useCompanyStore()
      this.data_id = await CompanyStore.$state.data.find(p => p.id == id)
      this.dialog.data_id.id = id

      for (const key in this.data_id) {
        if (this.dialog.data_id.data[key] !== undefined) {
          this.dialog.data_id.data[key] = this.data_id[key]
        } else if (this.dialog.data_id.image[key] !== undefined) {
          this.dialog.data_id.image[key] = this.data_id[key]
        }

        if (this.dialog.input_update.data[key] !== undefined) {
          this.dialog.input_update.data[key] = this.data_id[key]
        } else if (this.dialog.input_update.image[key] !== undefined) {
          this.dialog.input_update.image[key] = this.data_id[key]
          this.dialog.base64String = this.data_id[key]
        }
      }
      // แปลค่า type company
      const data_typecompanyid = await this.FindTypeCompany(this.dialog.data_id.data.type_company_id);
      this.dialog.data_id.type_company_id = data_typecompanyid.id
      this.dialog.data_id.data.type_company_id = data_typecompanyid.name
      // this.dialog.input_update.select.type_company_id = await this.FindTypeCompany(this.data_id.type_company_id);
      this.dialog.input_update.select.type_company_id = data_typecompanyid.id
      this.dialog.input_update.type_company_id = data_typecompanyid
    },
    async CompanyAddSubmit(datas) {
      const CompanyStore = useCompanyStore()
      const add_data = { ...datas.data, ...datas.image, ...datas.select }
      const response = await this.Add_Company_ID_S(PiniaRoot.token.token, add_data);
      if (typeof response == 'string') {
        await sweetalert2.warning(response)
        this.reset("input_add")
      } else {
        this.company = CompanyStore.$state.data
        this.list = await this.AddTypeCompany(this.company)
        this.reset("input_add")
        await sweetalert2.success('สำเร็จ')
      }
    },
    async CompanyUpdateSubmit(id, datas) {
      const CompanyStore = useCompanyStore()
      const update_data = { ...datas.data, ...datas.image, ...datas.select }
      const temp_update = await CompanyStore.$state.data.find(p => p.id == id)
      const response = await this.Update_Company_ID_S(PiniaRoot.token.token, update_data, id)
      if (typeof response == 'string') {
        this.reset("input_update")
        await sweetalert2.warning(response)
      } else {
        for (const key in this.dialog.input_update.data) {
          temp_update[key] = update_data[key]
        }
        temp_update.logo = update_data.logo;
        temp_update.type_company_id = update_data.type_company_id;
        temp_update.update_time = useHandleDatetime.isoStrToLocalStr(new Date())
        this.company = CompanyStore.$state.data
        this.list = await this.AddTypeCompany(this.company)
        this.reset("input_update")
        await sweetalert2.success('สำเร็จ')
      }
    },
    async CompanyDelete(id) {
      sweetalert2.Delete('ลบข้อมูล', 'คุณแน่ใจใช่หรือไม่', id, async (res) => {
        if (res[0].isConfirmed == true) {
          const CompanyStore = useCompanyStore()
          const response = await this.Delete_Company_ID_S(PiniaRoot.token.token, id)
          if (typeof response == 'string') {
            sweetalert2.warning(response)
          }
          else {
            const temp_Delete = await CompanyStore.$state.data.find(p => p.id == id)
            await CompanyStore.$state.delete_data.push(temp_Delete)
            CompanyStore.$state.data = await CompanyStore.$state.data.filter((Delete) => Delete.id != id)
            this.company = CompanyStore.$state.data
            this.list = await this.AddTypeCompany(this.company)
            sweetalert2.success('สำเร็จ')
          }
        }
      })
    },
    async CompanyGetDelete() {
      const CompanyStore = useCompanyStore()
      if (CompanyStore.$state.delete_data == null) {
        const response = await this.Get_Delete_Company_S(PiniaRoot.token.token)
        if (typeof response == 'string') {
          await sweetalert2.warning(response)
        }
      }
      this.delete_company = CompanyStore.$state.delete_data
      // this.$router.push('/superadmin/backup/' + 'company');
    },
    async CompanyUnDelete(id) {
      sweetalert2.Delete('กู้คืนข้อมูล', 'คุณแน่ใจใช่หรือไม่', id, async res => {
        if (res[0].isConfirmed == true) {
          const CompanyStore = useCompanyStore()
          const response = await this.UnDelete_Company_ID_S(PiniaRoot.token.token, id);
          if (typeof response == 'string') {
            await sweetalert2.warning(response)
          }
          else {
            const temp_UnDelete = await CompanyStore.$state.delete_data.find(p => p.id == id)
            let i = 0
            while (i < this.company?.length && this.company[i].id < temp_UnDelete.id) i++
            await CompanyStore.$state.data.splice(i, 0, temp_UnDelete)

            CompanyStore.$state.delete_data = await CompanyStore.$state.delete_data.filter((UnDelete) => UnDelete.id != id);
            this.delete_company = CompanyStore.$state.delete_data
            this.list = this.delete_company
            sweetalert2.success('สำเร็จ')
          }
        };
      });
    },
    async CompanyDeleteBackup(id) {
      sweetalert2.Delete('ลบข้อมูลถาวร', 'คุณแน่ใจใช่หรือไม่', id, async res => {
        if (res[0].isConfirmed == true) {
          const CompanyStore = useCompanyStore()
          const response = await this.DeleteBackup_Company_ID_S(PiniaRoot.token.token, id);
          if (typeof response == 'string') {
            await sweetalert2.warning(response)
          }
          else {
            CompanyStore.$state.delete_data = await CompanyStore.$state.delete_data.filter((UnDelete) => UnDelete.id != id);
            this.delete_company = CompanyStore.$state.delete_data
            this.list = this.delete_company
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
    async ReadURL(name, event) {
      const file = await event.target.files[0]
      if (file) {
        const maxSizeInBytes = 4 * 1024 * 1024; // 4 MB in bytes
        if (file.size <= maxSizeInBytes) {
          this.namephoto = file.name;
          this.base64String = await this.readFileAsBase64(file);
          this.add_admin.photo = this.base64String;
          name == "Add"
            ? this.add_admin.photo = URL.createObjectURL(file)
            : this.update_photoImage = URL.createObjectURL(file)
        } else {
          alert("File size > 4 MG");
          this.namephoto = null;
        }
      }
    },
    async readFileAsBase64(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          // resolve(reader.result.split(',')[1]);
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      });
    },
    async AddTypeCompany(data) {
      //NOTE - การเพิ่ม type company ลงไปใน data
      const MapA = []
      this.typecompany.map(item => { MapA[item.id] = item.name });
      return data != null
        ? data.map(item => ({
          // คัดลอกคีย์อื่น ๆ ในอ็อบเจ็กต์เดิม
          ...item,
          // เพิ่มคีย์ 'name'
          name: `${MapA[item.type_company_id]} ${item.name}`
        }))
        : null;

    },
    async FindTypeCompany(id, key = null) {
      // แปลค่า type company
      const test = this.typecompany
      const data = id
        ? await test.find(item => item.id == id)
        : null

      return key == null
        ? data
        : key == "name"
          ? data.name
          : data.id
    },
  },
  watch: {
  },
}
</script>
<style>
html {
  scroll-behavior: smooth !important;
}
</style>
