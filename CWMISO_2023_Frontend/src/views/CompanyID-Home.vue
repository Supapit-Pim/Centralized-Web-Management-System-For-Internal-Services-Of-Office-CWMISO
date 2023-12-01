<script setup>
import sweetalert2 from '@/assets/js/controller/switchalert'
import { computed } from 'vue'
import { mapActions } from 'pinia'
import { useDisplay } from 'vuetify'
import PictureInput from 'vue-picture-input'
import { useCompanyStore, useTypeCompanyStore, useTokenStore, PiniaRoot } from '@/stores/'
import useHandlePage from '@/utils/handlePage'
import useHandleDatetime from '@/utils/handleDatetime'

import Title from '@/utils/Title'
import Dialog from '@/components/Dialog.vue'
import Menu from '@/components/CompanyID-Menu.vue'

</script>

<template>
  <div class="p-5 space-y-5 w-full h-auto" v-if="companyhomeID" >
    <Menu class="fixed z-50 top-20 right-5"></Menu>

    <div>
      <v-card class="pa-7 d-flex flex-wrap items-center space-x-5">

        <v-sheet class="ma-5 p-16 " color="light-blue-lighten-5">
          <v-avatar size="200">
            <v-img v-if="companyhomeID.logo" :src="companyhomeID.logo" cover></v-img>
            <font-awesome-icon v-else icon="image" class="w-auto h-12 text-white" />
          </v-avatar>
        </v-sheet>

        <v-sheet color="transparent">
          <h1 class="text-3xl">สำนักงาน {{ this.companyhomeID.type_company_id }} {{ this.companyhomeID.name }}</h1>
          <p>{{ Title().id }} : {{ this.companyhomeID.id }} </p>
          <p>{{ Title().name_company }} : {{ this.companyhomeID.name }} </p>
          <p>{{ Title().name_eng }} : {{ this.companyhomeID.name_eng }} </p>
          <p>{{ Title().number }} : {{ this.companyhomeID.number }} </p>
          <p>{{ Title().address }} : {{ this.companyhomeID.address }} </p>
          <p>{{ Title().location }} : {{ this.companyhomeID.location }} </p>
          <p>{{ Title().tel }} : {{ this.companyhomeID.tel }} </p>
          <p>{{ Title().flash }} : {{ this.companyhomeID.flash }} </p>
          <p>{{ Title().type_company_id }} : {{ this.companyhomeID.type_company_id }} </p>
          <p>{{ Title().create_time }} : {{ this.companyhomeID.create_time }} </p>
          <p>{{ Title().update_time }} : {{ this.companyhomeID.update_time }} </p>
          <p>{{ Title().superadmin_id }} : {{ this.companyhomeID.superadmin_id }} </p>
        </v-sheet>
      </v-card>

    </div>

  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
export default {
  name: 'CompanyHomeID',
  setup() { },
  data() {
    return {
      companyhomeID: null,
    }
  },
  computed: {

    PictureInput,
    totalPages() {
      return this.list != '' ? useHandlePage.total_pages(this.list?.length, this.itemsPerPage)
        : ''
    },
    company() {

      if (this.searchData != '') {
        return this.company.filter((item) => {

          const lowerCaseQuery = this.searchData.toLowerCase()
          return (
            item.name.toLowerCase().match(lowerCaseQuery) ||
            item.name_eng.toLowerCase().match(lowerCaseQuery)
          )
        })
      } else {
        const response = this.list != '' && this.currentPage != ''
          ? useHandlePage.getdata_pages(this.currentPage, this.itemsPerPage, this.list)
          : ''
        return this.list.slice(response[0], response[1]) // 0-9 / 10-19
      }
    }
  },
  async created() {
    
    this.CompanyID_DataStore()
  },

  methods: {
    ...mapActions(useCompanyStore, ['GetID', 'Update', 'Add', 'Delete']),
    ...mapActions(useCompanyStore, ['GetID_Admin']),
    ...mapActions(useTokenStore, ['DeCodeJWT']),
    async CompanyID_DataStore() {
      const TokenStore = await useTokenStore()
      const CompanyStore = await useCompanyStore()
      // const admintoken =  await PiniaRoot.token.deCode
      const response = await TokenStore.DeCodeJWT()
      const ID = response.DataUser.id
      
      if (CompanyStore.$state.data != null) {
        this.companyhomeID = await CompanyStore.$state.data.find(p => p.id == ID)
      } else {
        const response = await CompanyStore.GetID_Admin(PiniaRoot.token.token, ID)
        this.companyhomeID = response[0];
      }
    },
  },
  watch: {
  },
}
</script>
