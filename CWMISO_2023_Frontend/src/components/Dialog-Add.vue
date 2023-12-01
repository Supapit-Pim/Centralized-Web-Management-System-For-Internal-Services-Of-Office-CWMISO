<template>
    <v-card class="rounded-xl">
        <!-- <v-overlay> -->
        <v-toolbar dense color="primary" class="text-h5 " title="เพิ่มข้อมูล">
            <v-btn icon dark @click="Out('input-add')"><v-icon>mdi-close</v-icon>
            </v-btn>
        </v-toolbar>
        <!-- </v-overlay> -->

        <v-form @submit.prevent ref="form_add" class="overflow-y-auto">
            <v-container>

                <v-sheet>
                    <v-col col="12" class="d-lg-flex pa-0 mt-6">
                        <v-col no-gutters lg="5" class="lg:w-56 pa-0 d-lg-flex justify-center align-center">
                            <v-sheet class="text-center space-y-5">
                                <v-avatar v-if="add_photoImage != null" rounded-full size="200"
                                    :image="add_photoImage"></v-avatar>
                                <v-avatar v-else rounded-full size="200" color="grey-lighten-3">
                                    <v-icon color="grey-darken-3" icon="mdi mdi-account" size="100"></v-icon>
                                </v-avatar>

                                <v-file-input class="xl:w-56" label="File input" variant="underlined"
                                    prepend-icon="mdi-camera" type='file' :show-size="1000" :rules="rule" :clearable="false"
                                    @change="ReadURL('Add', $event)" required>
                                </v-file-input>
                            </v-sheet>
                        </v-col>

                        <v-row no-gutters cols="12" lg="6" class="align-center flex">
                            <v-col cols="12" lg="6" class="pa-0 pb-4 pr-2 space-y-1">
                                <div class="text-h7">ชื่อ-นามสกุล</div>
                                <v-text-field :rules="rule" v-model="input_add.name"></v-text-field>
                            </v-col>

                            <v-col cols="12" lg="6" class="pa-0 pb-4 pl-2 space-y-1">
                                <div class="text-h7">ชื่อผู้ใช้</div>
                                <v-text-field :rules="rule" v-model="input_add.username"></v-text-field>
                            </v-col>

                            <v-col cols="12" class="pa-0 space-y-1">
                                <div class="text-h7">รหัสผ่าน</div>
                                <v-text-field :rules="rule" v-model="input_add.password"></v-text-field>
                            </v-col>

                            <v-col v-if="CompanyList" cols="12" class="pa-0 space-y-1">
                                <div class="text-h7">สำนักงาน</div>
                                <v-select v-bind="props" placeholder="Select Company" required
                                    v-model="input_add.company_id" :items="CompanyList" item-title="name" item-value="id">
                                </v-select>
                            </v-col>

                            <v-col v-if="NewPersonnelList && input_add.company_id" cols="12" class="pa-0 space-y-1">
                                <div class="text-h7">แผนก กองงาน</div>
                                <v-select v-bind="props" placeholder="Select Personnel" required
                                    v-model="input_add.list_personnel_id" :items="NewPersonnelList" item-title="topic"
                                    item-value="id">
                                </v-select>
                            </v-col>

                        </v-row>
                    </v-col>
                </v-sheet>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn type="submit" prepend-icon="mdi-check" variant="tonal" color="#5865f2" @click="Add()">
                        บันทึก </v-btn>
                </v-card-actions>
            </v-container>
        </v-form>
    </v-card>
</template>

<script>
import { useListPersonnelStore, PiniaRoot } from '@/stores/'
import useHandlePhoto from '@/utils/handlePhoto'

export default {
    props: {
        Dataid: Object,
        CompanyList: String,
        PersonnelList: String,
        DialogAdd: Object,
    },
    data() {
        return {
            input_add: {
                name: null,
                username: null,
                password: null,
                photo: null,
                ...(this.CompanyList != null ? { company_id: null } : {}),
                ...(this.PersonnelList != null ? { list_personnel_id: null } : {}),
            },
            add_photoImage: null,
            base64String: null,
            NewPersonnelList: null,
            // update_photoImage: null,
        }
    },
    computed: {
        companyNames() {
            return this.company.map((item) => item.name);
            // return this.company;
        },
    },
    watch: {
        // TODO : rese list_personnel_id หาก value เปลี่ยน 
        'input_add.company_id': async function () {
            const ListPersonnelStore = useListPersonnelStore()
            this.NewPersonnelList = await ListPersonnelStore.ListPersonnel_By_Company(this.input_add.company_id)
        },
        async DialogAdd(){
      
            this.DialogAdd
        },
    },

    methods: {
        async Out(key) {
            this.$emit('out', key)
        },
        async Outupdate(key) {
            this.$emit('outupdate', key)
        },
        async GetID(id) {
            this.$emit('getid', id)
        },
        async Add() {
      
            this.$emit('add', this.input_add)
        },
        async Delete(id) {
            this.$emit('delete', id)
        },
        // async Data_PersonnelVue(id) {
        //     this.$emit('personnelVue', id)
        // },
        async ReadURL(name, event) {
            const file = await event.target.files[0]
            if (file) {
                const maxSizeInBytes = 4 * 1024 * 1024; // 4 MB in bytes
                if (file.size <= maxSizeInBytes) {
                    this.namephoto = file.name;
                    this.base64String = await this.readFileAsBase64(file);
                    this.input_add.photo = this.base64String;
                    name == "Add"
                        ? this.add_photoImage = URL.createObjectURL(file)
                        : this.update_photoImage = URL.createObjectURL(file)
                } else {
                    alert("File size > 4 MG");
                    this.namephoto = null;
                }
            }
        },
        async readFileAsBase64(file) {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => {
                    // resolve(reader.result.split(',')[1]);
                    resolve(reader.result);
                };
                reader.readAsDataURL(file);
            });
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