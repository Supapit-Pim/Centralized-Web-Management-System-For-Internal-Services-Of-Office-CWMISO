<script setup>
import { mapActions } from 'pinia'
import { useListServiceStore, PiniaRoot } from '@/stores/'
</script>

<template>
  <div class="p-5 space-y-5 w-full h-full">
    <h1 class="text-3xl">รายการให้บริการ</h1>

    <v-row class="d-flex justify-end ma-2">
      <v-btn color="deep-purple" @click="onShowDialog('add', 1)" v-bind="props"><v-icon start>mdi
          mdi-plus</v-icon>เพิ่มรายการให้บริการ
      </v-btn>
    </v-row>

    <v-dialog class="z-0" v-model="showDialog" width="1024" persistent>
      <Dialog :dialog="dialog" v-on:out="reset" v-on:add="ListCompanyAddSubmit" v-on:update="ListCompanyUpdateSubmit">
      </Dialog>
    </v-dialog>

    <v-row no-gutters>
      <v-col v-for="data in flatData" :key="data.id" cols="12">
        <v-card v-if="data.root == null" class="pa-4 ma-2 rounded-xl" elevation="2" :color="getBackgroundColor(data)">
          <v-row no-gutters>
            <v-col class="space-x-5 d-flex align-center justify-center " sm="6">
              <v-span>
                <!-- <v-span class="text-xs text-sm-caption text-md-body-2">หัวข้อ </v-span><br> -->
                <!-- <v-span class="text-xs text-sm-caption text-md-body-2">ชื่อสำนักงาน</v-span> -->
              </v-span>
              <v-span>
                <v-span class="text-xs text-sm-caption text-md-body-2">{{ data.topic }}</v-span><br>
              </v-span>
            </v-col>

            <v-col cols=" d-flex align-center justify-center text-center " sm="6">
              <v-span>
                <v-btn color="blue-accent-3" class="mr-1" size="40" icon=""
                  @click="onShowDialog('detail'), ListCompanyGetID(data.id)" v-bind="props">
                  <v-icon icon="mdi mdi-text-box-edit"></v-icon>
                  <v-tooltip activator="parent" location="bottom">รายละเอียด</v-tooltip>
                </v-btn>
                <v-btn color="deep-purple" class="mr-1" size="40" icon=""
                  @click="onShowDialog('add', data.level + 1, data.id)" v-bind="props">
                  <v-icon icon="mdi mdi-plus-circle"></v-icon>
                </v-btn>
                <v-btn color="red" class="mr-1" size="40" icon="" v-bind="props">
                  <v-icon icon="mdi-delete-outline"></v-icon>
                </v-btn>
              </v-span>
            </v-col>
          </v-row><br>

          <span v-if="hasChildren(data)">
            <v-row justify="center">
              <v-icon :icon="data.showArrow ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                @click="Show1(data.id), data.showArrow = !data.showArrow"></v-icon>
            </v-row>
          </span>
          <span v-else></span>
        </v-card>

        <div v-for="(Level, index) in AddLevel" :key="index" cols="12">
          <v-card v-if="data.root == Level" class="pa-4 ma-2 rounded-xl" elevation="1" :color="getBackgroundColor(data)">
            <v-row no-gutters>
              <v-col class="space-x-5 d-flex align-center justify-center " sm="6">
                <v-span>
                  <!-- <v-span class="text-xs text-sm-caption text-md-body-2">ชื่อ</v-span><br> -->
                </v-span>
                <v-span>
                  <v-span class="text-xs text-sm-caption text-md-body-2">{{ data.topic }}</v-span><br>
                </v-span>
              </v-col>
              <v-col cols=" d-flex align-center justify-center text-center " sm="6">
                <v-span>
                  <v-btn color="blue-accent-3" class="mr-1" size="40" icon=""
                    @click="onShowDialog('detail'), ListCompanyGetID(data.id)" v-bind="props">
                    <v-icon icon="mdi mdi-text-box-edit"></v-icon>
                    <v-tooltip activator="parent" location="bottom">รายละเอียด</v-tooltip>
                  </v-btn>
                  <v-btn color="deep-purple" class="mr-1" size="40" icon=""
                    @click="onShowDialog('add', data.level + 1, data.id)" v-bind="props">
                    <v-icon icon="mdi mdi-plus-circle"></v-icon>
                  </v-btn>
                  <v-btn color="red" class="mr-1" size="40" icon="" v-bind="props">
                    <v-icon icon="mdi-delete-outline"></v-icon>
                  </v-btn>
                </v-span>
              </v-col>
            </v-row><br>
            <span v-if="hasChildren(data)">
              <v-row justify="center">
                <v-icon :icon="data.showArrow ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                  @click="Show1(data.id), data.showArrow = !data.showArrow"></v-icon>
              </v-row>
            </span>
            <span v-else></span>
          </v-card>
        </div>
      </v-col>

    </v-row>

  </div>
</template>
<script>
export default {
  setup() { },
  data() {
    return {
      view_bin: false,

      list_service: null,
      list_service_id: null,
      AddLevel: [],
      showChildren: false,

      showDialog: false,
    }
  },
  computed: {
    flatData() {
      if (this.list_service?.length > 0) {
        
        const hierarchicalData = this.buildHierarchy(this.list_service, null);
        const flatData = this.flattenHierarchy(hierarchicalData);
        flatData.forEach((item) => {
          item.showArrow = false; // เพิ่มคุณสมบัติ showArrow เป็นเริ่มต้นที่ false
        });
        return flatData;
      } else {
        const flatData = []
        return flatData;
      }
    },
  },
  async created() {
    this.ListServiceDataStore()
  },

  methods: {
    ...mapActions(useListServiceStore, ['Get_ListService_A']),
    async ListServiceDataStore() {
      const ListServiceStore = useListServiceStore()

      this.list_service = { loading: true }
      const response = await this.Get_ListService_A(PiniaRoot.token.token)
      typeof response != 'string'
        ? ''
        : await sweetalert2.warning(response);
      this.list_service = ListServiceStore.$state.data
    },
    buildHierarchy(data, root) {
      const hierarchy = [];
      data.forEach((item) => {
        if (item.root === root) {
          const children = this.buildHierarchy(data, item.id);
          if (children?.length > 0) {
            item.children = children;
          }
          hierarchy.push(item);
        }
      });
      
      return hierarchy;
    },
    flattenHierarchy(hierarchy) {
      const flatData = [];
      hierarchy.forEach((item) => {
        flatData.push(item);
        if (item.children) {
          flatData.push(...this.flattenHierarchy(item.children));
        }
      });
      return flatData;
    },

    getBackgroundColor(data) {
      // Define color mappings for different levels
      const levelColors = {
        1: 'rgb(255 255 255)',
        2: 'rgb(245, 245, 220)',
        3: 'rgb(245, 232, 219)',
        4: 'rgb(245, 219, 219)',
        5: 'rgb(255 255 255)',
        6: 'rgb(245, 245, 220)',
        7: 'rgb(245, 232, 219)',
        8: 'rgb(245, 219, 219)',
      };

      // Get the color based on the data's level
      return levelColors[data.level] || 'transparent';
    },
    async onShowDialog(type, level, root) {
      this.showDialog = true
      this.dialog.type = type
      if (type == 'add') {
        this.dialog.input_add.level = level
        if (level == 1) {
          this.dialog.input_add.root = []
        } else if (level > 1) {
          this.dialog.input_add.root = root
        }
      }

    },
    async ListCompanyGetID(id) {
      //getid
      const ListCompanyStore = useListCompanyStore()
      if (ListCompanyStore.data == null) {
        this.list_company_id = { loading: true }
        const response = await this.Get_ListCompany(PiniaRoot.token.token)
        if (typeof response == 'string') {
          await sweetalert2.warning(response)
        }
      }
      this.list_company_id = await ListCompanyStore.$state.data.find(p => p.id == id)
      if (!this.list_company_id) {
        this.list_company_id = { loading: true }
        const response = await this.Get_ListCompany_ID(PiniaRoot.token.token, id)
        if (typeof response == 'string') {
          await sweetalert2.warning(response)
        }
        this.list_company_id = ListCompanyStore.data_id
      }
      this.dialog.data_id.id = id
      for (const key in this.list_company_id) {
        if (this.dialog.data_id.data[key] !== undefined) {
          this.dialog.data_id.data[key] = this.list_company_id[key]
        }
        if (this.dialog.input_update.data[key] !== undefined) {
          this.dialog.input_update.data[key] = this.list_company_id[key]
        }
      }
    },
    hasChildren(item) {
      
      return item.children && item.children?.length > 0;
    },
    Show1(id) {
      let a = 0
      for (let i = 0; i < this.AddLevel?.length; i++) {
        if (this.AddLevel[i] == id) {
          this.Delete(i)
          a = 1
        }
      }
      if (a == 0) {
        this.AddLevel.push(id)
      }
    },
    Delete(index) {
      this.AddLevel.splice(index);
    },
    async onShowDialog(type, level, root) {
      this.showDialog = true
      this.dialog.type = type
      if (type == 'add') {
        this.dialog.input_add.level = level
        if (level == 1) {
          this.dialog.input_add.root = []
        } else if (level > 1) {
          this.dialog.input_add.root = root
        }
      }
    },
  }
}
</script>
<style>
html {
  scroll-behavior: smooth !important;
}
</style>
