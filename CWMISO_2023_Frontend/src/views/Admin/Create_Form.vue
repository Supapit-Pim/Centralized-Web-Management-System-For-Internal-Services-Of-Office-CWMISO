<script setup>
import { mapActions } from 'pinia'
import { useCreateFormStore, PiniaRoot } from '@/stores/'
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import LoadingList from '@/components/Loading-Layout-List.vue'

</script>

<template>
  <div class="p-5 space-y-5 w-full h-full">
    <div>
      <h1 class="text-3xl">สร้างแบบฟอร์ม</h1>

    <v-row class="d-flex justify-end ma-2">
      <v-btn color="deep-purple"><v-icon start>mdi mdi-plus</v-icon>สร้างแบบฟอร์ม</v-btn>
    </v-row>
    <div class="pt-4" v-if="isLoading != false">
    <!-- From 1 -->
    <v-card class="d-flex w-full" :elevation="2" rounded="xl">
      <v-col class="d-flex align-center space-x-12">
        <v-col>
          <p class="text-xl ma-4">แบบฟอร์มประเภทร้องเรียน - ร้องทุกข์</p>
        </v-col>

          <v-sheet class="space-x-2">
              <v-btn color="blue-accent-3" class="mr-4" size="40" icon="" @click="dialog1 = true" v-bind="props">
                    <v-icon icon="mdi mdi-text-box-edit"></v-icon>
                    <v-tooltip activator="parent" location="bottom">รายละเอียด</v-tooltip>
              </v-btn>

              <v-btn color="red-darken-1" class="mr-6" size="40" icon="">
                    <v-icon icon="mdi mdi-delete"></v-icon>
                    <v-tooltip activator="parent" location="bottom">ลบ</v-tooltip>
              </v-btn>
            </v-sheet>
        </v-col>
    </v-card>

    <!-- From 2 -->
    <v-card class="d-flex w-full my-5" :elevation="2" rounded="xl">
      <v-col class="d-flex align-center space-x-12">
        <v-col>
          <p class="text-xl ma-4">แบบฟอร์ม ร้องเรียนทุจริตและประพฤติมิชอบ</p>
        </v-col>

          <v-sheet class="space-x-2">
              <v-btn color="blue-accent-3" class="mr-4" size="40" icon=""
                    @click="dialog2 = true" v-bind="props">
                    <v-icon icon="mdi mdi-text-box-edit"></v-icon>
                    <v-tooltip activator="parent" location="bottom">รายละเอียด</v-tooltip>
              </v-btn>

              <v-btn color="red-darken-1" class="mr-6" size="40" icon="">
                    <v-icon icon="mdi mdi-delete"></v-icon>
                    <v-tooltip activator="parent" location="bottom">ลบ</v-tooltip>
              </v-btn>
            </v-sheet>
        </v-col>
    </v-card>
    <!-- <div class="flex flex-wrap align-center justify-cente  bg-white p-2">
      <div
        class="rounded-md m-2 bg-slate-300 w-auto h-80 p-2"
        v-for="(data, index) in createform"
        :key="index"
      >
        <p>id : {{ data.id }}</p>
        <p>ชื่อแบบฟอร์ม : {{ data.name }}</p>
        <div class="bg-white rounded-md">ข้อมูล 
          <p>ข้อความสั้น : {{ JSON.parse(data.data).ข้อความสั้น }}</p>
          <p>ตัวเลือก : {{ JSON.parse(data.data).ตัวเลือก }}</p>
        </div>
        <p>รายการให้บริการ : {{ data.list_service_id }}</p>
        <p>วันที่สร้าง : {{ data.create_time }}</p>
        <p>วันที่อัปเดต : {{ data.update_time }}</p>
        <p>สถานะลบ : {{ data.delete_status }}</p>
        <p>ตำแหน่งผู้ดูแล : {{ data.superadmin_id }}</p>
        <p>ตำแหน่งผู้ดูแลรอง : {{ data.admin_id }}</p>
      </div>
    </div> -->

    <!-- Form detail1 Dialog 1 -->
  <v-row justify="center">
    <v-dialog v-model="dialog1" persistent width="1024">
      <v-card>
        <v-card-title class="text-center mt-4">
          <span class="">ข้อมูลแบบฟอร์ม</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
            model-value="แบบฟอร์มประเภทร้องเรียน - ร้องทุกข์"
            label="ชื่อแบบฟอร์ม"
            
          ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-file-input
                show-size
                label="เพิ่มไฟล์"
                ></v-file-input>
              </v-col>
              
              <v-col cols="12" sm="6">
                <v-file-input
                label="เพิ่มไฟล์ภาพ"
                variant="filled"
                prepend-icon="mdi-camera"
              ></v-file-input>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  :items="['เลือกข้อความ', 'Checkbox', 'ข้อความสั้น', 'ข้อความยาว', 'บทความ']"
                  label="เลือกประเภท"
                  multiple
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
          <v-switch class="ml-4" color="indigo" label="แสดงแบบฟอร์ม" inset></v-switch>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="ma-4 mr-2" prepend-icon="mdi-check" variant="tonal" color="#5865f2" @click="dialog1 = false">
            บันทึก
          </v-btn>
          <v-btn  class="mr-4" prepend-icon="mdi-cancel" variant="text" color="#C62828" @click="dialog1 = false">
            ยกเลิก
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>

  <!-- Form detail1 Dialog 2 -->
  <v-row justify="center">
    <v-dialog v-model="dialog2" persistent width="1024">
      <v-card>
        <v-card-title class="text-center mt-4">
          <span class="">ข้อมูลแบบฟอร์ม</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
            model-value="แบบฟอร์ม ร้องเรียนทุจริตและประพฤติมิชอบ"
            label="ชื่อแบบฟอร์ม"
            
          ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-file-input
                show-size
                label="เพิ่มไฟล์"
                ></v-file-input>
              </v-col>
              
              <v-col cols="12" sm="6">
                <v-file-input
                label="เพิ่มไฟล์ภาพ"
                variant="filled"
                prepend-icon="mdi-camera"
              ></v-file-input>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  :items="['เลือกข้อความ', 'Checkbox', 'ข้อความสั้น', 'ข้อความยาว', 'บทความ']"
                  label="เลือกประเภท"
                  multiple
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
          <v-switch class="ml-4" color="indigo" label="แสดงแบบฟอร์ม" inset></v-switch>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="ma-4 mr-2" prepend-icon="mdi-check" variant="tonal" color="#5865f2" @click="dialog2 = false">
            บันทึก
          </v-btn>
          <v-btn  class="mr-4" prepend-icon="mdi-cancel" variant="text" color="#C62828" @click="dialog2 = false">
            ยกเลิก
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
  </div>
  
    <!-- Loading 2 -->
    <LoadingList v-else> </LoadingList>
  
    </div>
  </div>
</template>
<script>
export default {
  setup() {},
  computed: {},
  data() {
    return {
      createform: null,

      dialog1: false,
      dialog2: false,

      isLoading: null,

      model: true,
      
    }
  },
  async created() {
    const CreateFormStore = useCreateFormStore()
    // this.createform = res
    await this.GetDataCreateForm(PiniaRoot.token.token)
    this.createform = CreateFormStore.data
  },

  methods: {
    ...mapActions(useCreateFormStore, ['GetDataCreateForm'])
  }
}
</script>
<style>
html {
  scroll-behavior: smooth !important;
}
</style>
