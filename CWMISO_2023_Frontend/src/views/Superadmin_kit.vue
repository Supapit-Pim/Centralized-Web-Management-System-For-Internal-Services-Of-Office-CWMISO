<script setup>
import sweetalert2 from '@/assets/js/controller/switchalert'
import { mapActions } from 'pinia'
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useSuperAdminStore, PiniaRoot } from '@/stores/'
import PictureInput from 'vue-picture-input'
import useHandlePage from '@/utils/handlePage'
import useHandleDatetime from '@/utils/handleDatetime'
import useHandlePhoto from '@/utils/handlePhoto'

import DialogAdd from '../components/DialogAdd.vue'

const { name } = useDisplay()
const width = computed(() => {
    switch (name.value) {
        case 'xs': return 300
        case 'sm': return 400
        case 'md': return 600
        case 'lg': return 800
        case 'xl': return 800
        case 'xxl': return 800
    }
})
</script>
<template v-slot:activator="{ props }">
    <div class="p-5 space-y-5 w-full h-full" id="">
        <h1 class="text-3xl">user superadmin</h1>

        <!-- NOTE Element by srifong -->
        <!-- NOTE search -->
        <div class="flex justify-between">
            <v-card class="rounded-pill" elevation="1" width="50%">
                <v-text-field v-model="searchData" density="compact" variant="solo" label="Search your Name"
                    append-inner-icon="mdi-magnify" single-line hide-details>
                </v-text-field>
            </v-card>

            <v-btn color="deep-purple" @click="onShowDialog('add')" v-bind="props">Add New</v-btn>
        </div>

        <v-dialog class="z-0 " v-model="showDialog" width="1024" persistent>
            <DialogAdd :dialog="dialog" :Dataid="data_id"
            v-on:out="reset" 
            v-on:getid="SuperadminGetID" 
            v-on:add="SuperadminAddSubmit"
            v-on:update="SuperadminUpdateSubmit"
            v-on:delete="SuperadminDelete">
          </DialogAdd>
        </v-dialog>

        <!-- NOTE get data style by srifong-->
        <v-row no-gutters>
            <v-col v-for="(data, index_superadmin) in superadmin" :key="index_superadmin" cols="12" md="6">
                <v-card class="pa-3 mb-2 mr-2 rounded-xl" elevation="0" color='grey-lighten-4'>
                    <v-row no-gutters justify="center">
                        <v-col class="space-x-3 d-flex align-center justify-center justify-sm-start">
                            <!-- NOTE image -->
                            <v-avatar v-if="data.photo != null" size="60">
                                <v-img width="300" :aspect-ratio="1" cover :src="data.photo"></v-img>
                            </v-avatar>
                            <v-avatar v-else size="60">
                                <v-btn color="white" icon="mdi mdi-account" size="90" class="pa-2"></v-btn>
                            </v-avatar>
                            <!-- NOTE name -->
                            <v-span>
                                <v-span class="text-xs text-sm-caption text-md-body-2">name</v-span><br>
                                <v-span class="text-xs text-sm-caption text-md-body-2">username</v-span>
                            </v-span>
                            <v-span>
                                <v-span class="text-xs text-sm-caption text-md-body-2">: {{ data.name }}</v-span><br>
                                <v-span class="text-xs text-sm-caption text-md-body-2">: {{ data.username }}</v-span>
                            </v-span>
                        </v-col>

                        <!-- NOTE btn -->
                        <v-col md="4" class="text-center pt-2 pt-lg-0 d-flex align-center justify-center" no-gutters>
                            <v-span>
                                <v-btn color="blue" class="rounded-lg mr-1" 
                                    prepend-icon="mdi-text-box-edit-outline"
                                    @click="SuperadminGetID(data.id), onShowDialog('detail')" v-bind="props">
                                    รายละเอียด
                                </v-btn>
                                <v-btn color="red" class="rounded-lg mt-1 mb-1" 
                                    prepend-icon="mdi-delete-outline"
                                    @click="SuperadminDelete(data.id, data.name, data.username)" v-bind="props">
                                    ลบ
                                </v-btn>
                            </v-span>
                        </v-col>

                    </v-row>
                </v-card>
            </v-col>
        </v-row>

        <v-pagination v-if="searchData == ''" class="page" v-model="currentPage" :length="totalPages"></v-pagination>

        <!-- NOTE details -->
        <v-dialog v-model="detail" class="z-0 " width="1024" persistent>
            <v-card class="rounded-xl">
                <v-toolbar color="indigo" class="text-h5 " :title="tab == 'one' ? 'รายละเอียด' : 'แก้ไข'">
                    <v-btn icon dark
                        @click="reset('input_update'), detail = false, update = false, tab = 'one'"><v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <!-- NOTE Tabs Button All in Dialog-->
                <v-sheet>
                    <v-tabs v-model="tab">
                        <v-tab value="one" color="indigo-accent-4" 
                            @click="SuperadminGetID(data_id.id), resetValidation('form_update'), detail = true">
                            <v-icon start>mdi-text-box-search-outline</v-icon>รายละเอียด</v-tab>
                        <v-tab value="two" color="indigo-accent-4">
                            <v-icon start>mdi-border-color</v-icon>แก้ไข</v-tab>
                        <!-- <v-tab value="two" color="indigo-accent-4"
                            @click="SuperadminUpdateID(data_id.id), update = true, detail = ''">
                            <v-icon start>mdi-border-color</v-icon>แก้ไข</v-tab> -->
                        <v-tab color="indigo-accent-4"
                            @click="SuperadminDelete(data_id.id), detail = false, update = false">
                            <v-icon start>mdi-delete-outline</v-icon>ลบ</v-tab>
                    </v-tabs>
                </v-sheet>

                <v-container>
                    <v-window v-model="tab">

                        <!-- NOTE detail-->
                        <v-window-item value="one">
                            <v-sheet>
                                <v-col col="12" class="d-lg-flex pa-0">
                                    <v-col no-gutters lg="5" class="lg:w-56 pa-0 d-lg-flex justify-center align-center">
                                        <v-sheet class="text-center space-y-5">
                                            <v-avatar v-if="data_id.photo != null" rounded-full size="200"
                                                :image="data_id.photo"></v-avatar>
                                            <v-avatar v-else rounded-full size="200" color="grey-lighten-3">
                                                <v-icon color="grey-darken-3" icon="mdi mdi-account" size="100"></v-icon>
                                            </v-avatar>
                                        </v-sheet>
                                    </v-col>

                                    <v-row no-gutters cols="12" lg="6">
                                        <v-col cols="12" lg="4" class="pa-0 pb-4 pr-lg-4 space-y-1">
                                            <div class="text-h7">รหัส</div>
                                            <v-text-field readonly>
                                                <p>{{ data_id.id }}</p>
                                            </v-text-field>
                                        </v-col>

                                        <v-col cols="12" lg="8" class="pa-0 pb-4 space-y-1">
                                            <div class="text-h7">ชื่อ-นามสกุล</div>
                                            <v-text-field readonly>
                                                <p>{{ data_id.name }}</p>
                                            </v-text-field>
                                        </v-col>

                                        <v-col cols="12" class="pa-0 pb-4 space-y-1">
                                            <div class="text-h7">ชื่อผู้ใช้</div>
                                            <v-text-field readonly>
                                                <p>{{ data_id.username }}</p>
                                            </v-text-field>
                                        </v-col>

                                        <v-col cols="12" lg="6" class="pa-0 pb-4 pr-lg-4 space-y-1">
                                            <div class="text-h7">วันที่สร้าง</div>
                                            <v-text-field readonly>
                                                <p>{{ data_id.create_time }}</p>
                                            </v-text-field>
                                        </v-col>

                                        <v-col cols="12" lg="6" class="pa-0 pb-4 space-y-1">
                                            <div class="text-h7">วันที่อัปเดต</div>
                                            <v-text-field readonly>
                                                <p>{{ data_id.update_time }}</p>
                                            </v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-sheet>
                        </v-window-item>
                        <!-- NOTE update-->
                        <v-form @submit.prevent ref="form_update">
                            <v-window-item value="two">

                                <v-sheet>
                                    <v-col col="12" class="d-lg-flex pa-0">
                                        <v-col no-gutters lg="5" class="xl:w-56 pa-0 d-lg-flex justify-center align-center">
                                            <v-sheet class="text-center space-y-5">
                                                <v-avatar v-if="input_update.photo !== null" rounded-full size="200"
                                                    :image="input_update.photoImage"></v-avatar>
                                                <!-- <v-avatar v-else-if="data_id.photo" rounded-full size="200"
                                                    :image="data_id.photo"></v-avatar> -->
                                                <v-avatar v-else rounded-full size="200" color="grey-lighten-3">
                                                    <v-icon color="grey-darken-3" icon="mdi mdi-account"
                                                        size="100"></v-icon>
                                                </v-avatar>

                                                <v-file-input class="xl:w-56" label="File input" variant="underlined"
                                                    prepend-icon="mdi-camera" type='file' :show-size="1000"
                                                    :clearable="false" @change="readURL('Update', $event)"
                                                    :v-model="input_update.photo" required>
                                                </v-file-input>

                                            </v-sheet>
                                        </v-col>
                                        <v-row no-gutters cols="12" lg="6">
                                            <v-col cols="12" lg="4" class="pa-0 pb-4 pr-lg-4 space-y-1">
                                                <v-sheet class="text-h7">รหัส</v-sheet>
                                                <v-text-field readonly v-model="data_id.id">
                                                </v-text-field>
                                            </v-col>

                                            <v-col cols="12" lg="8" class="pa-0 pb-4 space-y-1">
                                                <v-sheet class="text-h7">ชื่อ-นามสกุล</v-sheet>
                                                <v-text-field :rules="rule" placeholder="name" v-model="input_update.name">
                                                </v-text-field>
                                            </v-col>

                                            <v-col cols="12" class="pa-0 pb-4 space-y-1">
                                                <v-sheet class="text-h7">ชื่อผู้ใช้</v-sheet>
                                                <v-text-field :rules="rule" placeholder="username"
                                                    v-model="input_update.username">
                                                </v-text-field>
                                            </v-col>

                                            <v-col cols="12" class="pa-0 pb-4 space-y-1">
                                                <v-sheet class="text-h7">รหัสผ่าน</v-sheet>
                                                <v-text-field :rules="rule" placeholder="password"
                                                    v-model="input_update.password">
                                                </v-text-field>
                                            </v-col>

                                            <v-col cols="12" lg="6" class="pa-0 pb-4 pr-lg-4 space-y-1">
                                                <v-sheet class="text-h7">วันที่สร้าง</v-sheet>
                                                <v-text-field readonly>{{ data_id.create_time }}
                                                </v-text-field>
                                            </v-col>

                                            <v-col cols="12" lg="6" class="pa-0 pb-4 space-y-1">
                                                <v-sheet class="text-h7">วันที่อัปเดต</v-sheet>
                                                <v-text-field readonly>{{ data_id.update_time
                                                }}
                                                </v-text-field>

                                                <!-- <p type="text" id="updatePhoto"
                                                    class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block h-11 w-full p-2.5"
                                                    placeholder="data_id.update_time" required>{{ data_id.update_time }}
                                                </p> -->
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-sheet>

                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn type="submit" prepend-icon="mdi-check" variant="tonal" color="#5865f2"
                                        @click="SuperadminUpdateSubmit(data_id.id), dialog = false">
                                        บันทึก </v-btn>
                                </v-card-actions>
                            </v-window-item>
                        </v-form>
                    </v-window>
                </v-container>
            </v-card>
        </v-dialog>

        <!-- NOTE add new -->
        <v-dialog v-model="add" width="1024" persistent>
            <v-card class="rounded-xl">
                <v-toolbar color="primary" class="text-h5" title="เพิ่มข้อมูล">
                    <v-btn icon dark @click="reset('input_add'), add = false"><v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>

                <v-form @submit.prevent ref="form_add">
                    <v-container>

                        <v-sheet>
                            <v-col col="12" class="d-lg-flex pa-0 mt-6">
                                <v-col no-gutters lg="5" class="lg:w-56 pa-0 d-lg-flex justify-center align-center">
                                    <v-sheet class="text-center space-y-5">
                                        <v-avatar v-if="input_add.photo !== null" rounded-full size="200"
                                            :image="input_add.photoImage"></v-avatar>
                                        <v-avatar v-else rounded-full size="200" color="grey-lighten-3">
                                            <v-icon color="grey-darken-3" icon="mdi mdi-account" size="100"></v-icon>
                                        </v-avatar>

                                        <v-file-input class="xl:w-56" label="File input" variant="underlined"
                                            prepend-icon="mdi-camera" type='file' :show-size="1000" :rules="rule"
                                            :clearable="false" @change="readURL('Add', $event)" v-model="input_add.photo"
                                            required>
                                        </v-file-input>

                                    </v-sheet>
                                </v-col>

                                <v-row no-gutters cols="12" lg="6" class="align-center">
                                    <v-col cols="12" class="pa-0 pb-4 space-y-1">
                                        <div class="text-h7">ชื่อ-นามสกุล</div>
                                        <v-text-field :rules="rule" v-model="input_add.name"></v-text-field>
                                    </v-col>

                                    <v-col cols="12" class="pa-0 pb-4 space-y-1">
                                        <div class="text-h7">ชื่อผู้ใช้</div>
                                        <v-text-field :rules="rule" v-model="input_add.username"></v-text-field>
                                    </v-col>

                                    <v-col cols="12" class="pa-0 space-y-1">
                                        <div class="text-h7">รหัสผ่าน</div>
                                        <v-text-field :rules="rule" v-model="input_add.password"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-sheet>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn type="submit" prepend-icon="mdi-check" variant="tonal" color="#5865f2"
                                @click="SuperadminAddSubmit()">
                                บันทึก </v-btn>
                        </v-card-actions>
                    </v-container>
                </v-form>
            </v-card>
        </v-dialog>

    </div>
</template>
<script>
// import {collection,getDocs} from "firebase/firestore";
export default {
    name: 'App',
    setup() {
    },

    data() {
        return {
            input_update: {
                name: null,
                username: null,
                password: null,
                photo: null,
                photoImage: null,
            },
            input_add: {
                name: null,
                username: null,
                password: null,
                photo: null,
                photoImage: null,
            },
            base64String: null,
            superadmin: null,
            data_id: null,

            detail: false,
            update: false,
            add: false,

            tab: null,
            namephoto: null,
            // iconUser: false,   

            list: [1],
            itemsPerPage: 10,
            currentPage: 1,

            searchData: '',
            rule: [v => v ? true : 'กรุณากรอกข้อมูล'],
            validation: false,

            showDialog: false,
            dialog: {
              type: 'add',
              tab: null,
              add: true,
              detail: false,
              update: false,
              validation: false,

              input_add: {
                data: {
                  name: {
                    label: "ชื่อ-นามสกุล",
                    value: null,
                    rule: [v => v ? true : 'กรุณากรอกข้อมูล'],
                    readonly: false
                  },
                  username: {
                    label: "ชื่อผู้ใช้",
                    value: null,
                    rule: [v => v ? true : 'กรุณากรอกข้อมูล'],
                    readonly: false
                  },
                  password: {
                    label: "รหัสผ่าน",
                    value: null,
                    rule: [v => v ? true : 'กรุณากรอกข้อมูล'],
                    readonly: false
                  },
                },
                image: [
                  {
                    name: "photo",
                    label: "File Input",
                    value: null,
                    rule: [value => {
                      return !value || !value.length || value[0].size < 4000000 || 'ขนาดรูปภาพมากกว่า 4 MB'
                    }],
                    readonly: false
                  },
                  {
                    name: "photoImage",
                    label: null,
                    value: null,
                    rule: null,
                    readonly: false
                  }
                ]
              },
              data_id: {
                data: {
                  id: {
                    label: "รหัส",
                    value: null,
                  },
                  name: {
                    label: "ชื่อ-นามสกุล",
                    value: null,
                  },
                  username: {
                    label: "ชื่อผู้ใช้",
                    value: null,
                  },
                  create_time: {
                    label: "วันที่สร้าง",
                    value: null,
                  },
                  update_time: {
                    label: "วันที่แก้ไข",
                    value: null,
                  },
                },
                image: [
                  {
                    name: "photo",
                    label: "File Input",
                    value: null,
                  },
                  {
                    name: "photoImage",
                    label: null,
                    value: null,
                  }
                ],
              },
              input_update: {
                data: {
                  name: {
                    label: "ชื่อ-นามสกุล",
                    value: null,
                    rule: [v => v ? true : 'กรุณากรอกข้อมูล'],
                    readonly: false
                  },
                  username: {
                    label: "ชื่อผู้ใช้",
                    value: null,
                    rule: [v => v ? true : 'กรุณากรอกข้อมูล'],
                    readonly: false
                  },
                  password: {
                    label: "รหัสผ่าน",
                    value: null,
                    rule: [v => v ? true : 'กรุณากรอกข้อมูล'],
                    readonly: false
                  },
                },
                image: [
                  {
                    name: "photo",
                    label: "File Input",
                    value: null,
                    rule: [value => {
                      return !value || !value.length || value[0].size < 4000000 || 'ขนาดรูปภาพมากกว่า 4 MB'
                    }],
                    readonly: false
                  },
                  {
                    name: "photoImage",
                    label: null,
                    value: null,
                    rule: null,
                    readonly: false
                  }
                ],
              }
            }
        }
    },
    computed: {
        PictureInput,
        totalPages() {
            return this.list != ''
                ? useHandlePage.total_pages(this.list?.length, this.itemsPerPage)
                : ''
            // return Math.ceil(this.list.length / this.itemsPerPage); // 31/10
        },
        superadmin() {
            if (this.searchData != '') {
                return this.superadmin.filter((item) => {
                    const lowerCaseQuery = this.searchData.toLowerCase()
                    return (
                        item.name.toLowerCase().match(lowerCaseQuery) ||
                        item.username.toLowerCase().match(lowerCaseQuery)
                    )
                })
            } else {
                const response = this.list != '' && this.currentPage != ''
                    ? useHandlePage.getdata_pages(this.currentPage, this.itemsPerPage, this.list)
                    : '';
                return this.list.slice(response[0], response[1]); // 0-9 / 10-19
            }
        },

    },
    async created() {
        this.SuperadminDataStore()
    },
    methods: {
        ...mapActions(useSuperAdminStore, ['Getdata', 'GetID', 'Update', 'Add', 'Delete']),

        onShowDialog(type) {
          this.showDialog = true;
          this.dialog.type = type;
        },
        async validate(nameform) {
            const { valid } = await this.$refs[nameform].validate()
            valid ? this.validation = true : this.validation = false
        },
        resetValidation(nameform) {
            this.$refs[nameform].resetValidation()
        },
        async SuperadminDataStore() {
            const SuperadminStore = useSuperAdminStore()
            const response = await this.Getdata(PiniaRoot.token.token)
            typeof response == 'string'
                ? await sweetalert2.warning(response)
                : this.superadmin = SuperadminStore.data, this.list = this.superadmin;
        },
        async SuperadminGetID_PIM(id) {
            const SuperadminStore = useSuperAdminStore()
            this.data_id = await SuperadminStore.$state.data.find(p => p.id == id)
            this.input_update.name = this.data_id.name
            this.input_update.username = this.data_id.username
            this.input_update.photo = this.data_id.photo
            this.input_update.photoImage = this.data_id.photo
            
            // this.input_update.photo = await this.convertBlobToBase64(this.data_id.photo)
        },
        async SuperadminGetID(id) {
            const SuperadminStore = useSuperAdminStore()
            this.data_id = await SuperadminStore.$state.data.find(p => p.id == id)
            this.dialog.data_id.data.id.value = this.data_id.id
            this.dialog.data_id.data.name.value = this.data_id.name
            this.dialog.data_id.data.username.value = this.data_id.username
            this.dialog.data_id.data.create_time.value = this.data_id.create_time
            this.dialog.data_id.data.update_time.value = this.data_id.update_time
            this.dialog.data_id.image[0].value = this.data_id.photo
            this.dialog.data_id.image[1].value = this.data_id.photo

            this.dialog.input_update.data.name.value = this.data_id.name
            this.dialog.input_update.data.username.value = this.data_id.username
            this.dialog.input_update.image[0].value = this.data_id.photo
            this.dialog.input_update.image[1].value = this.data_id.photo
            
        },
        async SuperadminUpdateID(id) {
            const SuperadminStore = useSuperAdminStore()
            this.data_id = await SuperadminStore.$state.data.find(p => p.id == id)
            this.input_update.name = this.data_id.name
            this.input_update.username = this.data_id.username
            // this.input_update.photo = this.data_id.photo
            // this.input_update.photoImage = this.data_id.photo
        },
        async SuperadminUpdateSubmit(id) {
            await this.validate('form_update')
            if (this.validation === true) {
                const SuperadminStore = useSuperAdminStore()
                const DataStore = await SuperadminStore.$state.data.find(p => p.id == id)

                
                let update_data = { name: this.input_update.name, username: this.input_update.username, password: this.input_update.password }
                
                if (this.base64String != null) {
                  this.input_update.photo = this.base64String
                  update_data.photo = this.input_update.photo
                    const response = await this.Update(PiniaRoot.token.token, update_data, id)
                    if (typeof response == 'string') {
                        this.detail = false
                        this.reset("input_update")
                        await sweetalert2.warning(response)
                    } else {
                        await sweetalert2.success('สำเร็จ'),
                        DataStore.name = this.input_update.name
                        DataStore.username = this.input_update.username
                        DataStore.password = this.input_update.password
                        DataStore.photo = this.input_update.photo
                        DataStore.update_time = useHandleDatetime.isoStrToLocalStr(new Date())
                        this.reset("input_update")
                        this.detail = false
                        this.tab = 'one'
                      }
                } else {
                    
                    update_data.photo = this.input_update.photo
                    const response = await this.Update(PiniaRoot.token.token, update_data, id)
                    if (typeof response == 'string') {
                        this.detail = false
                        this.reset("input_update")
                        await sweetalert2.warning(response)
                    } else {
                        await sweetalert2.success('สำเร็จ'),
                        DataStore.name = this.input_update.name,
                        DataStore.username = this.input_update.username,
                        DataStore.password = this.input_update.password,
                        DataStore.photo = this.input_update.photo
                        DataStore.update_time = useHandleDatetime.isoStrToLocalStr(new Date())
                        this.detail = false
                        this.tab = 'one'
                        this.reset("input_update")
                      }
                }
            } else {
                this.detail = true
            }
        },
        async SuperadminAddSubmit_PIM(datas) {
            this.showDialog = false;
            
            this.input_add.photo = this.base64String;
            const response = await this.Add(PiniaRoot.token.token, this.input_add);
            if (typeof response == 'string') {
                this.add = false
                this.reset("input_add")
                await sweetalert2.warning(response)
            } else {
                this.add = false
                this.reset("input_add")
                await sweetalert2.success('สำเร็จ')
            }
        },
        async SuperadminAddSubmit(datas) {
            
            this.input_add.name = datas.data.name.value
            this.input_add.username = datas.data.username.value
            this.input_add.password = datas.data.password.value
            this.input_add.photo = datas.image[1].value
            delete this.input_add.photoImage
            
            const response = await this.Add(PiniaRoot.token.token, this.input_add);
            if (typeof response == 'string') {
                this.showDialog = false;
                this.reset("input_add")
                await sweetalert2.warning(response)
            } else {
                this.showDialog = false;
                this.reset("input_add")
                await sweetalert2.success('สำเร็จ')
            }
        },
        async SuperadminDelete(id, name, username) {
            const dataUser = (name != null && username != null)
                ? 'Id : ' + id + '<br> Name : ' + name + '<br> Username : ' + username
                : 'Id : ' + id + '<br> Name : ' + this.data_id.name + '<br> Username : ' + this.data_id.username
            sweetalert2.Delete('Do you want to delete?', dataUser, id, async res => {
                if (res[0].isConfirmed == true) {
                    const SuperadminStore = useSuperAdminStore()
                    this.superadmin = SuperadminStore.$state.data.filter((Delete) => Delete.id != id);
                    SuperadminStore.$state.data = this.superadmin
                    const response = await this.Delete(PiniaRoot.token.token, id);
                    typeof response == 'string'
                        ? await sweetalert2.warning(response)
                        : sweetalert2.success('Delete!');
                }
            })
        },
        async reset(nameinput) {
            this.showDialog = false;
            // nameinput == "input_update"
            //   ? Object.assign(this.$data.input_update, this.$options.data().input_update)
            //   : Object.assign(this.$data.input_add, this.$options.data().input_add);
            nameinput == "dialog.input_add"
              ? Object.assign(this.$data.dialog.input_add, this.$options.data().dialog.input_add)
              : Object.assign(this.$data.dialog.input_update, this.$options.data().dialog.input_update);
        },
        async readURL(name, event) {        
          const read = await useHandlePhoto.readURL(event)
          this.namephoto = read.namephoto 
          this.base64String = read.base64String 
          name == 'Add'
          ?  this.input_add.photoImage = read.photoImage
          : this.input_update.photoImage = read.photoImage 
        },
    },
    watch: {
    },
}
</script>
<style>
.size-btn {
    width: 20px;
    height: 200px;
    background-color: blueviolet;
}

html {
    scroll-behavior: smooth !important;
}
</style>