<script setup>
import sweetalert2 from '@/assets/js/controller/switchalert'
import { mapActions } from 'pinia'
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useAdminStore, useCompanyStore, PiniaRoot } from '@/stores/'
import PictureInput from 'vue-picture-input'
import useHandlePage from '@/utils/handlePage'
import List from '@/components/List.vue'
import DialogDetail from '@/components/Dialog-Detail.vue'
import DialogAdd from '@/components/Dialog-Add.vue'



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
    <div class="p-5 space-y-5 w-full h-full" id="social">
        <h1 class="text-3xl">user admin</h1>

        <!-- NOTE search & btn add new -->
        <div class="flex justify-between">
            <v-card class="rounded-pill" elevation="1" width="50%">
                <v-text-field v-model="searchData" density="compact" variant="solo" label="Search your Name"
                    append-inner-icon="mdi-magnify" single-line hide-details>
                </v-text-field>
            </v-card>

            <v-btn color="" @click="add = true">Add New</v-btn>
        </div>

        <v-row no-gutters>
            <List v-for="(item, index) in admin" v-bind="item" :key="index" v-on:getid="AdminGetID"
                v-on:delete="AdminDelete"></List>
        </v-row>

        <v-dialog class="z-0 " v-model="detail" width="1024" persistent>
            <DialogDetail :Dataid="data_id" :Company="company_update" v-on:getid="AdminGetID" v-on:delete="AdminDelete"
                v-on:out="reset" v-on:outupdate="resetValidation"></DialogDetail>
        </v-dialog>

        <v-dialog class="z-0 " v-model="add" width="1024" persistent>
            <DialogAdd v-on:out="reset" v-on:read-url="readURL" v-on:add="AdminAddSubmit" :CompanyList="company_id_name">
            </DialogAdd>
        </v-dialog>

        <v-pagination v-if="searchData == ''" class="page" v-model="currentPage" :length="totalPages"></v-pagination>

    </div>
</template>
<script>
export default {

    name: 'App',
    setup() {
    },
    computed: {
        PictureInput
    },
    data() {
        return {
            input_update: {
                name: null,
                username: null,
                password: null,
                photo: null,
                company: null,
            },
            input_add: {
                name: null,
                username: null,
                password: null,
                photo: null,
                company: null,
            },
            base64String: null,
            admin: [],
            data_id: null,

            company_update: [],
            company_id_name: [],

            detail: false,
            update: false,
            add: false,

            tab: null,

            list: [1],
            itemsPerPage: 10,
            currentPage: 1,

            searchData: '',
        }
    },
    computed: {
        PictureInput,
        totalPages() {
            return this.list != ''
                ? useHandlePage.total_pages(this.list?.length, this.itemsPerPage)
                : ''
        },
        admin() {
            if (this.searchData != '') {
                return this.admin.filter((item) => {
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
        companyNames() {
            return this.company_id_name.map((item) => item.name);
        },
    },
    async created() {
        this.AdminDataStore()

    },
    methods: {
        ...mapActions(useAdminStore, ['Getdata', 'Update', 'Add', 'Delete']),
        ...mapActions(useCompanyStore, ['Getdata', 'Company_ID_Name']),
        async AdminDataStore() {
            const AdminStore = useAdminStore()
            const CompanyStore = useCompanyStore()

            await AdminStore.Getdata(PiniaRoot.token.token)
            await CompanyStore.Getdata(PiniaRoot.token.token)
            this.admin = AdminStore.data
            this.list = this.admin
            // this.company = CompanyStore.data
            this.company_id_name = CompanyStore.company

        },
        async AdminGetID(id) {
            const AdminStore = useAdminStore()
            const CompanyStore = useCompanyStore()
            this.data_id = await AdminStore.$state.data.find(p => p.id == id)
            this.input_update.name = this.data_id.name
            this.input_update.username = this.data_id.username
            this.input_update.photo = this.data_id.photo
            this.company_update = await CompanyStore.Company_ID_Name(this.data_id.company_id)
            this.detail = true

        },
        async AdminUpdateID(id) {
            const AdminStore = useAdminStore()
            this.data_id = await AdminStore.$state.data.find(p => p.id == id)
            this.input_update.name = this.data_id.name
            this.input_update.username = this.data_id.username
        },
        async AdminUpdateSubmit(id) {
            const AdminStore = useAdminStore()
            const DataStore = await AdminStore.$state.data.find(p => p.id == id)
            this.data_id = await AdminStore.$state.data.find(p => p.id == id)
            if ((!this.input_update.name || !this.input_update.username || !this.input_update.password || !this.input_add.company)) {
                if (!this.input_update.name) {
                    alert('No name')
                }
                else if (!this.input_update.username) {
                    alert('No username')
                }
                else if (!this.input_update.password) {
                    alert('No password')
                }
                else if (!this.input_update.company) {
                    alert('No company')
                }
                else {
                    alert("Not have value");
                }
            }
            else {
                DataStore.name = this.input_update.name;
                DataStore.username = this.input_update.username;
                DataStore.password = this.input_update.password;
                if (this.base64String != null) {
                    this.input_update.photo = this.base64String
                    DataStore.photo = this.input_update.photo
                    const response = await this.Update(PiniaRoot.token.token, DataStore, id)
                    if (response.status == 200) {
                        return await sweetalert2.success('สำเร็จ'), this.update = false, this.detail = false, this.reset("input_update");
                    } else if (response.status == 422) {
                        return await sweetalert2.info(response.error), this.update = false, this.detail = false;
                    } else {
                        return alert('No')
                    }
                } else {
                    DataStore.photo = this.input_update.photo
                    const response = await this.Update(PiniaRoot.token.token, DataStore, id)
                    if (response.status == 200) {
                        return await sweetalert2.success('สำเร็จ'), this.update = false, this.detail = false,
                            this.reset("input_update");
                    } else if (response.status == 422) {
                        return await sweetalert2.info(response.error), this.update = false, this.detail = false;
                    } else {
                        return alert('No')
                    }
                }
            }
        },
        async AdminAddSubmit(datainput) {
            const response = await this.Add(PiniaRoot.token.token, datainput);

            typeof response == 'string'
                ? await sweetalert2.warning(response)
                : await sweetalert2.success('สำเร็จ'), this.add = false,
                this.reset("input_add");
            this.AdminDataStore()
        },
        async AdminDelete(id, name, username) {
            const dataUser = (name != null && username != null)
                ? 'Id : ' + id + '<br> Name : ' + name + '<br> Username : ' + username
                : 'Id : ' + id + '<br> Name : ' + this.data_id.name + '<br> Username : ' + this.data_id.username
            sweetalert2.Delete('Do you want to delete?', dataUser, id, async res => {
                if (res[0].isConfirmed == true) {
                    const AdminStore = useAdminStore()
                    this.admin = AdminStore.$state.data.filter((Delete) => Delete.id != id);
                    AdminStore.$state.data = this.admin
                    const response = await this.Delete(PiniaRoot.token.token, id);
                    return response == false
                        ? alert("No")
                        : sweetalert2.success('Delete!');
                }
            })
        },

        async reset(nameinput) {
            this.detail = false
            this.add = false
            
            nameinput == "input-update"
                ? Object.assign(this.$data.input_update, this.$options.data().input_update)
                : Object.assign(this.$data.input_add, this.$options.data().input_add);
        },


        async validate(nameform) {
            const { valid } = await this.$refs[nameform].validate()
            valid ? this.validation = true : this.validation = false
        },
        async resetValidation(nameform) {
            this.$refs[nameform].resetValidation()
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