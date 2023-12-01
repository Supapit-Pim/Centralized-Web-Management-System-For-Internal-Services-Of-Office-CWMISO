import { defineStore } from 'pinia'
import AppConfig from '@/assets/js/appconfig'
import { useRouter } from 'vue-router'
import useHandleDatetime from '@/utils/handleDatetime'
export const useUserStore = defineStore('user', {
  state: () => ({
    data: null,
    data_id: null,
    delete_data: null
  }),
  getters: {},
  mutations: {},
  actions: {
    // Superadmin
    async Get_User_S(token) {
      try {
        const response = await AppConfig.CallAuth('superadmin/user', 'GET', '', token)
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
          item.password = null
          return item
        })
      } catch (e) {
        String(e)
      }
    },
    async Get_User_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth('superadmin/user/getid/' + id, 'GET', '', token)
        if (response?.data?.status != 200) {
          this.data_id = 0
          return response.data.error
        }
        this.data_id = response.data.data
        this.data_id.password = null
        return this.data_id
      } catch (e) {
        return String(e)
      }
    },
    async Add_User_ID_S(token, data) {
      try {
        const response = await AppConfig.CallAuth('superadmin/user/add', 'POST', data, token)
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
    async Update_User_ID_S(token, data, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/user/update/' + id,
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
    async Delete_User_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/user/delete/' + id,
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
    async Get_Delete_User_S(token) {
      try {
        const response = await AppConfig.CallAuth('superadmin/user/getdelete', 'GET', '', token)
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
          item.password = null
          return item
        })
      } catch (e) {
        String(e)
      }
    },
    async UnDelete_User_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/user/undelete/' + id,
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
    async DeleteBackup_User_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/user/deletebackup/' + id,
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
    async Get_User_A(token) {
      try {
        const response = await AppConfig.CallAuth('admin/user', 'GET', '', token)
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
          item.password = null
          return item
        })
      } catch (e) {
        String(e)
      }
    },
    async Get_User_ID_A(token, id) {
      try {
        const response = await AppConfig.CallAuth('admin/user/getid/' + id, 'GET', '', token)
        if (response?.data?.status != 200) {
          this.data_id = 0
          return response.data.error
        }
        this.data_id = response.data.data
        this.data_id.password = null
        return this.data_id
      } catch (e) {
        return String(e)
      }
    },
    async Add_User_ID_A(token, data) {
      try {
        const response = await AppConfig.CallAuth('admin/user/add', 'POST', data, token)
        if (response?.data?.status != 200) {
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
    async Update_User_ID_A(token, data, id) {
      try {
        const response = await AppConfig.CallAuth('admin/user/update/' + id, 'PUT', data, token)
        if (response?.data?.status != 200) {
          return response.data.error
        }
        return response.data.data
      } catch (e) {
        return String(e)
      }
    },
    async Delete_User_ID_A(token, id) {
      try {
        const response = await AppConfig.CallAuth('admin/user/delete/' + id, 'DELETE', '', token)
        if (response?.data?.status != 200) {
          return response.data.error
        }
        return response.data.data
      } catch (e) {
        return String(e)
      }
    },
    async Get_Delete_User_A(token) {
      try {
        const response = await AppConfig.CallAuth('admin/user/getdelete', 'GET', '', token)
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
          item.password = null
          return item
        })
      } catch (e) {
        String(e)
      }
    },
    async UnDelete_User_ID_A(token, id) {
      try {
        const response = await AppConfig.CallAuth('admin/user/undelete/' + id, 'PUT', '', token)
        if (response?.data?.status != 200) {
          return response.data.error
        }
        return response.data.data
      } catch (e) {
        return String(e)
      }
    },
    async DeleteBackup_User_ID_A(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'admin/user/deletebackup/' + id,
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
    async Get_User_ID_U(token, id) {
      try {
        const response = await AppConfig.CallAuth('user/user/getid/' + id, 'GET', '', token)
        if (response?.data?.status != 200) {
          this.data_id = 0
          return response.data.error
        }
        this.data_id = response.data.data
        this.data_id.password = null
        return this.data_id
      } catch (e) {
        return String(e)
      }
    },
    async Update_User_ID_U(token, data, id) {
      try {
        const response = await AppConfig.CallAuth('user/user/update/' + id, 'PUT', data, token)
        if (response?.data?.status != 200) {
          return response.data.error
        }
        return response.data.data
      } catch (e) {
        return String(e)
      }
    },
    // อันเก่า
    //แก้ไข superadmin หน้า Dashboard และ admin หน้า User ใช้แยกกัน จำเป็นต้องเรียกแยกกัน
    async GetDataUsersuperadmin(token) {
      const response = await AppConfig.CallAuth('superadmin/user', 'GET', '', token)
      this.data = response?.data?.status == 200 ? response?.data?.data : null
    },
    async GetDataUser(token) {
      const response = await AppConfig.CallAuth('admin/user', 'GET', '', token)
      this.data = response?.data?.status == 200 ? response?.data?.data : null
    },
    ////

    async Getdata_admin(token) {
      const response = await AppConfig.CallAuth('admin/user', 'GET', '', token)
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
      const response = await AppConfig.CallAuth('admin/user/getid/' + id, 'GET', '', token)
      return response.data.status == 200 ? response.data.data : response.data.error
    },
    async Getdata(token) {
      const router = useRouter()
      const response = await AppConfig.CallAuth('superadmin/user', 'GET', '', token)
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
      const response = await AppConfig.CallAuth('superadmin/user/update/' + id, 'PUT', data, token)
      return response.data.status == 200 || response.data.status == 422 ? response.data : false
    },
    async Add(token, data) {
      this.data.push(data)
      const response = await AppConfig.CallAuth('superadmin/user/add', 'POST', data, token)
      return response.data.status == 201 ? response.data.data : response.data.error
    },
    async Delete(token, id) {
      const response = await AppConfig.CallAuth('superadmin/user/delete/' + id, 'DELETE', '', token)
      return response.data.status == 200 ? response.data.data : false
    }
  }
})
