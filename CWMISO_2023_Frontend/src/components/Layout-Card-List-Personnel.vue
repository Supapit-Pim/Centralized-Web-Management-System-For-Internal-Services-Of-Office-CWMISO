<template >
  <div class="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">

    <v-card v-for="(layout_data, layout_data_index) in layout.data" :key="layout_data_index"
      class="drag-el py-6 px-4 rounded-xl text-xs text-sm-caption text-md-body-2 text-lg-body-1" elevation="3">

      <v-row>
        <v-col col="12" class="d-flex flex-wrap items-center justify-center pa-0" color="transparent">
          <v-span>
            <v-span v-for="(value, key) in layout_data" :key="key" class="text-3xl">
              {{ layout_data[key] }}
              <br>
            </v-span>
          </v-span>
        </v-col>
      </v-row>

      <v-row>
        <v-col class="space-x-2 text-center d-flex justify-center">
          <v-btn color="light-green-darken-3" icon="" active="" size="40"
            @click=" RouterLink_DataPersonnel(layout.id[layout_data_index])">
            <v-icon icon="mdi-account-search"></v-icon>
            <v-tooltip activator="parent" location="bottom">บุคลากร</v-tooltip>
          </v-btn>

          <v-btn color="teal-darken-2" size="40" icon="" @click="RouterLink_PersonnelUser(layout.id[layout_data_index])">
            <v-icon icon="mdi-account"></v-icon>
            <v-tooltip activator="parent" location="bottom">ผู้ใช้งาน</v-tooltip>
          </v-btn>

          <v-btn color="blue-accent-3" size="40" icon=""
            @click="ShowDialog('detail'), GetID(layout.id[layout_data_index])" v-bind="props">
            <v-icon icon="mdi mdi-text-box-edit"></v-icon>
            <v-tooltip activator="parent" location="bottom">รายละเอียด</v-tooltip>
          </v-btn>

          <v-btn color="red-darken-1" size="40" icon="" @click="Delete(layout.id[layout_data_index])">
            <v-icon icon="mdi mdi-delete"></v-icon>
            <v-tooltip activator="parent" location="bottom">ลบ</v-tooltip>
          </v-btn>

        </v-col>
      </v-row>
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
    async RouterLink_DataPersonnel(id) {
      this.$emit('urldatapersonnel', id)
    },
    async RouterLink_PersonnelUser(id) {
      this.$emit('urlpersonneluser', id)
    },
    async ShowDialog(type) {
      this.$emit('showDialog', type)
    },
    async GetID(id) {
      await this.$emit('getid', id)
    },
    async Delete(id) {
      await this.$emit('delete', id)
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