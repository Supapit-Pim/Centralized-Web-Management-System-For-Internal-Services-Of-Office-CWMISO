import { defineStore } from 'pinia'
import AppConfig from '@/assets/js/appconfig'
import { useRouter } from 'vue-router';
export const useCreateFormStore = defineStore('CreateFormStore', {
  state: () => ({
    data: null
  }),
  getters: {
    // SetToken: (state) => {
    //   return (state.token = localStorage.getItem('token') ? localStorage.getItem('token') : null)
    // }
  },
  mutations: {},
  actions: {
    async GetDataCreateForm(token) {
      const router = useRouter();
      const response = await AppConfig.CallAuth('admin/createform', 'GET', '', token)
      this.data = response.data.status == 200  ? response.data.data : false
     
    //   if (response.data.data == false) {
    //     this.token = null
    //     localStorage.removeItem('token')
    //     router.push('/')
    //   } else {
    //     this.statusUser = true
    //   }
    }
  }
})