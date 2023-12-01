import { defineStore } from 'pinia'
import AppConfig from '@/assets/js/appconfig'
import { useRouter } from 'vue-router'
import jwt_decode from 'jwt-decode'
export const useTokenStore = defineStore('token', {
  state: () => ({
    token: null,
    tokensuper: 'null',
    tokenadmin: 'null',

    statusUser: null,
    menu: "-",
    remeberMe: null,
    username: null,
    password: null,
    deCode: null,

    // roles: null,
    // companyid: null,
    // listpersonnel: null
  }),
  getters: {
    GetToken:(state) =>{
      return (state.token)
    },

    GetToken_Super:(state) =>{
      return (state.tokensuper)
    },

    GetToken_Admin:(state) =>{
      return (state.tokenadmin)
    },

    Getmenu: (state) => {
      return (state.menu)
    },

    SetstatusUser: (state) => {
      return (state.statusUser = localStorage.getItem('statusUser')
      ? localStorage.getItem('statusUser')
      : null)
    },

    GetstatusUser: (state) => {
      return (state.statusUser)
    },
    GetDeCodeJWT: (state) => {
      return state.deCode
    },
    BackToken: (state) => {
      // สลับ
      var Token = state.deCode
      var Token_second = state.deCode_second

      state.deCode = Token_second
      state.deCode_second = Token
    }
  },
  mutations: {
    
  },
  actions: {
    // ระบุยืนยันตัวตน
    async CheckDateToken() {
      // เซ็ตค่า Token และ เมนู เรียกข้อมูลจาก localstorage ที่เก็บไว้ เวลา Reload webbsite
      this.SetToken();
      this.SetToken_Super();
      this.SetToken_Admin();
      this.Setmenu();

      // ใช้ Token ที่เป็นปัจจุบัน ใน store 
      const response = await AppConfig.CallAuth('token', 'GET', '', this.GetToken)
      let datapase = await this.DeCode();
      // let datapase = jwt_decode(this.token);
      // this.deCode = jwt_decode(this.token);
      // this.deCode = datapase
      //ตรวจ สอบ Token และ Permission 
      if (response.data.data == false || datapase.DataUser.roles != this.menu) {
        // หายืนยันไม่สำเร็จ รีเซ็ตค่า store , localstorage และ ส่ง false
        this.clearToken();
        this.clearToken_Super();
        this.clearToken_Admin();
        this.clearmenu();
        localStorage.removeItem('token')
        localStorage.removeItem('token_superadmin')
        localStorage.removeItem('token_admin')
        localStorage.removeItem('menu')
        return false;
      } else {
        // หากยืนยันสำเร็จ ส่ง true
        return true;
      }
    },

    async DeCode(Token = null){
      Token = Token == null
      ? this.token
      : Token ;
      this.deCode = await jwt_decode(Token);
      return this.deCode
    },

    //เริ่ม ไว้เรียก เซ็ต ค่า store 
    //หากมีการ รีเซ็คหน้าจะเรียกใช้ function 
    SetToken() {
      console.log("SetToke")
      this.token = localStorage.getItem('token') ? localStorage.getItem('token') : null;
    },
    clearToken(){
      console.log("clearToken")
      this.token = null;
    },
    
    SetToken_Super() {
      console.log("SetToken_Super")

      this.tokensuper = localStorage.getItem('token_superadmin')
      ? localStorage.getItem('token_superadmin')
      : null;
      
    },
    clearToken_Super() {
      console.log("clearToken_Super")
      this.tokensuper = null;
    },
    
    SetToken_Admin() {
      console.log("SetToken_Admin")

      this.tokenadmin = localStorage.getItem('token_admin')
      ? localStorage.getItem('token_admin')
      : null;
    },
    clearToken_Admin() {
      console.log("clearToken_Admin")
      this.tokenadmin = null;
    },
    
    SetToken_User() {
      console.log("SetToken_User")

      this.tokenusers = localStorage.getItem('token_user')
      ? localStorage.getItem('token_user')
      : null;
    },
    clearToken_User() {
      console.log("clearToken_User")
      this.tokenusers = null;
    },
    
    Setmenu () {
      console.log("Setmenu")
      this.menu = localStorage.getItem('menu')
      ? localStorage.getItem('menu')
      : null;
    },
    clearmenu () {
      console.log("clearmenu")
      this.menu = '-';
    },
    // จบ เรียก เซ็ต ค่า store

    // async DeCodeJWT() {
      // if (localStorage.getItem('token_second') != null && localStorage.getItem('token') != null) {
      //   
      //   this.deCode_second = typeof this.token_second == 'string'
      //     ? await jwt_decode(this.token_second)
      //     : null;
      //   this.deCode = typeof this.token == 'string'
      //     ? await jwt_decode(this.token)
      //     : null;
      //   // สลับ
      //   var Token = this.token;
      //   var Token_second = this.token_second;
      //   var TokenDeCode = this.deCode;
      //   var TokenDeCode_second = this.deCode_second;
      //   this.token = Token_second;
      //   this.token_second = Token;
      //   this.deCode = TokenDeCode_second;
      //   this.deCode_second = TokenDeCode;
      //   
      //   return this.deCode
      // } else {
      //   
      //   this.deCode = typeof this.token == 'string'
      //     ? await jwt_decode(this.token)
      //     : null;
      //   return this.deCode
      // }
    // },
    async SwitchToken(name, token){
      if(name == "admin"){
        
        this.tokensuper = this.token
        this.token = token
        localStorage.setItem('token', this.token)
        localStorage.setItem('token_superadmin', this.tokensuper)
        
      } else if(name == "user"){
        
        this.tokenadmin = this.token
        this.token = token
        localStorage.setItem('token', this.token)
        localStorage.setItem('token_admin', this.tokenadmin)
        
        // localStorage.setItem('token_superadmin', this.tokensuper)
      }
    },
    async TokenGetIDadmin(id) {
      const response = await AppConfig.CallAuth('token/admin/getid/' + id, 'GET', '', this.token)
      return response.data.status == 200 ? response.data.data : response.data.error
    },
    async TokenGetIDuser(id) {
      
      const response = await AppConfig.CallAuth('token/user/getid/' + id, 'GET', '', this.token)
      return response.data.status == 200 ? response.data.data : response.data.error
    },

    // เรียก api ของ user ไม่ได้ เลย จำรองไว้ทดสอบก่อน แก้ไขด้วย path api : token/user/getid/:id
    // async TokenGetIDuser(id) {
    //   const response = await AppConfig.CallAnouther('https://chiangraientersoft.com/demo/test.php?id='+ id, 'GET', '')
    //   return response.data.status == 200 ? response.data.data : response.data.error
    // }
  }
})
