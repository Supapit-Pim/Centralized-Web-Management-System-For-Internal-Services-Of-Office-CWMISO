import { defineStore } from 'pinia'
import AppConfig from '@/assets/js/appconfig'
import { useRouter } from 'vue-router'
import useHandleDatetime from '@/utils/handleDatetime'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    data: null,
    data_id: null
  }),
  getters: {},
  mutations: {},
  actions: {
    // Superadmin
    async Get_Admin_S(token) {
      try {
        const response = await AppConfig.CallAuth('superadmin/admin', 'GET', '', token)
        if (response?.data?.status != 200) {
          this.data = []
          if (response.data.error == 'Not have query data' || 'Not have query join data') return undefined
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
    async Get_Admin_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth('superadmin/admin/getid/' + id, 'GET', '', token)
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
    async Add_Admin_ID_S(token, data) {
      try {
        const response = await AppConfig.CallAuth('superadmin/admin/add', 'POST', data, token)
        if (response?.data?.status != 201) {
          return response.data.error
        }
        data.id = response.data.data.insertId
        this.data.push(data)
        return response.data.data
      } catch (e) {
        return String(e)
      }
    },
    async Update_Admin_ID_S(token, data, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/admin/update/' + id,
          'PUT',
          data,
          token
        )
        if (response?.data?.status != 201) {
          return response.data.error
        }
        return response.data.data
      } catch (e) {
        return String(e)
      }
    },
    async Delete_Admin_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/admin/delete/' + id,
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
    async UnDelete_Admin_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/admin/undelete/' + id,
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
    // Admin
    async Get_Admin_ID_A(token, id) {
      try {
        const response = await AppConfig.CallAuth('admin/admin/getid/' + id, 'GET', '', token)
        if (response?.data?.status != 200) {
          this.data_id = 0
          return response.data.error
        }
        this.data_id = response.data.data
        this.data_id.map((item) => {
          if (item.create_time || item.update_time !== null) {
            item.create_time = useHandleDatetime.isoStrToLocalStr(item.create_time)
            item.update_time = useHandleDatetime.isoStrToLocalStr(item.update_time)
          }
          item.password = null
          return item
        })
        
        return this.data_id
      } catch (e) {
        return String(e)
      }
    },
    async Update_Admin_ID_A(token, data, id) {
      try {
        const response = await AppConfig.CallAuth('admin/admin/update/' + id, 'PUT', data, token)
        if (response?.data?.status != 201) {
          return response.data.error
        }
        return response.data.data
      } catch (e) {
        return String(e)
      }
    },
    // อันเก่า
    async GetDataAdmin(token) {
      const response = await AppConfig.CallAuth('superadmin/admin', 'GET', '', token)
      this.data = response?.data?.status == 200 ? response?.data?.data : null
    },
    async Getdata(token) {
      const router = useRouter()
      const response = await AppConfig.CallAuth('superadmin/admin', 'GET', '', token)
      this.data = response.data.status == 200 ? response.data.data : response.data.error
      this.data.map((item) => {
        if (item.create_time || item.update_time !== null) {
          item.create_time = useHandleDatetime.isoStrToLocalStr(item.create_time)
          item.update_time = useHandleDatetime.isoStrToLocalStr(item.update_time)
        }
        return item
      })
    },
    async GetID(token, id) {
      const response = await AppConfig.CallAuth('superadmin/admin/getid/' + id, 'GET', '', token)
      this.data_id = response.data.status == 200 ? response.data.data : response.data.error
      return this.data_id
    },
    async GetID_Admin(token, id) {
      const response = await AppConfig.CallAuth('admin/admin/getid/' + id, 'GET', '', token)
      this.data_id = response.data.status == 200 ? response.data.data : response.data.error
      return this.data_id
    },
    async Update(token, data, id) {
      const response = await AppConfig.CallAuth('superadmin/admin/update/' + id, 'PUT', data, token)
      return response.data.status == 200 || response.data.status == 422 ? response.data : false
    },
    async Add(token, data) {
      this.data.push(data)
      const response = await AppConfig.CallAuth('superadmin/admin/add', 'POST', data, token)

      return response.data.status == 201 ? response.data.data : response.data.error
    },
    async Delete(token, id) {
      const response = await AppConfig.CallAuth(
        'superadmin/admin/delete/' + id,
        'DELETE',
        '',
        token
      )
      return response.data.status == 200 ? response.data.data : false
    }
  }
})
