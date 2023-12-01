<script setup>
import sweetalert2 from '@/assets/js/controller/switchalert'
import { computed } from 'vue'
import { mapActions } from 'pinia'
import { useDisplay } from 'vuetify'

import { useSuperAdminStore, useTokenStore, PiniaRoot } from '@/stores/'
import loading4 from '@/components/Loading-Layout-Setting.vue'

const { name } = useDisplay()
</script>
<template>
  <div class="justify-start align-center w-full h-full">
    <div class="ma-10 space-y-5 justify-start align-center h-auto">
      <h1 class="text-3xl">การตั้งค่าโปรไฟล์</h1>
      <div class="space-y-5" v-if="data_store != null">
        <v-card class="d-flex w-full" height="650" selevation="5" rounded="xl">

          <v-col class="d-flex pa-4" v-if="data_store != null">
            <v-row no-gutters class="d-flex justify-center align-center">
              <v-avatar size="200" color="grey-darken-2" class="rounded-full ma-6">
                <v-img v-if="data_store.photo != null" width="300" :aspect-ratio="1" cover
                  :src="data_store.photo"></v-img>
                <v-icon v-else color="watch" icon="mdi mdi-account" size="100"></v-icon>
                <!-- <v-icon color="watch" icon="mdi mdi-account" size="100"></v-icon> -->
              </v-avatar>

              <v-col cols="12">
                <v-row class="ma-2">
                  <v-col class="space-y-1">
                    <h2>ชื่อ-นามสกุล</h2>
                    <!-- <v-text-field disabled v-model="data_store.name" name="name" type="text"></v-text-field> -->
                    <div class="bg-gray-100 p-4">{{ data_store.name }}</div>
                  </v-col>

                  <v-col class="space-y-1">
                    <h2>ชื่อผู้ใช้งาน</h2>
                    <!-- <v-text-field disabled v-model="data_store.username" name="username" type="text"></v-text-field> -->
                    <div class="bg-gray-100 p-4">{{ data_store.username }}</div>
                  </v-col>

                  <v-col class="space-y-1">
                    <h2>ตำแหน่ง</h2>
                    <!-- <v-text-field disabled v-model="data_token.roles" name="roles" type="text"></v-text-field> -->
                    <div class="bg-gray-100 p-4">{{ data_token.roles }}</div>
                  </v-col>

                </v-row>

                <v-row class="ma-2">
                  <v-col class="space-y-1">
                    <h2>วันที่สร้าง</h2>
                    <!-- <v-text-field disabled v-model="data_store.create_time" name="create_time" type="text"></v-text-field> -->
                    <div class="bg-gray-100 p-4">{{ data_store.create_time }}</div>
                  </v-col>
                  <v-col class="space-y-1">
                    <h2>วันที่อัปเดต</h2>
                    <!-- <v-text-field disabled v-model="data_store.update_time" name="update_time" type="text"></v-text-field> -->
                    <div class="bg-gray-100 p-4">{{ data_store.update_time }}</div>
                  </v-col>
                </v-row>

              </v-col>

              <v-card-actions>
                <v-btn type="" prepend-icon="mdi-pencil" variant="tonal" color="indigo-darken-3"
                  @click="reveal = true">แก้ไข</v-btn>
              </v-card-actions>

            </v-row>
          </v-col>

          <v-expand-transition>
            <!-- update -->
            <v-card v-if="reveal" ref="form_update" class="v-card--reveal w-full h-full" style="height: 100%">

              <v-card-text class="pb-9">
                <v-form v-model="formupdate" @submit.prevent="onSubmitupdate">
                  <v-col class="d-flex align-center space-x-12">
                    <v-row no-gutters class="d-flex justify-center align-center">
                      <v-avatar size="200" color="grey-darken-2" class="rounded-full ma-6">
                        <v-img v-if="data_store.photo != null" width="300" :aspect-ratio="1" cover
                          :src="data_store.photo"></v-img>
                        <v-icon v-else color="watch" icon="mdi mdi-account" size="100"></v-icon>
                      </v-avatar>

                      <v-col cols="12">
                        <v-row class="ma-0">
                          <v-col class="space-y-1">
                            <h2>ชื่อ-นามสกุล</h2>
                            <v-text-field v-model="nameSuperadmin" :rules="validationName" :readonly="loadingupdate"
                              name="name" type="text">
                            </v-text-field>
                          </v-col>

                          <v-col class="space-y-1">
                            <h2>ชื่อผู้ใช้งาน</h2>
                            <v-text-field v-model="usernameSuperadmin" :rules="validationUsername"
                              :readonly="loadingupdate" name="username" type="text">
                            </v-text-field>
                          </v-col>

                          <v-col class="space-y-1">
                            <h2>รหัสผ่าน</h2>
                            <v-text-field v-model="passwordSuperadmin" :rules="validationPassword"
                              :readonly="loadingupdate" name="password" type="text">
                            </v-text-field>
                          </v-col>
                        </v-row>

                        <v-row class="ma-0">
                          <v-col class="space-y-1">
                            <h2>เลือกรูปโปรไฟล์</h2>
                            <v-file-input label="เลือกรูปโปรไฟล์" variant="filled" prepend-icon="mdi-camera"
                              @change="ReadURL('Update', $event)"></v-file-input>
                          </v-col>
                        </v-row>
                      </v-col>

                      <v-card-actions>
                        <!-- <v-btn type="submit" prepend-icon="mdi-check" variant="tonal" color="#5865f2" @click="reveal = false">บันทึก</v-btn> -->
                        <v-btn class="mr-2" color="success" prepend-icon="mdi-check" :disabled="!formupdate"
                          :loading="loadingupdate" type="submit" variant="text">
                          <span class="">บันทึก </span>
                        </v-btn>
                        <v-btn type="" prepend-icon="mdi-cancel" variant="tonal" color="#C62828"
                          @click="reveal = false">ยกเลิก</v-btn>
                      </v-card-actions>

                    </v-row>
                  </v-col>
                </v-form>
              </v-card-text>
            </v-card>
          </v-expand-transition>
        </v-card>
        <div></div>
      </div>
      <!-- Loading 4 -->
      <div v-else>
        <loading4></loading4>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SettingSuperadmin',
  data() {
    return {
      data_store: null,
      data_token: null,
      data_id: null,

      formupdate: false,
      loadingupdate: false,

      nameSuperadmin: '',
      usernameSuperadmin: '',
      passwordSuperadmin: '',
      photoSuperadmin: '',

      validationName: [(v) => !!v || 'กรุณาป้อนชื่อจริง'],
      validationUsername: [(v) => !!v || 'กรุณาป้อนชื่อผู้ใช้'],
      validationPassword: [(v) => !!v || 'กรุณาป้อนรหัสผ่าน'],

      reveal: false,
      namephoto: null,
      base64String: null,



      rule: [(v) => (v ? true : 'กรุณากรอกข้อมูล')],
      validation: false
    }
  },
  async created() {
    await this.SettingUserGetID()
  },
  watch: {},
  methods: {
    ...mapActions(useSuperAdminStore, ['Get_SuperAdmin_ID_S', 'Update_SuperAdmin_ID_S', 'Get_SuperAdmin_S']),
    ...mapActions(useTokenStore, ['DeCode']),
    async SettingUserGetID() {
      const DataToken = await PiniaRoot.token.deCoded
      if (DataToken != null) {
        this.data_token = DataToken.DataUser
      } else {
        const response = await useTokenStore().DeCode()
        this.data_token = response.DataUser
      }
      
      const SuperadminStore = await useSuperAdminStore()
      const response = SuperadminStore.$state.data_id == null
        ? await this.Get_SuperAdmin_ID_S(PiniaRoot.token.token, this.data_token.id)
        : await SuperadminStore.$state.data_id
      typeof response[0] == 'string'
        ? await sweetalert2.warning(response)
        : (this.data_store = response[0])
      // this.name = this.data_store.name
      this.nameSuperadmin = this.data_store.name
      this.usernameSuperadmin = this.data_store.username
      this.passwordSuperadmin = null
      this.photoSuperadmin = this.data_store.photo
    },
    async onSubmitupdate() {
      if (!this.formupdate) return
      this.loading = true
      const formData = {
        name: this.nameSuperadmin,
        username: this.usernameSuperadmin,
        password: this.passwordSuperadmin,
        photo: this.base64String == null ? this.photoSuperadmin : this.base64String
      }
      const SuperAdminStore = useSuperAdminStore()
      let update_data = { ...formData }
      await sweetalert2.Delete("ยืนยันเพื่อ ออกจากระบบ", '', '', async res => {
        if (res[0].isConfirmed == true) {
          const response = await this.Update_SuperAdmin_ID_S(PiniaRoot.token.token, update_data, this.data_token.id)
          if (typeof response == 'string') {
            await sweetalert2.warning(response)
          } else {
            await sweetalert2.success('สำเร็จ')
            SuperAdminStore.$state.data_id = update_data
            this.data_store.name = update_data.name
            this.data_store.username = update_data.username
            this.reveal = false
            await this.$router.push('/')
          }
        }
      })

    },
    async ReadURL(name, event) {
      const file = await event.target.files[0]
      if (file) {
        const maxSizeInBytes = 4 * 1024 * 1024; // 4 MB in bytes
        if (file.size <= maxSizeInBytes) {
          this.namephoto = file.name;
          this.base64String = await this.readFileAsBase64(file);
          this.data_store.photo = this.base64String;
          // name == "Update"
          //   ? this.data_store.photo = URL.createObjectURL(file)
          //   : '';
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
  }
}
</script>
<style>
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>
