<script setup>
import sweetalert2 from '@/assets/js/controller/switchalert'
import { mapActions } from 'pinia'
import { computed } from 'vue'
import { useTypeSocialStore, useTokenStore, PiniaRoot } from '@/stores/'
import PictureInput from 'vue-picture-input'
import useHandlePage from '@/utils/handlePage'
import useHandleDatetime from '@/utils/handleDatetime'
import loading3 from '@/components/Loading-Layout-List-Col2.vue'

import Title from '@/utils/Title'
import Dialog from '@/components/Dialog.vue'
import LayoutList from '@/components/Layout-List.vue'
import LayoutListDelete from '@/components/Layout-List-Delete.vue'
</script>

<template>
  <div class="p-5 space-y-5 w-full h-auto" id="social">
    <h1 class="text-3xl">{{ view_bin ? 'ถังขยะของประเภทโซเชียล' : 'ประเภทโซเชียล' }}</h1>

    <div class="" v-if="(view_bin == false && !type_social?.loading)">
      <div class="flex justify-end p-4">
        <v-sheet class="space-x-2 bg-transparent">
          <v-btn color="brown" @click="changeView(true)" v-bind="props"><v-icon start>mdi
              mdi-delete-clock</v-icon>ถังขยะ</v-btn>
          <v-btn color="deep-purple" @click="onShowDialog('add')" v-bind="props"><v-icon start>mdi
              mdi-plus</v-icon>เพิ่มประเภทโซเชียล</v-btn>
        </v-sheet>
      </div>

      <v-row no-gutters v-if="type_social?.length">
        <LayoutList :layout="displayed" v-on:showDialog="onShowDialog" v-on:getid="TypeSocialGetID"
          v-on:delete="TypeSocialDelete" />
      </v-row>

      <h1 v-if="!type_social?.length" class="text-2xl flex justify-center">ไม่มีข้อมูล</h1>

      <v-pagination v-if="(searchData == '' && type_social?.length)" class="page" v-model="currentPage"
        :length="totalPages"></v-pagination>

      <v-dialog class="z-0 " v-model="showDialog" width="1024" persistent>
        <Dialog :dialog="dialog" v-on:out="reset" v-on:add="TypeSocialAddSubmit" v-on:update="TypeSocialUpdateSubmit"
          v-on:delete="TypeSocialDelete">
        </Dialog>
      </v-dialog>
    </div>

    <div class="" v-if="(view_bin == true && !delete_type_social?.loading)">
      <div class="flex justify-end p-4">
        <v-sheet class="space-x-2">
          <v-btn color="grey-darken-1" @click="changeView(false)" v-bind="props"><v-icon
              start>mdi-arrow-left</v-icon>ย้อนกลับ</v-btn>
        </v-sheet>
      </div>

      <v-row no-gutters v-if="delete_type_social?.length">
        <LayoutListDelete :layout="displayed" v-on:restore="TypeSocialUnDelete"
          v-on:deletebackup="TypeSocialDeleteBackup" />
      </v-row>

      <h1 v-if="!delete_type_social?.length" class="text-2xl flex justify-center">ไม่มีข้อมูล</h1>

      <v-pagination v-if="(searchData == '' && delete_type_social?.length)" class="page" v-model="currentPage"
        :length="totalPages"></v-pagination>
    </div>

    <div v-if="(type_social?.loading || delete_type_social?.loading)">
      <loading3 />
    </div>

  </div>
</template>

<script>
export default {
  name: 'TypeSocial',
  setup() {
  },
  data() {
    return {
      view_bin: false,

      type_social: null,
      type_social_id: null,
      delete_type_social: null,

      list: [1],
      itemsPerPage: 4,
      currentPage: 1,

      searchData: '',

      showDialog: false,
      dialog: {
        type: null,
        base64String: null,
        input_add: {
          data: {
            name: null,
          },
          image: {
            icon: null,
          }
        },
        input_update: {
          data: {
            name: null,
          },
          image: {
            icon: null,
          }
        },
        data_id: {
          id: null,
          data: {
            name: null,
            create_time: null,
            update_time: null,
          },
          image: {
            icon: null,
          }
        },
        title: {
          name: "ชื่อประเภทโซเชียล",
          icon: "รูปประเภทโซเชียล",
          create_time: Title().create_time,
          update_time: Title().update_time,
        }
      },
      layout: {
        type: "detail",
        id: [],
        data: [],
        image: {
          icon: []
        },
        title: {
          name: "ชื่อประเภทโซเชียล",
          icon: "รูปประเภทโซเชียล",
        }
      },
    }
  },
  computed: {
    PictureInput,
    totalPages() {
      return this.list != '' ? useHandlePage.total_pages(this.list?.length, this.itemsPerPage) : ''
    },
    filtered() {
      return this.list.filter((item) => {
        const lowerCaseQuery = this.searchData.toLowerCase()
        return (
          item.name.toLowerCase().match(lowerCaseQuery) ||
          item.name_eng.toLowerCase().match(lowerCaseQuery)
        )
      });
    },
    displayed() {
      if (this.currentPage > this.totalPages) this.currentPage = this.totalPages
      const respones = this.list != '' && this.currentPage != ''
        ? useHandlePage.getdata_pages(this.currentPage, this.itemsPerPage, this.list)
        : ''

      const data = this.searchData != ''
        ? this.filtered
        : this.list.slice(respones[0], respones[1])

      this.layout.id = data.map((data) => data.id)
      this.layout.data = data.map(({ name }) => ({ name }))
      this.layout.image.icon = data.map((data) => data.icon)
      return this.layout
    }
  },
  async created() {
    this.TypeSocialDataStore()
    this.TypeSocialGetDelete()
  },
  methods: {
    ...mapActions(useTypeSocialStore, ['Get_TypeSocial_S', 'Get_TypeSocial_ID_S', 'Add_TypeSocial_ID_S', 'Update_TypeSocial_ID_S',
      'Delete_TypeSocial_ID_S', 'Get_Delete_TypeSocial_S', 'UnDelete_TypeSocial_ID_S', 'DeleteBackup_TypeSocial_ID_S']),
    async onShowDialog(type) {
      this.showDialog = true;
      this.dialog.type = type;
    },
    async changeView(type) {
      this.view_bin = type;
      this.view_bin == false
        ? this.list = this.type_social
        : this.list = this.delete_type_social
      this.currentPage = 1
    },
    async TypeSocialDataStore() {
      const TypeSocialStore = useTypeSocialStore()
      this.type_social = { loading: true }
      const response = await this.Get_TypeSocial_S(PiniaRoot.token.token)
      if (typeof response == 'string') {
        await sweetalert2.warning(response)
      }
      this.type_social = TypeSocialStore.$state.data
      this.list = this.type_social
    },
    async TypeSocialGetID(id) {
      const TypeSocialStore = useTypeSocialStore()
      this.type_social_id = { loading: true }
      const response = await this.Get_TypeSocial_S(PiniaRoot.token.token)
      if (typeof response == 'string') {
        await sweetalert2.warning(response)
      }
      this.type_social_id = await TypeSocialStore.$state.data.find(p => p.id == id)
      if (!this.type_social_id) {
        this.type_social_id = { loading: true }
        const response = await this.Get_TypeSocial_ID_S(PiniaRoot.token.token, id)
        if (typeof response == 'string') {
          await sweetalert2.warning(response)
        }
        this.type_social_id = TypeSocialStore.$state.data_id
      }
      this.dialog.data_id.id = id
      for (const key in this.type_social_id) {
        if (this.dialog.data_id.data[key] !== undefined) {
          this.dialog.data_id.data[key] = this.type_social_id[key]
        } else if (this.dialog.data_id.image[key] !== undefined) {
          this.dialog.data_id.image[key] = this.type_social_id[key]
        }

        if (this.dialog.input_update.data[key] !== undefined) {
          this.dialog.input_update.data[key] = this.type_social_id[key]
        } else if (this.dialog.input_update.image[key] !== undefined) {
          this.dialog.input_update.image[key] = this.type_social_id[key]
          this.dialog.base64String = this.type_social_id[key]
        }
      }
    },
    async TypeSocialAddSubmit(datas) {
      const data_token = await useTokenStore().DeCode(PiniaRoot.token.token)
      let add_data = { ...datas.data, ...datas.image }
      const response = await this.Add_TypeSocial_ID_S(PiniaRoot.token.token, add_data);
      if (typeof response == 'string') {
        this.reset('dialog.input_add')
        await sweetalert2.warning(response)
      }
      else {
        this.reset('dialog.input_add')
        await sweetalert2.success('สำเร็จ')
      }
      this.TypeSocialDataStore()
    },
    async TypeSocialUpdateSubmit(id, datas) {
      const data_token = await useTokenStore().DeCode(PiniaRoot.token.token)
      const TypeSocialStore = useTypeSocialStore()
      const temp_update = await TypeSocialStore.$state.data.find(p => p.id == id)
      let update_data = { ...datas.data, ...datas.image }
      const response = await this.Update_TypeSocial_ID_S(PiniaRoot.token.token, update_data, id)
      if (typeof response == 'string') {
        this.reset('dialog.input_update')
        await sweetalert2.warning(response)
      }
      else {
        for (const key in this.dialog.input_update.data) {
          temp_update[key] = update_data[key]
        }
        temp_update.icon = update_data.icon;
        temp_update.update_time = useHandleDatetime.isoStrToLocalStr(new Date())
        this.type_social = TypeSocialStore.$state.data
        this.list = this.type_social
        this.reset('dialog.input_update')
        await sweetalert2.success('สำเร็จ')
      }
    },
    async TypeSocialDelete(id) {
      sweetalert2.Delete('ลบข้อมูล', 'คุณแน่ใจใช่หรือไม่', id, async res => {
        if (res[0].isConfirmed == true) {
          const TypeSocialStore = useTypeSocialStore()
          const response = await this.Delete_TypeSocial_ID_S(PiniaRoot.token.token, id);
          if (typeof response == 'string') {
            await sweetalert2.warning(response)
          }
          else {
            const temp_Delete = await TypeSocialStore.$state.data.find(p => p.id == id)
            await TypeSocialStore.$state.delete_data.push(temp_Delete)
            TypeSocialStore.$state.data = await TypeSocialStore.$state.data.filter((Delete) => Delete.id != id);
            this.type_social = TypeSocialStore.$state.data
            this.list = this.type_social
            sweetalert2.success('สำเร็จ')
          }
        };
      });
    },
    async TypeSocialGetDelete() {
      const TypeSocialStore = useTypeSocialStore()
      if (TypeSocialStore.$state.delete_data == null) {
        const response = await this.Get_Delete_TypeSocial_S(PiniaRoot.token.token)
        if (typeof response == 'string') {
          await sweetalert2.warning(response)
        }
      }
      this.delete_type_social = TypeSocialStore.$state.delete_data
    },
    async TypeSocialUnDelete(id) {
      sweetalert2.Delete('กู้คืนข้อมูล', 'คุณแน่ใจใช่หรือไม่', id, async res => {
        if (res[0].isConfirmed == true) {
          const TypeSocialStore = useTypeSocialStore()
          const response = await this.UnDelete_TypeSocial_ID_S(PiniaRoot.token.token, id);
          if (typeof response == 'string') {
            await sweetalert2.warning(response)
          }
          else {
            const temp_UnDelete = await TypeSocialStore.$state.delete_data.find(p => p.id == id)
            let i = 0
            while (i < this.type_social?.length && this.type_social[i].id < temp_UnDelete.id) i++
            await TypeSocialStore.$state.data.splice(i, 0, temp_UnDelete)

            TypeSocialStore.$state.delete_data = await TypeSocialStore.$state.delete_data.filter((UnDelete) => UnDelete.id != id);
            this.delete_type_social = TypeSocialStore.$state.delete_data
            this.list = this.delete_type_social
            sweetalert2.success('สำเร็จ')
          }
        };
      });
    },
    async TypeSocialDeleteBackup(id) {
      sweetalert2.Delete('ลบข้อมูลถาวร', 'คุณแน่ใจใช่หรือไม่', id, async res => {
        if (res[0].isConfirmed == true) {
          const TypeSocialStore = useTypeSocialStore()
          const response = await this.DeleteBackup_TypeSocial_ID_S(PiniaRoot.token.token, id);
          if (typeof response == 'string') {
            await sweetalert2.warning(response)
          }
          else {
            TypeSocialStore.$state.delete_data = await TypeSocialStore.$state.delete_data.filter((UnDelete) => UnDelete.id != id);
            this.delete_type_social = TypeSocialStore.$state.delete_data
            this.list = this.delete_type_social
            sweetalert2.success('สำเร็จ')
          }
        };
      });
    },
    async reset(nameinput) {
      this.showDialog = false;
      this.dialog.base64String = null,
        nameinput == "dialog.input_add"
          ? Object.assign(this.$data.dialog.input_add, this.$options.data().dialog.input_add)
          : Object.assign(this.$data.dialog.input_update, this.$options.data().dialog.input_update);
    },
  }
}
</script>
<style>
html {
  scroll-behavior: smooth !important;
}
</style>
