import { defineStore } from 'pinia'
import AppConfig from '@/assets/js/appconfig'
import { useRouter } from 'vue-router'
export const useListServiceStore = defineStore('ListServiceStore', {
  state: () => ({
    data: null,
    data_id: null
  }),
  getters: {
    // SetToken: (state) => {
    //   return (state.token = localStorage.getItem('token') ? localStorage.getItem('token') : null)
    // }
  },
  mutations: {},
  actions: {
    // Superadmin
    async Get_ListService_S(token) {
      try {
        const response = await AppConfig.CallAuth('superadmin/listservice', 'GET', '', token)
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
    async Get_ListService_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/listservice/getid/' + id,
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
    async Add_ListService_ID_S(token, data) {
      try {
        const response = await AppConfig.CallAuth('superadmin/listservice/add', 'POST', data, token)
        if (response?.data?.status != 201) {
          return response.data.error
        }
        this.data.push(data)
        return response.data.data
      } catch (e) {
        return String(e)
      }
    },
    async Update_ListService_ID_S(token, data, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/listservice/update/' + id,
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
    async Delete_ListService_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/listservice/delete/' + id,
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
    async UnDelete_ListService_ID_S(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'superadmin/listservice/undelete/' + id,
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
    async Get_ListService_A(token) {
      try {
        const response = await AppConfig.CallAuth('admin/listservice', 'GET', '', token)
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
    async Get_ListService_ID_A(token, id) {
      try {
        const response = await AppConfig.CallAuth('admin/listservice/getid/' + id, 'GET', '', token)
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
    async Add_ListService_ID_A(token, data) {
      try {
        const response = await AppConfig.CallAuth('admin/listservice/add', 'POST', data, token)
        if (response?.data?.status != 201) {
          return response.data.error
        }
        this.data.push(data)
        return response.data.data
      } catch (e) {
        return String(e)
      }
    },
    async Update_ListService_ID_A(token, data, id) {
      try {
        const response = await AppConfig.CallAuth(
          'admin/listservice/update/' + id,
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
    async Delete_ListService_ID_A(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'admin/listservice/delete/' + id,
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
    async UnDelete_ListService_ID_A(token, id) {
      try {
        const response = await AppConfig.CallAuth(
          'admin/listservice/undelete/' + id,
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
    }
  }
})
