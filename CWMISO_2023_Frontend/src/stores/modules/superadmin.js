import { defineStore } from 'pinia'
import AppConfig from '@/assets/js/appconfig'
import { useRouter } from 'vue-router'
import useHandleDatetime from '@/utils/handleDatetime'

export const useSuperAdminStore = defineStore('SuperAdminStore', {
  state: () => ({
    data: null,
    data_id: null,
    delete_data: null,
    delete: null
  }),
  getters: {},
  mutations: {},
  actions: {
    // Superadmin
    async Get_SuperAdmin_S(token) {
      try {
        const response = await AppConfig.CallAuth('superadmin/superadmin', 'GET', '', token)
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
          item.password = null
          return item
        })
      } catch (e) {
        String(e)
      }
    },
    async Get_SuperAdmin_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/superadmin/getid/' + id,
          'GET',
          '',
          token
        )
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

        // this.data_id.password = null
        return this.data_id
      } catch (e) {
        return String(e)
      }
    },
    async Add_SuperAdmin_ID_S(token, data) {
      try {
        const response = await AppConfig.CallAuth('superadmin/superadmin/add', 'POST', data, token)
        if (response?.data?.status != 201) {
          return response.data.error
        }
        data.id = response.data.data.insertId
        data.create_time = useHandleDatetime.isoStrToLocalStr(new Date())
        data.update_time = useHandleDatetime.isoStrToLocalStr(new Date())
        data.password = null
        this.data.push(data)
        return response.data.data
      } catch (e) {
        return String(e)
      }
    },
    async Update_SuperAdmin_ID_S(token, data, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/superadmin/update/' + id,
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
    async Delete_SuperAdmin_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/superadmin/delete/' + id,
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
    async Get_Delete_SuperAdmin_S(token) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/superadmin/getdelete',
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
          item.password = null
          return item
        })
      } catch (e) {
        String(e)
      }
    },
    async UnDelete_SuperAdmin_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/superadmin/undelete/' + id,
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
    async DeleteBackup_SuperAdmin_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/superadmin/deletebackup/' + id,
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
    async GetDataSuperAdmin(token) {
      const response = await AppConfig.CallAuth('superadmin/superadmin', 'GET', '', token)
      this.data = response?.data?.status == 200 ? response?.data?.data : null
    },
    async Getdata(token) {
      const router = useRouter()
      const response = await AppConfig.CallAuth('superadmin/superadmin', 'GET', '', token)
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
      const response = await AppConfig.CallAuth(
        'superadmin/superadmin/getid/' + id,
        'GET',
        '',
        token
      )
      this.data_id = response.data.status == 200 ? response.data.data : response.data.error
      return this.data_id
    },
    async Update(token, data, id) {
      const response = await AppConfig.CallAuth(
        'superadmin/superadmin/update/' + id,
        'PUT',
        data,
        token
      )
      return response.data.status == 200 ? response.data.data : response.data.error
    },
    async Add(token, data) {
      this.data.push(data)
      const response = await AppConfig.CallAuth('superadmin/superadmin/add', 'POST', data, token)

      return response.data.status == 201 ? response.data.data : response.data.error
    },
    async Delete(token, id) {
      const response = await AppConfig.CallAuth(
        'superadmin/superadmin/delete/' + id,
        'DELETE',
        '',
        token
      )

      return response.data.status == 200 ? response.data.data : response.data.error
    },
    async GetDelete(token) {
      const response = await AppConfig.CallAuth('superadmin/superadmin/getdelete', 'GET', '', token)
      this.delete = response.data.status == 200 ? response.data.data : response.data.error
      return this.delete
      // return response.data.status == 200 ? response.data.data : response.data.error
    },
    async UnDelete(token, id) {
      const response = await AppConfig.CallAuth(
        'superadmin/superadmin/undelete/' + id,
        'PUT',
        '',
        token
      )

      return response.data.status == 200 ? response.data.data : response.data.error
    },
    async DeleteBackup(token, id) {
      const response = await AppConfig.CallAuth(
        'superadmin/superadmin/deletebackup/' + id,
        'DELETE',
        '',
        token
      )

      return response.data.status == 200 ? response.data.data : response.data.error
    }
  }
})
