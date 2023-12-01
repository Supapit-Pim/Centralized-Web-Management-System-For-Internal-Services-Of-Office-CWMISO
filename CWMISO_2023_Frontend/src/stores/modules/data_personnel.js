import { defineStore } from 'pinia'
import AppConfig from '@/assets/js/appconfig'
import { useRouter } from 'vue-router'
import useHandleDatetime from '@/utils/handleDatetime'

export const useDataPersonnelStore = defineStore('DataPersonnelStore', {
  state: () => ({
    data: null,
    data_id: null,
    delete_data: null,
  }),
  getters: {},
  mutations: {},
  actions: {
  // Superadmin
    async Get_DataPersonnel_S(token) {
      try {
        const response = await AppConfig.CallAuth('superadmin/datapersonnel', 'GET', '', token)
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
    async Get_DataPersonnel_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth('superadmin/datapersonnel/getid/' + id, 'GET', '', token)
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
    async Update_DataPersonnel_ID_S(token, data, id) {
      try {
        const response = await AppConfig.CallAuth('superadmin/datapersonnel/update/' + id, 'PUT', data, token)
        if (response?.data?.status != 200) {
          return response.data.error
        }
        return response.data.data
      } catch (e) {
        return String(e)
      }
    },
    async Delete_DataPersonnel_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth('superadmin/datapersonnel/delete/' + id,'DELETE','',token)
        if (response?.data?.status != 200) {
          return response.data.error
        }
        return response.data.data
      } catch (e) {
        return String(e)
      }
    },
    async UnDelete_DataPersonnel_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth('superadmin/datapersonnel/undelete/' + id,'PUT','',token)
        if (response?.data?.status != 200) {
          return response.data.error
        }
        return response.data.data
      } catch (e) {
        return String(e)
      }
    },
    // Admin
    async Get_DataPersonnel_A(token) {
      try {
        const response = await AppConfig.CallAuth('admin/datapersonnel', 'GET', '', token)
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
    async Get_DataPersonnel_ID_A(token, id) {
      try {
        const response = await AppConfig.CallAuth('admin/datapersonnel/getid/' + id, 'GET', '', token)
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
    async Add_DataPersonnel_ID_A(token, data) {
      try {
        const response = await AppConfig.CallAuth('admin/datapersonnel/add', 'POST', data, token)
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
    async Update_DataPersonnel_ID_A(token, data, id) {
      try {
        const response = await AppConfig.CallAuth('admin/datapersonnel/update/' + id, 'PUT', data, token)
        if (response?.data?.status != 200) {
          return response.data.error
        }
        return response.data.data
      } catch (e) {
         return String(e)
      }
    },
    async Delete_DataPersonnel_ID_A(token, id) {
      try {
        const response = await AppConfig.CallAuth('admin/datapersonnel/delete/' + id,'DELETE','',token)
        if (response?.data?.status != 200) {
          return response.data.error
        }
        return response.data.data
      } catch (e) {
         return String(e)
      }
    },
    async Get_Delete_DataPersonnel_A(token) {
      try {
        const response = await AppConfig.CallAuth('admin/datapersonnel/getdelete', 'GET', '', token)
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
    async UnDelete_DataPersonnel_ID_A(token, id) {
      try {
        const response = await AppConfig.CallAuth('admin/datapersonnel/undelete/' + id,'PUT','',token)
        if (response?.data?.status != 200) {
          return response.data.error
        }
        return response.data.data
      } catch (e) {
         return String(e)
      }
    },
    async DeleteBackup_DataPersonnel_ID_A(token, id) {
      try {
        const response = await AppConfig.CallAuth('admin/datapersonnel/deletebackup/' + id,'DELETE','',token)
        if (response?.data?.status != 200) {
          return response.data.error
        }
        return response.data.data
      } catch (e) {
        return String(e)
      }
    },
    // อันเก่า
    async Getdata_admin(token) {
      const response = await AppConfig.CallAuth('admin/datapersonnel', 'GET', '', token)
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
      const response = await AppConfig.CallAuth('admin/datapersonnel/getid/' + id, 'GET', '', token)
      return response.data.status == 200 ? response.data.data : response.data.error
    },
    async Getdata(token) {
      const router = useRouter()
      const response = await AppConfig.CallAuth('admin/datapersonnel', 'GET', '', token)
      this.data = response.data.status == 200 ? response.data.data : response.data.error
    }
  }
})
