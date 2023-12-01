import { defineStore } from 'pinia'
import AppConfig from '@/assets/js/appconfig'
import { useRouter } from 'vue-router';
import useHandleDatetime from '@/utils/handleDatetime'
export const useDataFormStore = defineStore('DataFormStore', {
  state: () => ({
    data: null
  }),
  getters: {
  },
  mutations: {},
  actions: {
    async GetDataForm(token) {
      const router = useRouter();
      const response = await AppConfig.CallAuth('superadmin/dataform', 'GET', '', token)
      this.data = response.data.status == 200  ? response.data.data : false
    },
    async Getdata(token) {
      
      const response = await AppConfig.CallAuth('superadmin/dataform', 'GET', '', token)
      this.data = response.data.status == 200 ? response.data.data : false
      const CreateTimeIn = this.data.map(ct => ct.create_time)
      const UpdateTimeIn = this.data.map(ut => ut.update_time)
      const CreateTimeOut = CreateTimeIn.map(isoStr => useHandleDatetime.isoStrToLocalStr(isoStr))
      const UpdateTimeOut = UpdateTimeIn.map(isoStr => useHandleDatetime.isoStrToLocalStr(isoStr))
      this.data.forEach((ct, index) => {
        ct.create_time = CreateTimeOut[index];
      });
      this.data.forEach((ut, index) => {
        ut.update_time = UpdateTimeOut[index];
      });
      
    },
    async GetIDDataForm(id) {
      const data = this.data
    },
    async Delete(token, id) {
      const response = await AppConfig.CallAuth('superadmin/dataform/delete/'+ id, 'DELETE', '', token)
      return response.data.status == 200 ? response.data.data : false
    }
  }
})
