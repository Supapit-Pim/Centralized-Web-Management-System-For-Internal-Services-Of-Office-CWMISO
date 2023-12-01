import { defineStore } from 'pinia'
import AppConfig from '@/assets/js/appconfig'
import { useRouter } from 'vue-router'
import useHandleDatetime from '@/utils/handleDatetime'
export const useStatusUploadStore = defineStore('StatusUploadStore', {
  state: () => ({
    data: null,
    data_id: null
  }),
  getters: {},
  mutations: {},
  actions: {
    // Superadmin
    async Get_StatusUpload_S(token) {
      try {
        const response = await AppConfig.CallAuth('superadmin/statusupload', 'GET', '', token)
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
    async Get_StatusUpload_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/statusupload/getid/' + id,
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
    async Add_StatusUpload_ID_S(token, data) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/statusupload/add',
          'POST',
          data,
          token
        )
        if (response?.data?.status != 201) {
          return response.data.error
        }
        this.data.push(data)
        return response.data.data
      } catch (e) {
        return String(e)
      }
    },
    async Update_StatusUpload_ID_S(token, data, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/statusupload/update/' + id,
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
    async Delete_StatusUpload_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/statusupload/delete/' + id,
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
    async UnDelete_StatusUpload_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/statusupload/undelete/' + id,
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
    async Get_StatusUpload_A(token) {
      try {
        const response = await AppConfig.CallAuth('admin/statusupload', 'GET', '', token)
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
    async Get_StatusUpload_ID_A(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'admin/statusupload/getid/' + id,
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
    async Add_StatusUpload_ID_A(token, data) {
      try {
        const response = await AppConfig.CallAuth('admin/statusupload/add', 'POST', data, token)
        if (response?.data?.status != 201) {
          return response.data.error
        }
        this.data.push(data)
        return response.data.data
      } catch (e) {
        return String(e)
      }
    },
    async Update_StatusUpload_ID_A(token, data, id) {
      try {
        const response = await AppConfig.CallAuth(
          'admin/statusupload/update/' + id,
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
    async Delete_StatusUpload_ID_A(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'admin/statusupload/delete/' + id,
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
    async UnDelete_StatusUpload_ID_A(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'admin/statusupload/undelete/' + id,
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
    async Get_StatusUpload_U(token) {
      try {
        const response = await AppConfig.CallAuth('user/statusupload', 'GET', '', token)
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
    async Get_StatusUpload_ID_U(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'user/statusupload/getid/' + id,
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
    async Add_StatusUpload_ID_U(token, data) {
      try {
        const response = await AppConfig.CallAuth('user/statusupload/add', 'POST', data, token)
        if (response?.data?.status != 201) {
          return response.data.error
        }
        this.data != null
         ? this.data.push(data)
         : this.data = data
        return response.data.data
      } catch (e) {
        return String(e)
      }
    },
    async Update_StatusUpload_ID_U(token, data, id) {
      try {
        const response = await AppConfig.CallAuth(
          'user/statusupload/update/' + id,
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
    // อันเก่า
    async GetDataStatusUpload(token) {
      const router = useRouter()
      const response = await AppConfig.CallAuth('superadmin/statusupload', 'GET', '', token)
      this.data = response.data.status == 200 ? response.data.data : false
    },
    async Getdata(token) {
      const response = await AppConfig.CallAuth('superadmin/statusupload', 'GET', '', token)
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
    async GetIDStatusUpload(id) {
      const data = this.data
    },
    async Delete(token, id) {
      const response = await AppConfig.CallAuth(
        'superadmin/statusupload/delete/' + id,
        'DELETE',
        '',
        token
      )
      return response.data.status == 200 ? response.data.data : false
    }
  }
})
