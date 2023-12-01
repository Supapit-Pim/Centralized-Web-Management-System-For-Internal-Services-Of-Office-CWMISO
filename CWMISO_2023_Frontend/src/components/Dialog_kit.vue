<template>
  <v-card class="rounded-xl">

    <!-- NOTE toolbar add -->
    <v-toolbar v-if="dialog.type == 'add'" color="indigo" class="text-h5 " title="เพิ่มข้อมูล">
      <v-btn icon dark @click="Reset('dialog.input_add')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <!-- NOTE toolbar detail or update -->
    <v-toolbar v-else color="indigo" class="text-h5 " :title="tab == 'one' ? 'รายละเอียด' : 'แก้ไข'">
      <v-btn icon dark @click="Reset('dialog.input_update'), tab = 'one'">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <!-- NOTE Tabs Button All in Dialog detail or update-->
    <v-sheet v-if="dialog.type != 'add'">
      <v-tabs v-model="tab">
        <v-tab value="one" color="indigo-accent-4" @click="GetID(dialog.data_id.id), ResetValidation('form_update')">
          <v-icon start>mdi-text-box-search-outline</v-icon>รายละเอียด</v-tab>
        <v-tab value="two" color="indigo-accent-4">
          <v-icon start>mdi-border-color</v-icon>แก้ไข</v-tab>
        <v-tab color="indigo-accent-4" @click="Delete(dialog.data_id.id)">
          <v-icon start>mdi-delete-outline</v-icon>ลบ</v-tab>
      </v-tabs>
    </v-sheet>

    <!-- NOTE container add -->
    <v-form @submit.prevent ref="form_add" v-if="dialog.type == 'add'">
      <v-container>
        <v-sheet>
          <v-col col="12" class="d-lg-flex pa-0 mt-6">
            <v-col no-gutters lg="5" class="lg:w-56 pa-0 d-lg-flex justify-center align-center">
              <v-sheet class="text-center space-y-5">
                <!-- NOTE image add -->
                <v-avatar v-if="dialog.input_add.image[0].value !== null" rounded-full size="200"
                  :image="dialog.input_add.image[1].value"></v-avatar>
                <v-avatar v-else rounded-full size="200" color="grey-lighten-3">
                  <v-icon color="grey-darken-3" icon="mdi mdi-account" size="100"></v-icon>
                </v-avatar>
                <!-- NOTE input file add -->
                <v-file-input class="xl:w-56" :label="dialog.input_add.image[0].label" variant="underlined"
                  prepend-icon="mdi-camera" type='file' :show-size="1000"
                  :rules="dialog.input_add.image[0].rule !== null ? dialog.input_add.image[0].rule : false"
                  :readonly="dialog.input_add.image[0].readonly ? dialog.input_add.image[0].readonly : false"
                  :clearable="false" @change="readURL('Add', $event)" v-model="dialog.input_add.image[0].value">
                </v-file-input>
              </v-sheet>
            </v-col>
            <!-- NOTE data add -->
            <v-row no-gutters cols="12" lg="6" class="align-center">
              <v-col cols="12" class="pa-0 pb-4 space-y-1" v-for="(add, indexAdd) in dialog.input_add.data" :key="indexAdd">
                <div class="text-h7">{{ add.label }}</div>
                <v-text-field :rules="add.rule !== null ? add.rule : false"
                  :readonly="add.readonly !== null ? add.readonly : false" v-model="add.value"></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-sheet>
        <!-- NOTE submit add -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn type="submit" prepend-icon="mdi-check" variant="tonal" color="#5865f2"
            @click="Add(this.dialog.input_add)">
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
                <v-col no-gutters lg="5" class="lg:w-56 pa-0 d-lg-flex justify-center align-center">
                  <v-sheet class="text-center space-y-5">
                    <!-- NOTE image detail -->
                    <v-avatar v-if="dialog.data_id.image[0].value !== null" rounded-full size="200"
                      :image="dialog.data_id.image[1].value"></v-avatar>
                    <v-avatar v-else rounded-full size="200" color="grey-lighten-3">
                      <v-icon color="grey-darken-3" icon="mdi mdi-account" size="100"></v-icon>
                    </v-avatar>
                  </v-sheet>
                </v-col>

                <!-- NOTE data detail -->
                <v-row no-gutters cols="12" lg="6">
                  <v-col cols="12" lg="6" class="pa-0 pb-4 pr-lg-4 space-y-1" v-for="(dataid, indexDataid) in dialog.data_id.data" :key="indexDataid">
                    <div class="text-h7">{{ dataid.label }}</div>
                    <v-text-field readonly>
                      <p>{{ dataid.value }}</p>
                    </v-text-field>
                  </v-col>
                </v-row>

              </v-col>
            </v-sheet>
          </v-window-item>

          <!-- NOTE update-->
          <v-window-item value="two">
            <v-sheet>
              <v-col col="12" class="d-lg-flex pa-0">
                <v-col no-gutters lg="5" class="xl:w-56 pa-0 d-lg-flex justify-center align-center">
                  <v-sheet class="text-center space-y-5">
                    <!-- NOTE image update -->
                    <v-avatar v-if="dialog.input_update.image[0].value !== null" rounded-full size="200"
                      :image="dialog.input_update.image[1].value"></v-avatar>
                    <v-avatar v-else rounded-full size="200" color="grey-lighten-3">
                      <v-icon color="grey-darken-3" icon="mdi mdi-account" size="100"></v-icon>
                    </v-avatar>

                    <!-- NOTE input file update -->
                    <v-file-input class="xl:w-56" :label="dialog.input_update.image[0].label" variant="underlined"
                      prepend-icon="mdi-camera" type='file' :show-size="1000"
                      :rules="dialog.input_update.image[0].rule !== null ? dialog.input_update.image[0].rule : false"
                      :readonly="dialog.input_update.image[0].readonly ? dialog.input_update.image[0].readonly : false"
                      :clearable="false" @change="readURL('Update', $event)" :v-model="dialog.input_update.image[0].value"
                      required>
                    </v-file-input>
                  </v-sheet>
                </v-col>

                <!-- NOTE data detail -->
                <v-row no-gutters cols="12" lg="6" class="align-center">
                  <v-col cols="12" class="pa-0 pb-4 space-y-1" v-for="(update, indexUpdate) in dialog.input_update.data" :key="indexUpdate">
                    <div class="text-h7">{{ update.label }}</div>
                    <v-text-field :rules="update.rule !== null ? update.rule : false"
                      :readonly="update.readonly !== null ? update.readonly : false" v-model="update.value"></v-text-field>
                  </v-col>
                </v-row>

                <!-- <v-row no-gutters cols="12" lg="6">
                  <v-col cols="12" lg="4" class="pa-0 pb-4 pr-lg-4 space-y-1">
                    <v-sheet class="text-h7">รหัส</v-sheet>
                    <v-text-field readonly v-model="Dataid.id">
                    </v-text-field>
                  </v-col>

                  <v-col cols="12" lg="8" class="pa-0 pb-4 space-y-1">
                    <v-sheet class="text-h7">ชื่อ-นามสกุล</v-sheet>
                    <v-text-field :rules="rule" placeholder="name" v-model="input_update.name">
                    </v-text-field>
                  </v-col>

                  <v-col cols="12" class="pa-0 pb-4 space-y-1">
                    <v-sheet class="text-h7">ชื่อผู้ใช้</v-sheet>
                    <v-text-field :rules="rule" placeholder="username" v-model="input_update.username">
                    </v-text-field>
                  </v-col>

                  <v-col cols="12" class="pa-0 pb-4 space-y-1">
                    <v-sheet class="text-h7">รหัสผ่าน</v-sheet>
                    <v-text-field :rules="rule" placeholder="password" v-model="input_update.password">
                    </v-text-field>
                  </v-col>

                  <v-col cols="12" lg="6" class="pa-0 pb-4 pr-lg-4 space-y-1">
                    <v-sheet class="text-h7">วันที่สร้าง</v-sheet>
                    <v-text-field readonly>{{ Dataid.create_time }}
                    </v-text-field>
                  </v-col>

                  <v-col cols="12" lg="6" class="pa-0 pb-4 space-y-1">
                    <v-sheet class="text-h7">วันที่อัปเดต</v-sheet>
                    <v-text-field readonly>{{ Dataid.update_time
                    }}
                    </v-text-field>
                  </v-col>
                </v-row> -->
              </v-col>
            </v-sheet>

            <!-- <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn type="submit" prepend-icon="mdi-check" variant="tonal" color="#5865f2"
                @click="SuperadminUpdateSubmit(Dataid.id), dialog = false">
                บันทึก </v-btn>
            </v-card-actions> -->
          </v-window-item>

        </v-window>
      </v-container>
    </v-form>

  </v-card>
</template>

<script>
import useHandlePhoto from '@/utils/handlePhoto'

export default {
  props: {
    dialog: Object,
    Dataid: Object,
  },

  data() {
    return {
      tab: 'one',
    }
  },
  computed: {
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
    async Reset(nameinput) {
      await this.$emit('out', nameinput)
    },
    async GetID(id) {
      await this.$emit('getid', id)
    },
    async Add(datas) {
      await this.validate('form_add')
        ? await this.$emit('add', datas)
        : false
    },
    async Update(id) {
      await this.validate('form_update')
        ? await this.$emit('update', id)
        : false
    },
    async Delete(id) {
      await this.$emit('delete', id)
    },
    async readURL(name, event) {
      
      const read = await useHandlePhoto.readURL(event)
      name == 'Add'
        ? this.dialog.input_add.image[1].value = read.base64String
        : this.dialog.input_update.image[1].value = read.base64String
    },
  },
}
</script>