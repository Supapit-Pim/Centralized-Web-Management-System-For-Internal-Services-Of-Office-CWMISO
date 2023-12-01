import { defineStore } from 'pinia'
import AppConfig from '@/assets/js/appconfig'
import { useRouter } from 'vue-router'
import useHandleDatetime from '@/utils/handleDatetime'

export const useTypeAllStore = defineStore('TypeAllStore', {
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
    async Get_TypeAll_S(token) {
      try {
        const response = await AppConfig.CallAuth('superadmin/typeall', 'GET', '', token)
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
    async Get_TypeAll_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/typeall/getid/' + id,
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
    async Add_TypeAll_ID_S(token, data) {
      try {
        const response = await AppConfig.CallAuth('superadmin/typeall/add', 'POST', data, token)
        if (response?.data?.status != 201) {
          return response.data.error
        }
        this.data.push(data)
        return response.data.data
      } catch (e) {
        return String(e)
      }
    },
    async Update_TypeAll_ID_S(token, data, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/typeall/update/' + id,
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
    async Delete_TypeAll_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/typeall/delete/' + id,
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
    async Get_Delete_TypeAll_S(token) {
      try {
        const response = await AppConfig.CallAuth('superadmin/typeall/getdelete', 'GET', '', token)
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
    async UnDelete_TypeAll_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/typeall/undelete/' + id,
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
    async DeleteBackup_TypeAll_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/typeall/deletebackup/' + id,
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
    // admin
    async Get_TypeAll_A(token) {
      
      try {
        const response = await AppConfig.CallAuth('admin/typeall', 'GET', '', token)

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
    async Get_TypeAll_ID_A(token, id) {
      try {
        const response = await AppConfig.CallAuth('admin/typeall/getid/' + id, 'GET', '', token)
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
    async Add_TypeAll_ID_A(token, data) {
      try {
        const response = await AppConfig.CallAuth('admin/typeall/add', 'POST', data, token)
        if (response?.data?.status != 201) {
          return response.data.error
        }
        this.data.push(data)
        return response.data.data
      } catch (e) {
        return String(e)
      }
    },
    async Update_TypeAll_ID_A(token, data, id) {
      try {
        const response = await AppConfig.CallAuth('admin/typeall/update/' + id, 'PUT', data, token)
        if (response?.data?.status != 200) {
          return response.data.error
        }
        return response.data.data
      } catch (e) {
        return String(e)
      }
    },
    async Delete_TypeAll_ID_A(token, id) {
      try {
        const response = await AppConfig.CallAuth('admin/typeall/delete/' + id, 'DELETE', '', token)
        if (response?.data?.status != 200) {
          return response.data.error
        }
        return response.data.data
      } catch (e) {
        return String(e)
      }
    },
    async Get_Delete_TypeAll_A(token) {
      try {
        const response = await AppConfig.CallAuth('admin/typeall/getdelete', 'GET', '', token)
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
    async UnDelete_TypeAll_ID_A(token, id) {
      try {
        const response = await AppConfig.CallAuth('admin/typeall/undelete/' + id, 'PUT', '', token)
        if (response?.data?.status != 200) {
          return response.data.error
        }
        return response.data.data
      } catch (e) {
        return String(e)
      }
    },
    async DeleteBackup_TypeAll_ID_A(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'admin/typeall/deletebackup/' + id,
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
    async GetDataTypeAll(token) {
      const router = useRouter()
      const response = await AppConfig.CallAuth('superadmin/typeall', 'GET', '', token)
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
      const response = await AppConfig.CallAuth('superadmin/typeall', 'GET', '', token)
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
    async GetIDTypeTypeAll(id) {
      const data = this.data
    },
    async Delete(token, id) {
      const response = await AppConfig.CallAuth(
        'superadmin/typeall/delete/' + id,
        'DELETE',
        '',
        token
      )
      return response.data.status == 200 ? response.data.data : false
    }
  }
})
