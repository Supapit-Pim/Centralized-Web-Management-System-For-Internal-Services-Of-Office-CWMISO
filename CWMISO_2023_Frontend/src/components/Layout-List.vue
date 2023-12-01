<template>
  <v-col cols="12" md="6" v-for="(layout_data, layout_data_index) in layout.data" :key="layout_data_index">
    <v-card class="py-6 px-4 ma-2 rounded-xl text-xs text-sm-caption text-md-body-2 text-lg-body-1" elevation="2" >
      <v-row no-gutters justify="center">
        <!-- NOTE image -->
        <!-- ถ้ามีรูป -->
        <v-col v-if="layout.image" cols="12" sm="2" class="d-flex justify-center">
          <v-avatar size="60" color="grey-darken-2" class="rounded-full" v-for="(image, image_key) in layout.image"
            :key="image_key">
            <v-img v-if="image[layout_data_index]" width="300" :aspect-ratio="1" cover
              :src="image[layout_data_index]"></v-img>
            <font-awesome-icon v-else icon="image" class="w-auto h-6 text-white" />
          </v-avatar>
        </v-col>

        <!-- NOTE name -->
        <!-- ถ้ามีรูป -->
        <v-col v-if="layout.image" cols="12" sm="" class="space-x-5 d-flex align-center justify-center justify-sm-start">
          <v-span>
            <v-span v-for="(value, key) in layout_data" :key="key">
              {{ layout.title[key] }}
              <br>
            </v-span>
          </v-span>

          <v-span>
            <v-span v-for="(value, key) in layout_data" :key="key">
              : {{ layout_data[key] }}
              <br>
            </v-span>
          </v-span>
        </v-col>
        <!-- ถ้าไม่มีมีรูป -->
        <v-col v-else cols="12" sm="8" class="space-x-5 d-flex align-center justify-center justify-sm-start">
          <v-span>
            <v-span v-for="(value, key) in layout_data" :key="key">
              {{ layout.title[key] }}
              <br>
            </v-span>
          </v-span>

          <v-span>
            <v-span v-for="(value, key) in layout_data" :key="key">
              : {{ layout_data[key] }}
              <br>
            </v-span>
          </v-span>
        </v-col>

        <!-- NOTE btn -->
        <v-col md="4" class="text-center pt-2 pt-lg-0 d-flex align-center justify-end" no-gutters>
          <v-span>
            <!-- แก้ไข เรียกใช้ปุ่มเลือก หน้า AdminUser -->
            <!-- ถ้าเป็นประเภทการจัดการ -->
            <v-btn v-if="layout.type == 'manage'" color="grey-darken-2" class="mr-1" size="40" icon="" 
            @click="RouterLink(layout.id[layout_data_index])">
              <v-icon icon="mdi mdi-cog"></v-icon>
              <v-tooltip activator="parent" location="bottom">ตั้งค่า</v-tooltip>
            </v-btn>

            <v-btn color="blue-accent-3" class="mr-1" size="40" icon=""
              @click="ShowDialog('detail'), GetID(layout.id[layout_data_index])">
              <v-icon icon="mdi mdi-text-box-edit"></v-icon>
              <v-tooltip activator="parent" location="bottom">รายละเอียด</v-tooltip>
            </v-btn>
            <v-btn color="red-darken-1" class="mr-1" size="40" icon="" @click="Delete(layout.id[layout_data_index])">
              <v-icon icon="mdi mdi-delete"></v-icon>
              <v-tooltip activator="parent" location="bottom">ลบ</v-tooltip>
            </v-btn>
          </v-span>
        </v-col>

      </v-row>
    </v-card>
  </v-col>
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

  methods: {
    async validate(nameform) {
      const { valid } = await this.$refs[nameform].validate()
      return valid
        ? true
        : false;
    },
    async resetValidation(nameform) {
      await this.$refs[nameform].resetValidation()
    },
    async RouterLink(id) {
      this.$emit('url', id)
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
    async readURL(name, event) {
      const read = await useHandlePhoto.readURL(event)
      this.dialog.base64String = read.base64String
      if (name == 'Add') {
        for (const key in this.dialog.input_add.image) {
          this.dialog.input_add.image[key] = event.target.files[0]
        }
      } else {
        for (const key in this.dialog.input_update.image) {
          this.dialog.input_update.image[key] = event.target.files[0]
        }
      }
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