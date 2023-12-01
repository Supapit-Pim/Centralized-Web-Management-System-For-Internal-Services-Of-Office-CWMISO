<script setup>
import { ref } from 'vue';
import sweetalert2 from '@/assets/js/controller/switchalert'
import AppConfig from '@/assets/js/appconfig'
import { useTokenStore } from '@/stores/'
import { getActivePinia } from "pinia"
import { useRouter } from 'vue-router';

</script>
<template>
  <div class="min-h-screen w-full" style="background-image: linear-gradient(#6366f1, #ffffff)">
    <div class="container mx-auto py-40">
      <div class="flex flex-col lg:flex-row w-10/12 lg:w-8/12 bg-white rounded-xl mx-auto shadow-lg overflow-hidden">
        <div class="w-full lg:w-1/2 flex flex-col items-center justify-center p-12"
          style="background-image: url('./images/jeremy.jpg')">
          <h1 class="text-white text-3xl font-medium mb-3">ยินดีต้อนรับ</h1>
          <div>
            <p class="text-white text-lg">ระบบการจัดการเว็บไซต์</p>
          </div>
        </div>
        <div class="w-full lg:w-1/2 py-16 px-12">
          <h2 class="text-3xl mb-2">เข้าสู่ระบบ</h2>
          <p class="mb-4 text-gray-500">ล็อกอินเพื่อทำการเข้าสู่ระบบ</p>
          <form action="#">
            <div>
              <p class="mb-2">ชื่อผู้ใช้งาน</p>
              <input type="text" placeholder="ชื่อผู้ใช้งาน"
                class="input input-success max-w-none border border-gray-400 rounded-lg py-1 px-2 w-full"
                v-model="input.username" />
            </div>
            <div class="mt-8 ">
              <p class="mb-2">รหัสผ่าน</p>
              <div class="input-group">
                <input :type="inputType" placeholder="รหัสผ่าน"
                  class="input input-success border border-gray-400 rounded-l-lg py-1 px-2 w-full"
                  v-model="input.password" />
                <v-icon class="btn px-6 mdi" :class="inputType === 'password' ? 'mdi-eye' : ' mdi-eye-off-outline'"
                  @click="showPassword"></v-icon>
              </div>
            </div>
            <div>
              <div class="mt-3 flex justify-between items-centers">
                <div class="mt-3">
                  <!-- <input type="checkbox" class="mr-2" :checked="input.remember == 1 ? true : false" @change="Remember"/> -->
                  <input type="checkbox" class="mr-2" v-model="isChecked" />
                  <label>จดจำฉัน</label>
                </div>
              </div>
              <p class="max-w-none mt-3 w-full bg-indigo-500 py-3 rounded-lg text-center text-white hover:scale-105 duration-300 cursor-pointer"
                @click="SubmitLogin"> เข้าสู่ระบบ </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
  },
  data() {
    return {
      router: null,
      input: {
        username: '',
        password: '',
      },
      isChecked: ref(false),
      inputType: ref('password')
    }
  },
  watch: {
    useRouter() {
      this.getRouter()
    }
  },
  created() {
    this.getRouter()
    this.input.username = localStorage.getItem('username')
    useTokenStore();
  },
  methods: {
    getRouter() {
      this.router = useRouter()
    },
    async getCheckbox() {
      return this.isChecked;
    },
    async showPassword() {
      this.inputType = this.inputType === 'password' ? 'tel' : 'password';
    },

    // แก้ไข ส่วน login เพิ่ม localStorage มี token_superadmin  token_admin menu เพื่อเก็บค่าที่ต้องใช้ ยืนยันตัวตน
    async SubmitLogin() {
      if ((this.input.username == '' || this.input.username == null) && (this.input.password == '' || this.input.password == null)) {
        sweetalert2.info('Please fill out')
      } else {
        if (this.input.username == '') {
          sweetalert2.warning('please fill out username')
        } else if (this.input.password == '') {
          sweetalert2.warning('please fill out password')
        } else {
          const datauser = {
            username: this.input.username,
            password: this.input.password
          }
          await sweetalert2.sw_loading()
          const response = await AppConfig.CallNotAuth('login', 'POST', datauser)
          if (response.data.status == 422) {
            await sweetalert2.error('Wrong Username and password.')
            this.router.push('/')
          } else {
            await sweetalert2.success('สำเร็จ')
            useTokenStore().token = response.data.token
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('token_superadmin', null)
            localStorage.setItem('token_admin', null)
            if (response.data.roles == "superadmin") {

              useTokenStore().menu = response.data.roles;
              localStorage.setItem('menu', response.data.roles)
              this.router.push('/superadmin/dashboard')

            } else if (response.data.roles == 'admin') {

              useTokenStore().menu = response.data.roles;
              localStorage.setItem('menu', response.data.roles)
              this.router.push('/admin/dashboard')

            } else if (response.data.roles == 'user') {

              useTokenStore().menu = response.data.roles;
              localStorage.setItem('menu', response.data.roles)
              this.router.push('/user/dashboard')

            } else {
              sweetalert2.warning('Sorry you not authority')
            }

            // checkboxValue
            const checkboxValue = await this.getCheckbox();
            checkboxValue == true
              ? this.localStorage_setItem(checkboxValue)
              : this.localStorage_removeItem();
          }
        }
      }
    },
    async localStorage_setItem(value) {
      localStorage.setItem('remeberMe', value)
      localStorage.setItem('username', this.input.username)
      // localStorage.setItem('password', this.input.password)
    },
    async localStorage_removeItem() {
      localStorage.removeItem('remeberMe')
      localStorage.removeItem('username')
      // localStorage.removeItem('password')
    },
  }
}
</script>
