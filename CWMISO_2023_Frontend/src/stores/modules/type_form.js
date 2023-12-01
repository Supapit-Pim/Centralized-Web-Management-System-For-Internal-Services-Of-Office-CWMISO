import { defineStore } from 'pinia'
import AppConfig from '@/assets/js/appconfig'
import { useRouter } from 'vue-router'
import useHandleDatetime from '@/utils/handleDatetime'

export const useTypeFormStore = defineStore('TypeFormStore', {
  state: () => ({
    data: null,
    data_id: null,
    delete_data: null
  }),
  getters: {
    // SetToken: (state) => {
    //   return (state.token = localStorage.getItem('token') ? localStorage.getItem('token') : null)
    // }
  },
  mutations: {},
  actions: {
    // Superadmin
    async Get_TypeForm_S(token) {
      try {
        const response = await AppConfig.CallAuth('superadmin/typeform', 'GET', '', token)
        if (response?.data?.status != 200) {
          this.data = []
          if (response.data.error == 'Not have query data') return undefined
          return response.data.error
        }
        this.data = response.data.data
        this.data.map((item) => {
          if (item.create_time || item.update_time !== null) {
            item.create_time = useHandleDatetime.isoStrToLocalStr(item.create_time)
            item.update_time = useHandleDatetime.isoStrToLocalStr(item.update_time)
          }
          return item
        })
      } catch (e) {
        String(e)
      }
    },
    async Get_TypeForm_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/typeform/getid/' + id,
          'GET',
          '',
          token
        )
        if (response?.data?.status != 200) {
          this.data_id = 0
          return response.data.error
        }
        this.data_id = response.data.data
        return this.data_id
      } catch (e) {
        return String(e)
      }
    },
    async Add_TypeForm_ID_S(token, data) {
      try {
        const response = await AppConfig.CallAuth('superadmin/typeform/add', 'POST', data, token)
        if (response?.data?.status != 201) {
          return response.data.error
        }
        data.id = response.data.data.insertId
        data.create_time = useHandleDatetime.isoStrToLocalStr(new Date())
        data.update_time = useHandleDatetime.isoStrToLocalStr(new Date())
        this.data.push(data)
        return response.data.data
      } catch (e) {
        return String(e)
      }
    },
    async Update_TypeForm_ID_S(token, data, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/typeform/update/' + id,
          'PUT',
          data,
          token
        )
        if (response?.data?.status != 200) {
          return response.data.error
        }
        return response.data.data
      } catch (e) {
        return String(e)
      }
    },
    async Delete_TypeForm_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/typeform/delete/' + id,
          'DELETE',
          '',
          token
        )
        if (response?.data?.status != 200) {
          return response.data.error
        }
        return response.data.data
      } catch (e) {
        return String(e)
      }
    },
    async Get_Delete_TypeForm_S(token) {
      try {
        const response = await AppConfig.CallAuth('superadmin/typeform/getdelete', 'GET', '', token)
        if (response?.data?.status != 200) {
          this.delete_data = []
          if (response.data.error == 'Not have query data') return undefined
          return response.data.error
        }
        this.delete_data = response.data.data
        this.delete_data.map((item) => {
          if (item.create_time || item.update_time !== null) {
            item.create_time = useHandleDatetime.isoStrToLocalStr(item.create_time)
            item.update_time = useHandleDatetime.isoStrToLocalStr(item.update_time)
          }
          return item
        })
      } catch (e) {
        String(e)
      }
    },
    async UnDelete_TypeForm_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/typeform/undelete/' + id,
          'PUT',
          '',
          token
        )
        if (response?.data?.status != 200) {
          return response.data.error
        }
        return response.data.data
      } catch (e) {
        return String(e)
      }
    },
    async DeleteBackup_TypeForm_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/typeform/deletebackup/' + id,
          'DELETE',
          '',
          token
        )
        if (response?.data?.status != 200) {
          return response.data.error
        }
        return response.data.data
      } catch (e) {
        return String(e)
      }
    },
    // อันเก่า
    async GetDataTypeForm(token) {
      const router = useRouter()
      const response = await AppConfig.CallAuth('superadmin/typeform', 'GET', '', token)
      this.data = response.data.status == 200 ? response.data.data : false

      //   if (response.data.data == false) {
      //     this.token = null
      //     localStorage.removeItem('token')
      //     router.push('/')
      //   } else {
      //     this.statusUser = true
      //   }
    },
    async Getdata(token) {
      const response = await AppConfig.CallAuth('superadmin/typeform', 'GET', '', token)
      this.data = response.data.status == 200 ? response.data.data : false
      const CreateTimeIn = this.data.map((ct) => ct.create_time)
      const UpdateTimeIn = this.data.map((ut) => ut.update_time)
      const CreateTimeOut = CreateTimeIn.map((isoStr) => useHandleDatetime.isoStrToLocalStr(isoStr))
      const UpdateTimeOut = UpdateTimeIn.map((isoStr) => useHandleDatetime.isoStrToLocalStr(isoStr))
      this.data.forEach((ct, index) => {
        ct.create_time = CreateTimeOut[index]
      })
      this.data.forEach((ut, index) => {
        ut.update_time = UpdateTimeOut[index]
      })
    },
    async GetIDTypeForm(id) {
      const data = this.data
    },
    async Delete(token, id) {
      const response = await AppConfig.CallAuth(
        'superadmin/typeform/delete/' + id,
        'DELETE',
        '',
        token
      )
      return response.data.status == 200 ? response.data.data : false
    }
  }
})
