<template>
    <!-- NOTE details -->
    <v-card class="rounded-xl ">
        <v-toolbar color="indigo" class="text-h5" :title="tab == 'one' ? 'รายละเอียด' : 'แก้ไข'">
            <!-- <div>{{Company}}</div> -->
            <div>{{ DataID }}</div>
            <v-btn icon dark @click="Out('input-update'), tab = 'one'"><v-icon>mdi-close</v-icon>
            </v-btn>
        </v-toolbar>
        <!-- NOTE Tabs Button All in Dialog-->
        <v-sheet >
            <v-tabs v-model="tab">
                <v-tab value="one" color="indigo-accent-4" @click="GetID(Dataid.id), Outupdate('form_update')">
                    <v-icon start>mdi-text-box-search-outline</v-icon>รายละเอียด</v-tab>
                <v-tab value="two" color="indigo-accent-4">
                    <v-icon start>mdi-border-color</v-icon>แก้ไข</v-tab>
                <v-tab color="indigo-accent-4" @click="Delete(Dataid.id)">
                    <v-icon start>mdi-delete-outline</v-icon>ลบ</v-tab>
            </v-tabs>
        </v-sheet>

        <v-container class="overflow-y-auto">
            <v-window v-model="tab" v-if="Dataid">

                <!-- NOTE detail-->
                <v-window-item value="one">
                    <v-sheet>
                        <v-col col="12" class="d-lg-flex pa-0">
                            <v-col no-gutters lg="5" class="lg:w-56 pa-0 d-lg-flex justify-center align-center">
                                <v-sheet class="text-center space-y-5">
                                    <v-avatar v-if="Dataid.photo != null" rounded-full size="200"
                                        :image="Dataid.photo"></v-avatar>
                                    <v-avatar v-else rounded-full size="200" color="grey-lighten-3">
                                        <v-icon color="grey-darken-3" icon="mdi mdi-account" size="100"></v-icon>
                                    </v-avatar>
                                </v-sheet>
                            </v-col>

                            <v-row no-gutters cols="12" lg="6">
                                <v-col cols="12" lg="4" class="pa-0 pb-4 pr-lg-4 space-y-1">
                                    <div class="text-h7">รหัส</div>
                                    <v-text-field readonly>
                                        <p>{{ Dataid.id }}</p>
                                    </v-text-field>
                                </v-col>

                                <v-col cols="12" lg="8" class="pa-0 pb-4 space-y-1">
                                    <div class="text-h7">ชื่อ-นามสกุล</div>
                                    <v-text-field readonly>
                                        <p>{{ Dataid.name }}</p>
                                    </v-text-field>
                                </v-col>

                                <v-col cols="12" class="pa-0 pb-4 space-y-1">
                                    <div class="text-h7">ชื่อผู้ใช้</div>
                                    <v-text-field readonly>
                                        <p>{{ Dataid.username }}</p>
                                    </v-text-field>
                                </v-col>

                                <v-col v-if="Company" cols="12" class="pa-0 pb-4 space-y-1">
                                    <div class="text-h7">สำนักงาน</div>
                                    <v-text-field readonly>
                                        <p>{{ Company.name }}</p>
                                    </v-text-field>
                                </v-col>

                                <v-col v-if="Personnel" cols="12" class="pa-0 pb-4 space-y-1">
                                    <div class="text-h7">แผนก กองงาน</div>
                                    <v-text-field readonly>
                                        <p>{{ Personnel.topic }}</p>
                                    </v-text-field>
                                </v-col>

                                <v-col cols="12" lg="6" class="pa-0 pb-4 pr-lg-4 space-y-1">
                                    <div class="text-h7">วันที่สร้าง</div>
                                    <v-text-field readonly>
                                        <p>{{ Dataid.create_time }}</p>
                                    </v-text-field>
                                </v-col>

                                <v-col cols="12" lg="6" class="pa-0 pb-4 space-y-1">
                                    <div class="text-h7">วันที่อัปเดต</div>
                                    <v-text-field readonly>
                                        <p>{{ Dataid.update_time }}</p>
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
                            <v-col col="12" class="d-lg-flex pa-0 mt-6">
                                <v-col no-gutters lg="5" class="xl:w-56 pa-0 d-lg-flex justify-center align-center">
                                    <v-sheet class="text-center space-y-5">
                                        <v-avatar v-if="update_photoImage !== null" rounded-full size="200"
                                            :image="update_photoImage"></v-avatar>
                                        <v-avatar v-else rounded-full size="200" color="grey-lighten-3">
                                            <v-icon color="grey-darken-3" icon="mdi mdi-account" size="100"></v-icon>
                                        </v-avatar>

                                        <v-file-input class="xl:w-56" label="File input" variant="underlined"
                                            prepend-icon="mdi-camera" type='file' :show-size="1000" :clearable="false"
                                            @change="ReadURL('Update', $event)" v-model="input_update.photo" required>
                                        </v-file-input>

                                    </v-sheet>
                                </v-col>
                                <v-row no-gutters cols="12" lg="6">
                                    <!-- <v-col cols="12" lg="4" class="pa-0 pb-4 pr-lg-4 space-y-1">
                                        <v-sheet class="text-h7">รหัส</v-sheet>
                                        <v-text-field readonly v-model="Dataid.id">
                                        </v-text-field>
                                    </v-col> -->

                                    <v-col cols="12" lg="6" class="pa-0 pb-4 pr-2 space-y-1">
                                        <v-sheet class="text-h7">ชื่อ-นามสกุล</v-sheet>
                                        <v-text-field :rules="rule" placeholder="name" v-model="input_update.name">
                                        </v-text-field>
                                    </v-col>

                                    <v-col cols="12" lg="6" class="pa-0 pb-4 pl-2 space-y-1">
                                        <v-sheet class="text-h7">ชื่อผู้ใช้</v-sheet>
                                        <v-text-field :rules="rule" placeholder="username" v-model="input_update.username">
                                        </v-text-field>
                                    </v-col>

                                    <v-col cols="12" class="pa-0 pb-4 space-y-1">
                                        <v-sheet class="text-h7">รหัสผ่าน</v-sheet>
                                        <v-text-field :rules="rule" placeholder="password" v-model="input_update.password">
                                        </v-text-field>
                                    </v-col>

                                    <!-- <v-col v-if="Company" cols="12" class="pa-0 pb-4 space-y-1">
                                        <div class="text-h7">สำนักงาน</div>
                                        <v-text-field readonly>
                                            <p>{{ Company.name }}</p>
                                        </v-text-field>
                                    </v-col> -->

                                    <v-col v-if="PersonnelList" cols="12" class="pa-0 pb-4 space-y-1">
                                        <div class="text-h7">แผนก กองงาน</div>
                                        <v-select v-bind="props" placeholder="Select Personnel" required
                                            v-model="input_update.list_personnel_id" :items="PersonnelList" item-title="topic"
                                            item-value="id">
                                        </v-select>
                                    </v-col>

                                    <!-- <v-col cols="12" lg="6" class="pa-0 pb-4 pr-lg-4 space-y-1">
                                        <v-sheet class="text-h7">วันที่สร้าง</v-sheet>
                                        <v-text-field readonly>{{ Dataid.create_time }}
                                        </v-text-field>
                                    </v-col>

                                    <v-col cols="12" lg="6" class="pa-0 pb-4 space-y-1">
                                        <v-sheet class="text-h7">วันที่อัปเดต</v-sheet>
                                        <v-text-field readonly>{{ Dataid.update_time }}
                                        </v-text-field>
                                    </v-col> -->
                                </v-row>
                            </v-col>
                        </v-sheet>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn type="submit" prepend-icon="mdi-check" variant="tonal" color="#5865f2"
                                @click="Update(Dataid.id), dialog = false">
                                บันทึก </v-btn>
                        </v-card-actions>
                        
                    </v-window-item>
                </v-form>
            </v-window>
        </v-container>
    </v-card>
</template>

<script>
export default {
    props: {
        Dataid: Object,
        Company: String,
        Personnel: String,
        PersonnelList: Object,
    },

    data() {
        return {
            input_update: {
                name: null,
                username: null,
                password: null,
                photo: null,
                ...(this.Company != null ? { company_id: this.Company.id } : {}),
                ...(this.Personnel != null ? { list_personnel_id: this.Personnel.id } : {}),
            },
            tab: null,
            update_photoImage: null,
            base64String: null,
            Text: null,
        }
    },
    computed: {
        update_photoImage(){
            
        }
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
        async Delete(id) {
            this.$emit('delete', id)
        },
        async Update(id) {
            
            this.$emit('update', id)
        },
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
    },
}
</script>