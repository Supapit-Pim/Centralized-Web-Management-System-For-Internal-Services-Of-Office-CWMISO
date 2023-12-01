import { defineStore } from 'pinia'
import AppConfig from '@/assets/js/appconfig'
import { useRouter } from 'vue-router'
import useHandleDatetime from '@/utils/handleDatetime'
export const useStatusCompanyStore = defineStore('StatusCompanyStore', {
  state: () => ({
    data: null,
    data_id: null
  }),
  getters: {},
  mutations: {},
  actions: {
    // Superadmin
    async Get_StatusCompany_S(token) {
      try {
        const response = await AppConfig.CallAuth('superadmin/statuscompany', 'GET', '', token)
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
    async Get_StatusCompany_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/statuscompany/getid/' + id,
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
    async Add_StatusCompany_ID_S(token, data) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/statuscompany/add',
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
    async Update_StatusCompany_ID_S(token, data, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/statuscompany/update/' + id,
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
    async Delete_StatusCompany_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/statuscompany/delete/' + id,
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
    async UnDelete_StatusCompany_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/statuscompany/undelete/' + id,
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
    async Get_StatusCompany_A(token) {
      try {
        const response = await AppConfig.CallAuth('admin/statuscompany', 'GET', '', token)
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
    async Get_StatusCompany_ID_A(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'admin/statuscompany/getid/' + id,
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
    async Add_StatusCompany_ID_A(token, data) {
      
      try {
        const response = await AppConfig.CallAuth('admin/statuscompany/add', 'POST', data, token)
        if (response?.data?.status != 201) {
          return response.data.error
        }
        if (this.data != null) {
          this.data.push(data)
        }
        return response.data.data
      } catch (e) {
        return String(e)
      }
    },
    async Update_StatusCompany_ID_A(token, data, id) {
      try {
        
        const response = await AppConfig.CallAuth(
          'admin/statuscompany/update/' + id,
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
    async Delete_StatusCompany_ID_A(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'admin/statuscompany/delete/' + id,
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
    async UnDelete_StatusCompany_ID_A(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'admin/statuscompany/undelete/' + id,
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
    async Get_StatusCompany_U(token) {
      try {
        const response = await AppConfig.CallAuth('user/statuscompany', 'GET', '', token)
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
    async GetDataStatusCompany(token) {
      const router = useRouter()
      const response = await AppConfig.CallAuth('superadmin/statuscompany', 'GET', '', token)
      this.data = response.data.status == 200 ? response.data.data : false
    },
    async Getdata(token) {
      const response = await AppConfig.CallAuth('superadmin/statuscompany', 'GET', '', token)
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
    async GetIDStatusCompany(id) {
      const data = this.data
    },
    async Delete(token, id) {
      const response = await AppConfig.CallAuth(
        'superadmin/statuscompany/delete/' + id,
        'DELETE',
        '',
        token
      )
      return response.data.status == 200 ? response.data.data : false
    }
  }
})
