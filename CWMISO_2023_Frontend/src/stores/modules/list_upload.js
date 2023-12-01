import { defineStore } from 'pinia'
import AppConfig from '@/assets/js/appconfig'
import { useRouter } from 'vue-router'
import useHandleDatetime from '@/utils/handleDatetime'

export const useListUploadStore = defineStore('ListUploadStore', {
  state: () => ({
    data: null,
    data_id: null,
    delete_data: null,
  }),
  getters: {
    // SetToken: (state) => {
    //   return (state.token = localStorage.getItem('token') ? localStorage.getItem('token') : null)
    // }
  },
  mutations: {},
  actions: {
    // Superadmin
    async Get_ListUpload_S(token) {
      try {
        const response = await AppConfig.CallAuth('superadmin/listupload', 'GET', '', token)
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
    async Get_ListUpload_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/listupload/getid/' + id,
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
    async Add_ListUpload_ID_S(token, data) {
      try {
        const response = await AppConfig.CallAuth('superadmin/listupload/add', 'POST', data, token)
        if (response?.data?.status != 201) {
          return response.data.error
        }
        this.data.push(data)
        return response.data.data
      } catch (e) {
        return String(e)
      }
    },
    async Update_ListUpload_ID_S(token, data, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/listupload/update/' + id,
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
    async Delete_ListUpload_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/listupload/delete/' + id,
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
    async UnDelete_ListUpload_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/listupload/undelete/' + id,
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
    async Get_ListUpload_A(token) {
      try {
        const response = await AppConfig.CallAuth('admin/listupload', 'GET', '', token)
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
    async Get_ListUpload_ID_A(token, id) {
      try {
        const response = await AppConfig.CallAuth('admin/listupload/getid/' + id, 'GET', '', token)
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
    async Add_ListUpload_ID_A(token, data) {
      try {
        const response = await AppConfig.CallAuth('admin/listupload/add', 'POST', data, token)
        if (response?.data?.status != 201) {
          return response.data.error
        }
        this.data.push(data)
        return response.data.data
      } catch (e) {
        return String(e)
      }
    },
    async Update_ListUpload_ID_A(token, data, id) {
      try {
        const response = await AppConfig.CallAuth(
          'admin/listupload/update/' + id,
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
    async Delete_ListUpload_ID_A(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'admin/listupload/delete/' + id,
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
    async UnDelete_ListUpload_ID_A(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'admin/listupload/undelete/' + id,
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
    // User
    async Get_ListUpload_U(token) {
      try {
        const response = await AppConfig.CallAuth('user/listupload', 'GET', '', token)
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
    async Get_ListUpload_ID_U(token, id) {
      try {
        const response = await AppConfig.CallAuth('user/listupload/getid/' + id, 'GET', '', token)
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
    async Add_ListUpload_ID_U(token, data) {
      try {
        const response = await AppConfig.CallAuth('user/listupload/add', 'POST', data, token)
        if (response?.data?.status != 201) {
          return response.data.error
        }
        data.id = response.data.data.insertId
        data.create_time = useHandleDatetime.isoStrToLocalStr(new Date())
        data.update_time = useHandleDatetime.isoStrToLocalStr(new Date())
        this.data != null
         ? this.data.push(data)
         : this.data = data
        return response.data.data
      } catch (e) {
        return String(e)
      }
    },
    async Update_ListUpload_ID_U(token, data, id) {
      try {
        const response = await AppConfig.CallAuth(
          'user/listupload/update/' + id,
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
    async Delete_ListUpload_ID_U(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'user/listupload/delete/' + id,
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
    async Get_Delete_ListUpload_U(token) {
      try {
        const response = await AppConfig.CallAuth('user/listupload/getdelete', 'GET', '', token)
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
    async UnDelete_ListUpload_ID_U(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'user/listupload/undelete/' + id,
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
    async DeleteBackup_ListUpload_ID_U(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'user/listupload/deletebackup/' + id,
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
    async GetDataListUpload(token) {
      const router = useRouter()
      const response = await AppConfig.CallAuth('superadmin/listupload', 'GET', '', token)
      this.data = response.data.status == 200 ? response.data.data : false

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
