import { defineStore } from 'pinia'
import AppConfig from '@/assets/js/appconfig'
import { useRouter } from 'vue-router'
import useHandleDatetime from '@/utils/handleDatetime'
export const useListPersonnelStore = defineStore('ListPersonnelStore', {
  state: () => ({
    data: null,
    data_id: null,
    delete_data: null,
    listpersonnel: null,

    listpersonnelbycompanyall: null,
    LPBC: null
  }),
  getters: {
    listpersonnel: (state) => {
      if (state.data) {
        return state.data.map(({ id, topic }) => ({ id, topic }))
      } else {
        return null
      }
    },
    LPBC: (state) => {
      if (state.data) {
        return state.listpersonnelbycompanyall.map(({ id, topic }) => ({ id, topic }))
      } else {
        return null
      }
    }
  },
  mutations: {},
  actions: {
    // Superadmin
    async Get_ListPersonnel_S(token) {
      try {
        const response = await AppConfig.CallAuth('superadmin/listpersonnel', 'GET', '', token)
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
    async Get_ListPersonnel_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/listpersonnel/getid/' + id,
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
    async Add_ListPersonnel_ID_S(token, data) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/listpersonnel/add',
          'POST',
          data,
          token
        )
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
    async Update_ListPersonnel_ID_S(token, data, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/listpersonnel/update/' + id,
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
    async Delete_ListPersonnel_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/listpersonnel/delete/' + id,
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
    async UnDelete_ListPersonnel_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/listpersonnel/undelete/' + id,
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
    async Get_ListPersonnel_A(token) {
      try {
        const response = await AppConfig.CallAuth('admin/listpersonnel', 'GET', '', token)
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
    async Get_ListPersonnel_ID_A(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'admin/listpersonnel/getid/' + id,
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
    async Add_ListPersonnel_ID_A(token, data) {
      try {
        const response = await AppConfig.CallAuth('admin/listpersonnel/add', 'POST', data, token)
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
    async Update_ListPersonnel_ID_A(token, data, id) {
      try {
        const response = await AppConfig.CallAuth(
          'admin/listpersonnel/update/' + id,
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
    async Delete_ListPersonnel_ID_A(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'admin/listpersonnel/delete/' + id,
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
    async Get_Delete_ListPersonnel_A(token) {
      try {
        const response = await AppConfig.CallAuth('admin/listpersonnel/getdelete', 'GET', '', token)
        if (response?.data?.status != 200) {
          this.delete_data = []
          if (response.data.error == 'Not have query data' || 'Not have query join data') return undefined
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
    async UnDelete_ListPersonnel_ID_A(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'admin/listpersonnel/undelete/' + id,
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
    async DeleteBackup_ListPersonnel_ID_A(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'admin/listpersonnel/deletebackup/' + id,
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
    // User
    async Get_ListPersonnel_U(token) {
      try {
        const response = await AppConfig.CallAuth('user/listpersonnel', 'GET', '', token)
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
    // อันเก่า
    async Getdata_admin(token) {
      const response = await AppConfig.CallAuth('admin/listpersonnel', 'GET', '', token)
      this.data = response.data.status == 200 ? response.data.data : response.data.error

      this.data.map((item) => {
        if (item.create_time || item.update_time !== null) {
          item.create_time = useHandleDatetime.isoStrToLocalStr(item.create_time)
          item.update_time = useHandleDatetime.isoStrToLocalStr(item.update_time)
        }
        return item
      })
    },
    async GetID_admin(token, id) {
      const response = await AppConfig.CallAuth('admin/listpersonnel/getid/' + id, 'GET', '', token)
      return response.data.status == 200 ? response.data.data : response.data.error
    },
    async GetDataListPersonnel(token) {
      const router = useRouter()
      const response = await AppConfig.CallAuth('superadmin/listpersonnel', 'GET', '', token)
      this.data = response.data.status == 200 ? response.data.data : response.data.error
    },
    async Getdata(token) {
      const router = useRouter()
      const response = await AppConfig.CallAuth('superadmin/listpersonnel', 'GET', '', token)
      this.data = response.data.status == 200 ? response.data.data : response.data.error

      this.data.map((item) => {
        if (item.create_time || item.update_time !== null) {
          item.create_time = useHandleDatetime.isoStrToLocalStr(item.create_time)
          item.update_time = useHandleDatetime.isoStrToLocalStr(item.update_time)
        }
        return item
      })
    },
    async ListPersonnel_ID_Name(id) {
      const response = this.listpersonnel.find((item) => item.id == id)
      return response
    },
    async ListPersonnel_By_Company(companyid) {
      const response = this.data.filter((item) => item.company_id == companyid)
      this.listpersonnelbycompanyall = response
      return this.LPBC != null ? this.LPBC : this.LPBC
      // return response
    }
  }
})
