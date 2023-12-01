<template >
  <div class="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
    <v-card v-for="(layout_data, layout_data_index) in layout.data" :key="layout_data_index" class="rounded-xl pa-4"
      elevation="3">
      <div no-gutters class="">

        <v-col col="12" class="d-flex flex-wrap items-center justify-center pa-0" color="transparent">

          <v-col class="d-flex justify-center">
            <v-avatar size="120" color="grey-darken-2" class="rounded-full " v-for="(image, image_key) in layout.image"
              :key="image_key">
              <v-img v-if="image[layout_data_index]" width="300" :aspect-ratio="1" cover
                :src="image[layout_data_index]"></v-img>
              <font-awesome-icon v-else icon="image" class="w-auto h-12 text-white" />
            </v-avatar>
          </v-col>

          <v-col cols="12" lg="8" class="pa-0">
            <div v-for="(value, key) in layout_data" :key="key" class="text-lg sm:text-xl flex space-x-3 ma-0">
              <p v-if="layout.title"> {{ layout.title[key] }} : </p>
              <p> {{ layout_data[key] }} </p>
            </div>
          </v-col>
          
        </v-col>

        <v-col col="12" class="space-x-2 text-center d-flex justify-center">
          <v-btn v-if="layout.admin[layout_data_index] == null" @click="Add(layout.id[layout_data_index])" color="cyan-darken-2" icon="" active="" size="40">
              <v-icon icon="mdi mdi-account-plus"></v-icon>
              <v-tooltip activator="parent" location="bottom">เพิ่มผู้ดูแลระบบ</v-tooltip>
            </v-btn>

          <v-btn v-else color="grey-darken-2" @click="RouterLink(layout.id[layout_data_index], layout.admin[layout_data_index] )" icon="" active="" size="40" >
            <v-icon icon="mdi mdi-cog"></v-icon>
            <v-tooltip activator="parent" location="bottom">ตั้งค่า</v-tooltip>
          </v-btn>

          <v-btn color="blue" size="40" icon="" @click="GetID(layout.id[layout_data_index]), ShowDialog('detail')">
            <v-icon icon="mdi mdi-text-box-edit"></v-icon>
            <v-tooltip activator="parent" location="bottom">รายละเอียด</v-tooltip>
          </v-btn>
          <v-btn color="red" size="40" icon="" @click="Delete(layout.id[layout_data_index])">
            <v-icon icon="mdi mdi-delete"></v-icon>
            <v-tooltip activator="parent" location="bottom">ลบ</v-tooltip>
          </v-btn>
        </v-col>
        
      </div>

    </v-card>
  </div>
</template>

<script>

export default {
  props: {
    layout: Object,
  },

  data() {
    return {
      list: [1],
      itemsPerPage: 5,
      currentPage: 1,

      tab: 'one',
      rule: [v => v ? true : 'กรุณากรอกข้อมูล'],
      list_select_add: null,
      rule_image: [v => { return !v || !v.length || v[0].size < 4000000 || 'ขนาดรูปภาพมากกว่า 4 MB' }],
    }
  },
  computed: {
  },
  watch: {
  },
  async created() {
  },
  methods: {
    async RouterLink(id_company, data_admin) {
      const Data = [id_company, data_admin]
      this.$emit('url', Data)
    },
    async Delete(id) {
      this.$emit('delete', id)
    },
    async Add(id) {
      this.$emit('add', id)
    },
    async GetID(id) {
      this.$emit('getid', id)
    },
    async ShowDialog(type) {
      this.$emit('showDialog', type)
    },
  }
}
</script>
<style>
.text-container {
  white-space: nowrap;
  /* ข้อความไม่ตัดบรรทัดใหม่ */
  overflow: hidden;
  /* ซ่อนข้อความที่ล้น */
  text-overflow: ellipsis;
  /* แสดง ... เมื่อข้อความล้น */
  max-width: 100%;
  /* ความกว้างสูงสุดของ container */
}
</style>