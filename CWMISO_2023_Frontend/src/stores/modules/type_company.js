import { defineStore } from 'pinia'
import AppConfig from '@/assets/js/appconfig'
import { useRouter } from 'vue-router'
import useHandleDatetime from '@/utils/handleDatetime'

export const useTypeCompanyStore = defineStore('TypeCompanyStore', {
  state: () => ({
    data: null,
    data_id: null,
    delete_data: null,
    typecompany: null
  }),
  getters: {
    Typecompany: (state) => {
      state.typecompany = state.data ? state.data.map(({ id, name }) => ({ id, name })) : null
      return state.typecompany
    }
  },
  mutations: {},
  actions: {
    // Superadmin
    async Get_TypeCompany_S(token) {
      try {
        const response = await AppConfig.CallAuth('superadmin/typecompany', 'GET', '', token)
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
    async Get_TypeCompany_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/typecompany/getid/' + id,
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
    async Add_TypeCompany_ID_S(token, data) {
      try {
        const response = await AppConfig.CallAuth('superadmin/typecompany/add', 'POST', data, token)
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
    async Update_TypeCompany_ID_S(token, data, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/typecompany/update/' + id,
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
    async Delete_TypeCompany_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/typecompany/delete/' + id,
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
    async Get_Delete_TypeCompany_S(token) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/typecompany/getdelete',
          'GET',
          '',
          token
        )
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
    async UnDelete_TypeCompany_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/typecompany/undelete/' + id,
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
    async DeleteBackup_TypeCompany_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/typecompany/deletebackup/' + id,
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
    async GetDataTypeCompany(token) {
      const response = await AppConfig.CallAuth('superadmin/typecompany', 'GET', '', token)
      this.data = response?.data?.status == 200 ? response?.data?.data : null
    },
    async Getdata(token) {
      const router = useRouter()
      const response = await AppConfig.CallAuth('superadmin/typecompany', 'GET', '', token)
      this.data = response.data.status == 200 ? response.data.data : false
      this.data.map((item) => {
        if (item.create_time || item.update_time !== null) {
          item.create_time = useHandleDatetime.isoStrToLocalStr(item.create_time)
          item.update_time = useHandleDatetime.isoStrToLocalStr(item.update_time)
        }
        return item
      })
    },
    async Update(token, data, id) {
      const response = await AppConfig.CallAuth(
        'superadmin/typecompany/update/' + id,
        'PUT',
        data,
        token
      )
      return response.data.status == 200 ? response.data.data : false
    },
    async Add(token, data) {
      this.data.push(data)
      const response = await AppConfig.CallAuth('superadmin/typecompany/add', 'POST', data, token)
      return response.data.status == 201 ? response.data.data : false
    },
    async Delete(token, id) {
      const response = await AppConfig.CallAuth(
        'superadmin/typecompany/delete/' + id,
        'DELETE',
        '',
        token
      )
      return response.data.status == 200 ? response.data.data : false
    },
    async TypeCompany_ID_Name(id) {
      const response = this.typecompany.find((item) => item.id == id)
      return response
    }
  }
})
