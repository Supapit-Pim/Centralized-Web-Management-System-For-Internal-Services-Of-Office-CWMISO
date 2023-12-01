import { defineStore } from 'pinia'
import AppConfig from '@/assets/js/appconfig'
import { useRouter } from 'vue-router'
import useHandleDatetime from '@/utils/handleDatetime'
export const useCompanyStore = defineStore('CompanyStore', {
  state: () => ({
    data: null,
    data_id: null,
    delete_data: null,
    company: null
  }),
  getters: {
    company: (state) => {
      if (state.data) {
        return state.data.map(({ id, name }) => ({ id, name }))
      } else {
        return null
      }
    }
  },
  mutations: {},
  actions: {
    // Superadmin
    async Get_Company_S(token) {
      try {
        const response = await AppConfig.CallAuth('superadmin/company', 'GET', '', token)
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
    async Get_Company_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/company/getid/' + id,
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
    async Add_Company_ID_S(token, data) {
      try {
        const response = await AppConfig.CallAuth('superadmin/company/add', 'POST', data, token)
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
    async Update_Company_ID_S(token, data, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/company/update/' + id,
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
    async Delete_Company_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/company/delete/' + id,
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
    async Get_Delete_Company_S(token) {
      try {
        const response = await AppConfig.CallAuth('superadmin/company/getdelete', 'GET', '', token)
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
    async UnDelete_Company_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/company/undelete/' + id,
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
    async DeleteBackup_Company_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/company/deletebackup/' + id,
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
    // Admin
    async Get_Company_ID_A(token, id) {
      try {
        const response = await AppConfig.CallAuth('admin/company/getid/' + id, 'GET', '', token)
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
    async Update_Company_ID_A(token, data, id) {
      try {
        const response = await AppConfig.CallAuth('admin/company/update/' + id, 'PUT', data, token)
        if (response?.data?.status != 200) {
          return response.data.error
        }
        return response.data.data
      } catch (e) {
        return String(e)
      }
    },
    // User
    async Get_Company_ID_U(token, id) {
      try {
        const response = await AppConfig.CallAuth('user/company/getid/' + id, 'GET', '', token)
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
    // อันเก่า
    async Getdata_admin(token) {
      const response = await AppConfig.CallAuth('admin/company', 'GET', '', token)
      this.data = response.data.status == 200 ? response.data.data : response.data.error

      this.data.map((item) => {
        if (item.create_time || item.update_time !== null) {
          item.create_time = useHandleDatetime.isoStrToLocalStr(item.create_time)
          item.update_time = useHandleDatetime.isoStrToLocalStr(item.update_time)
        }
        return item
      })
    },

    // Router Admin
    async GetID_admin(token, id) {
      const response = await AppConfig.CallAuth('admin/company/getid/' + id, 'GET', '', token)
      return response.data.status == 200 ? response.data.data : response.data.error
    },
    async GetDataCompany(token) {
      const router = useRouter()
      const response = await AppConfig.CallAuth('superadmin/company', 'GET', '', token)
      this.data = response.data.status == 200 ? response.data.data : response.data.error
    },
    async Getdata(token) {
      const response = await AppConfig.CallAuth('superadmin/company', 'GET', '', token)
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
      const response = await AppConfig.CallAuth('superadmin/company/getid/' + id, 'GET', '', token)
      return response.data.status == 200 ? response.data.data : response.data.error
    },
    async Add(token, data) {
      this.data.push(data)
      const response = await AppConfig.CallAuth('superadmin/company/add', 'POST', data, token)
      return response.data.status == 201 ? response.data.data : response.data.error
    },
    async Delete(token, id) {
      const response = await AppConfig.CallAuth(
        'superadmin/company/delete/' + id,
        'DELETE',
        '',
        token
      )
      return response.data.status == 200 ? response.data.data : response.data.error
    },
    async GetDelete(token) {
      const response = await AppConfig.CallAuth('superadmin/company/getdelete', 'GET', '', token)
      this.delete_data = response.data.status == 200 ? response.data.data : response.data.error

      // return this.delete_data
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
    async Company_ID_Name(id) {
      const response = this.company.find((item) => item.id == id)
      return response
    }
  }
})
