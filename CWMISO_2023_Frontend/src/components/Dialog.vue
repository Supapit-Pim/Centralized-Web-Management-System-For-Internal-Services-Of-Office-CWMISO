<script setup>
// import { useTypeCompanyStore, useListPersonnelStore, PiniaRoot } from '@/stores/'
import { mapActions } from 'pinia'
import { useTypeCompanyStore, PiniaRoot } from '@/stores/'
import useHandlePhoto from '@/utils/handlePhoto'
import useHandleFile from '@/utils/handleFile';
</script>

<template>
  <v-card>

    <!-- NOTE toolbar add -->
    <v-toolbar v-if="dialog.type == 'add'" color="indigo" class="text-h5 " title="เพิ่มข้อมูล">
      <h1>{{ dialog.data_id.data[0] }}</h1>
      <v-btn icon dark @click="ResetOut('dialog.input_add')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <!-- NOTE toolbar detail or update -->
    <v-toolbar v-else color="indigo" class="text-h5 " :title="tab == 'one' ? 'รายละเอียด' : 'แก้ไข'">
      <v-btn icon dark @click="ResetOut('dialog.input_update'), tab = 'one'">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <!-- NOTE Tabs Button All in Dialog detail or update-->
    <v-sheet v-if="dialog.type != 'add'">
      <v-tabs v-model="tab">
        <v-tab value="one" color="indigo-accent-4" @click="restore('input_update', 'form_update')">
          <v-icon start>mdi-text-box-search-outline</v-icon>รายละเอียด</v-tab>
        <v-tab value="two" color="indigo-accent-4">
          <v-icon start>mdi-border-color</v-icon>แก้ไข</v-tab>
        <v-tab color="indigo-accent-4" @click="Delete(dialog.data_id.id), ResetOut('dialog.input_add')">
          <v-icon start>mdi-delete-outline</v-icon>ลบ</v-tab>
      </v-tabs>
    </v-sheet>

    <!-- NOTE container add -->
    <v-form @submit.prevent ref="form_add" class="" v-if="dialog.type == 'add'">
      <v-container>
        <v-sheet>
          <v-col col="12" class="pa-0 mt-6">
            <!-- <v-col no-gutters lg="5" class="lg:w-56 pa-0 d-lg-flex justify-center align-center"> -->
            <!-- NOTE image add -->
            <v-sheet class="text-center space-y-5"
              v-for="(input_add_image, input_add_image_key) in dialog.input_add.image" :key="input_add_image_key">
              <v-avatar v-if="input_add_image !== null" rounded-full size="200" :image="dialog.base64String"></v-avatar>
              <v-avatar v-else rounded-full size="200" color="grey-lighten-3">
                <v-icon color="grey-darken-3" icon="mdi mdi-account" size="100"></v-icon>
              </v-avatar>
              <!-- NOTE input file add -->
              <v-file-input class="" :label="dialog.title[input_add_image_key]" variant="underlined"
                prepend-icon="mdi-camera" type='file' :show-size="1000" :rules="rule_image" :clearable="false"
                @change="readURL('Add', $event)" :v-model="dialog.input_add.image[input_add_image_key]">
              </v-file-input>
            </v-sheet>
            <!-- </v-col> -->
            <!-- NOTE data add -->
            <v-row no-gutters cols="12" class="align-center flex">

              <v-col cols="12" lg="6 " class="pa-0 pb-4 pl-lg-4"
                v-for="(input_select_add, input_add_select_key) in dialog.select" :key="input_add_select_key">
                <v-sheet v-if="input_select_add" class="space-y-1 ">
                  <div class="text-h7">{{ dialog.title[input_add_select_key] }}</div>
                  <v-select class="" :rules="rule" placeholder="เลือกประเภท"
                    v-model="dialog.input_add.select[input_add_select_key]" :items="input_select_add" item-title="name"
                    item-value="id"></v-select>
                </v-sheet>
              </v-col>

              <v-col cols="12" lg="6" class="pa-0 pb-4 space-y-1 lg:space-x-4 "
                v-for="(input_add_value, input_add_key) in dialog.input_add.data" :key="input_add_key">
                <!-- <div class="space-y-1"> -->
                <div class="text-h7 lg:pl-4">{{ dialog.title[input_add_key] }}</div>
                <v-text-field class="" :rules="rule" v-model="dialog.input_add.data[input_add_key]"></v-text-field>
                <!-- </div> -->
              </v-col>

              <v-col cols="12" lg="6 " class="pa-0 pb-4 pl-lg-4"
                v-for="(input_add_file_input, input_add_file_input_key) in dialog.input_add.file_input"
                :key="input_add_file_input_key">
                <div class="text-h7">{{ dialog.title[input_add_file_input_key] }}</div>
                <v-file-input class="" :label="dialog.title[input_add_file_input_key]" variant="underlined" type='file'
                  :show-size="1000" :rules="rule_file" :clearable="false" @change="readURLFile('Add', $event)"
                  :v-model="dialog.input_add.file_input[input_add_file_input_key]">
                </v-file-input>
              </v-col>

            </v-row>
          </v-col>
        </v-sheet>
        <!-- NOTE submit add -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn type="submit" prepend-icon="mdi-check" variant="tonal" color="#5865f2" @click="Add(dialog.input_add)">
            บันทึก </v-btn>
        </v-card-actions>
      </v-container>
    </v-form>

    <!-- NOTE container detail or update -->
    <v-form @submit.prevent ref="form_update" v-else>
      <v-container>
        <v-window v-model="tab">
          <!-- NOTE detail-->
          <v-window-item value="one">
            <v-sheet>
              <v-col col="12" class="d-lg-flex pa-0">
                <v-col no-gutters lg="4" class="lg:w-56 pa-0 d-lg-flex justify-center align-center"
                  v-if="dialog.data_id.image">
                  <v-sheet class="text-center space-y-5"
                    v-for="(data_id_image, data_id_image_key) in dialog.data_id.image" :key="data_id_image_key">
                    <!-- NOTE image detail -->
                    <v-avatar v-if="data_id_image !== null" rounded-full size="200" :image="data_id_image"></v-avatar>
                    <v-avatar v-else rounded-full size="200" color="grey-lighten-3">
                      <v-icon color="grey-darken-3" icon="mdi mdi-account" size="100"></v-icon>
                    </v-avatar>
                  </v-sheet>
                </v-col>
                <!-- NOTE data detail -->
                <v-row no-gutters cols="12" lg="6">

                  <v-col cols="12" lg="6" class="pa-0 pb-4 pr-lg-4 space-y-1"
                    v-for="(data_id_value, data_id_key) in dialog.data_id.data" :key="data_id_key">
                    <div class="text-h7">{{ dialog.title[data_id_key] }}</div>
                    <v-text-field readonly>
                      <p>{{ data_id_value }}</p>
                    </v-text-field>
                  </v-col>

                  <v-col cols="12" lg="6" class="pa-0 pb-4 pr-lg-4 space-y-1"
                    v-for="(data_id_file_input, data_id_file_input_key) in dialog.data_id.file_input"
                    :key="data_id_file_input_key">

                    <div class="text-h7">{{ dialog.title[data_id_file_input_key] }} </div>
                    <v-text-field readonly v-if="data_id_file_input == null">
                      <p>ไม่มีเอกสาร</p>
                    </v-text-field>

                    <v-btn prepend-icon="mdi mdi-file-document" size="large"
                      v-else-if="data_id_file_input?.length <= maxNameLength" @click="downloadFile()">
                      {{ data_id_file_input }}
                    </v-btn>

                    <v-btn prepend-icon="mdi mdi-file-document" size="large" v-else @click="downloadFile()"
                      :href="downloadURL">
                      {{ data_id_file_input.slice(0, maxNameLength) + '...' }}
                    </v-btn>
                  </v-col>

                </v-row>
              </v-col>
            </v-sheet>
          </v-window-item>

          <!-- NOTE update-->
          <v-window-item value="two">
            <v-sheet>
              <v-col col="12" class="d-lg-flex pa-0">
                <v-col no-gutters lg="4" class="xl:w-56 pa-0 d-lg-flex justify-center align-center"
                  v-if="dialog.data_id.image">
                  <v-sheet class="text-center space-y-5"
                    v-for="(input_update_image, input_update_image_key) in dialog.input_update.image"
                    :key="input_update_image_key">
                    <!-- NOTE image update -->
                    <v-avatar v-if="input_update_image !== null" rounded-full size="200"
                      :image="dialog.base64String"></v-avatar>
                    <v-avatar v-else rounded-full size="200" color="grey-lighten-3">
                      <v-icon color="grey-darken-3" icon="mdi mdi-account" size="100"></v-icon>
                    </v-avatar>
                    <!-- NOTE input file update -->
                    <v-file-input class="xl:w-56" :label="dialog.title[input_update_image_key]" variant="underlined"
                      prepend-icon="mdi-camera" type='file' :show-size="1000" :rules="rule_image" :clearable="false"
                      @change="readURL('Update', $event)" :v-model="dialog.input_update.image[input_update_image_key]"
                      required>
                    </v-file-input>
                  </v-sheet>
                </v-col>
                <!-- NOTE data update -->
                <v-row no-gutters cols="12" lg="6" class="align-center">

                  <v-col cols="12" lg="6 " class="pa-0 pb-4 space-y-1 pr-lg-4"
                    v-for="(input_select_add, input_add_select_key) in dialog.select" :key="input_add_select_key">
                    <v-sheet v-if="input_select_add" class="space-y-1 ">
                      <div class="text-h7">{{ dialog.title[input_add_select_key] }}</div>
                      <v-select class="" v-model="dialog.input_update.select.type_company_id" :items="input_select_add"
                        item-title="name" item-value="id" :rules="rule"></v-select>
                    </v-sheet>
                  </v-col>

                  <v-col cols="12" lg="6" class="pa-0 pb-4 pr-lg-4 space-y-1"
                    v-for="(input_update_value, input_update_key) in dialog.input_update.data" :key="input_update_key">
                    <div class="text-h7">{{ dialog.title[input_update_key] }}</div>
                    <v-text-field :rules="rule" v-model="dialog.input_update.data[input_update_key]"></v-text-field>
                  </v-col>

                  <v-col cols="12" lg="6 " class="pa-0 pb-4 pl-lg-4"
                    v-for="(input_update_file_input, input_update_file_input_key) in dialog.input_update.file_input"
                    :key="input_update_file_input_key">
                    <div class="text-h7">{{ dialog.title[input_update_file_input_key] }}</div>
                    <v-file-input class="" :label="dialog.title[input_update_file_input_key]" variant="underlined"
                      type='file' :show-size="1000" :rules="rule_file" :clearable="false"
                      @change="readURLFile('Update', $event)"
                      :v-model="dialog.input_update.file_input[input_update_file_input_key]" required>
                    </v-file-input>
                  </v-col>

                </v-row>
              </v-col>
            </v-sheet>
            <!-- NOTE submit update -->
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn type="submit" prepend-icon="mdi-check" variant="tonal" color="#5865f2"
                @click="Update(dialog.data_id.id, dialog.input_update)">
                บันทึก </v-btn>
            </v-card-actions>
          </v-window-item>

        </v-window>
      </v-container>
    </v-form>

  </v-card>
</template>

<script>

export default {
  props: {
    dialog: Object,
  },

  data() {
    return {
      downloadURL: null,
      maxNameLength: 18,
      tab: 'one',
      rule: [v => v ? true : 'กรุณากรอกข้อมูล'],
      list_select_add: null,
      rule_image: [v => { return !v || !v.length || v[0].size < 4000000 || 'ขนาดรูปภาพมากกว่า 4 MB' }],
      rule_file: [v => { return !v || !v.length || v[0].size < 4000000 || 'ขนาดเอกสารมากกว่า 4 MB' }],
    }
  },
  computed: {
    dataDownload() {
      return this.downloadURL = this.createDownloadURL(this.dialog.FileBase64);
    }
  },
  watch: {
  },
  async created() {
  },
  methods: {
    ...mapActions(useTypeCompanyStore, ['Getdata', 'TypeCompany_ID_Name']),
    async validate(nameform) {
      const { valid } = await this.$refs[nameform].validate()
      return valid
        ? true
        : false;
    },
    async restore(nameinput, nameform) {
      await this.$refs[nameform].reset()
      for (const key in this.dialog[nameinput].data) {
        this.dialog[nameinput].data[key] = this.dialog.data_id.data[key]
      }
      if (this.dialog[nameinput]?.image) {
        for (const key in this.dialog[nameinput].image) {
          this.dialog[nameinput].image[key] = this.dialog.data_id.image[key]
          this.dialog.base64String = this.dialog.data_id.image[key]
        }
      }
      if (this.dialog[nameinput]?.select) {
        for (const key in this.dialog[nameinput].select) {
          this.dialog[nameinput].select[key] = this.dialog.data_id[key]
        }
      }
    },
    async ResetOut(nameinput) {
      await this.$emit('out', nameinput)
    },
    async Add(datas) {
      let validation = await this.validate('form_add')
      if (validation) {
        for (const key in datas.image) {
          datas.image[key] = this.dialog.base64String
        }
        for (const key in datas.file_input) {
          datas.file_input[key] = this.dialog.FileBase64
        }
        await this.$emit('add', datas)
      }
    },
    async Update(id, datas) {
      let validation = await this.validate('form_update')
      if (validation) {
        for (const key in datas.image) {
          datas.image[key] = this.dialog.base64String
        }
        let data_obj = null
        if (this.dialog.FileBase64) data_obj = JSON.parse(this.dialog.FileBase64)
        for (const key in datas.file_input) {
          if (data_obj?.name && data_obj?.data) {
            datas.file_input[key] = this.dialog.FileBase64
          } else {
            datas.file_input[key] = null
          }
        }
        await this.$emit('update', id, datas)
      }
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
    async readURLFile(name, event) {
      const read = await useHandleFile.readURLFile(event)
      this.dialog.FileBase64 = JSON.stringify({ name: read.namefile, data: read.base64String });
      // this.dialog.FileBase64 = read.base64String
      if (name == 'Add') {
        for (const key in this.dialog.input_add.file_input) {
          this.dialog.input_add.file_input[key] = event.target.files[0]
        }
      } else {
        for (const key in this.dialog.input_update.file_input) {
          this.dialog.input_update.file_input[key] = event.target.files[0]
        }
      }
    },
    createDownloadURL(dataURL) {
      const blob = this.dataURLtoBlob(dataURL);
      return URL.createObjectURL(blob);
    },
    dataURLtoBlob(dataURL) {
      const parts = dataURL.split(',');
      const contentType = parts[0].split(':')[1];
      const byteString = atob(parts[1]);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
      }
      return new Blob([arrayBuffer], { type: contentType });
    },
    downloadFile() {
      const link = document.createElement("a");
      link.href = this.dataDownload;
      link.download = this.dialog.data_id.file_input.file;
      link.target = "_blank";
      link.click();
    },
  },
}
</script>