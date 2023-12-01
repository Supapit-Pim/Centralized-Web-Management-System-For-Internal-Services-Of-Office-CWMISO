import { createRouter, createWebHistory } from 'vue-router'
import LoingView from '@/views/LoginView.vue'

import Usejoin from '@/views/All/Usejoin.vue'

import SuperadminDashboard from '@/views/Superadmin/Dashboard.vue'
import Superadmin from '@/views/Superadmin/Superadmin.vue'
import TypeAll from '@/views/Superadmin/Type_All.vue'
import TotalType from '@/views/Superadmin/Total_Type.vue'
import TypeForm from '@/views/Superadmin/Type_Form.vue'
import TypeCompany from '@/views/Superadmin/Type_Company.vue'
import TypeSocial from '@/views/Superadmin/Type_Social.vue'
import Company from '@/views/Superadmin/Company.vue'
import SuperadminSetting from '@/views/Superadmin/Setting.vue'
import SuperadminBackup from '@/views/Superadmin/Backup.vue'

import AdminDashboard from '@/views/Admin/Dashboard.vue'
import AdminListPersonnel from '@/views/Admin/List_Personnel.vue'
import AdminDataPersonnel from '@/views/Admin/Data_Personnel.vue'
import AdminUser from '@/views/Admin/User.vue'
import AdminListService from '@/views/Admin/List_Service.vue'
import AdminCreateForm from '@/views/Admin/Create_Form.vue'
import AdminDataForm from '@/views/Admin/Data_Form.vue'
import AdminListCompany from '@/views/Admin/List_Company.vue'
import AdminStatusSocial from '@/views/Admin/Status_Social.vue'
import AdminStatusCompany from '@/views/Admin/Status_Company.vue'
import AdminSetting from '@/views/Admin/Setting.vue'

// import Admin from '@/views/Admin/Admin.vue'
// import AdminTest from '@/views/Admin/AdminTest.vue'

import UserDashboard from '@/views/User/Dashboard.vue'
import UserListUpload from '@/views/User/List_Upload.vue'
import UserStatusUpload from '@/views/User/Status_Upload.vue'
import UserSetting from '@/views/User/Setting.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoingView
    },

    // Superadmin
    {
      path: '/superadmin/dashboard',
      name: 'SuperadminDashboard',
      meta: [{ title: 'แดชบอร์ด', disabled: false }],
      component: SuperadminDashboard
    },
    {
      path: '/superadmin/typeall',
      name: 'TypeAll',
      component: TypeAll
    },
    {
      path: '/superadmin/totaltype',
      name: 'TotalType',
      meta: [{ title: 'ประเภททั้งหมด', disabled: false }],
      component: TotalType
    },
    {
      path: '/superadmin/typeform',
      name: 'TypeForm',
      component: TypeForm
    },
    {
      path: '/superadmin/typesocial',
      name: 'TypeSocial',
      component: TypeSocial
    },
    {
      path: '/superadmin/typecompany',
      name: 'TypeCompany',
      component: TypeCompany
    },
    {
      path: '/superadmin/company',
      name: 'Company',
      meta: [{ title: 'สำนักงานทั้งหมด', disabled: false }],
      component: Company
    },
    {
      path: '/superadmin/superadmin',
      name: 'Superadmin',
      meta: [{ title: 'ผู้พัฒนาระบบ', disabled: false }],
      component: Superadmin
    },
    {
      path: '/superadmin/setting',
      name: 'SuperadminSetting',
      meta: [{ title: 'การตั้งค่าโปรไฟล์', disabled: false }],
      component: SuperadminSetting
    },
    {
      path: '/superadmin/backup/:name',
      name: 'SuperadminBackup',
      component: SuperadminBackup
    },

    // Admin
    {
      path: '/admin/dashboard',
      name: 'AdminDashboard',
      meta: [{ title: 'แดชบอร์ด', disabled: false }],
      component: AdminDashboard
    },
    {
      path: '/admin/listpersonnel',
      name: 'AdminListPersonnel',
      meta: [{ title: 'รายการบุคลากร', disabled: false }],
      component: AdminListPersonnel
    },
    {
      path: '/admin/datapersonnel',
      name: 'AdminDataPersonnel',
      meta: [
        { title: 'รายการบุคลากร', disabled: false, href: '/admin/listpersonnel' },
        { title: 'บุคลากร', disabled: false }
      ],
      component: AdminDataPersonnel
    },
    {
      path: '/admin/user',
      name: 'AdminUser',
      meta: [
        { title: 'รายการบุคลากร', disabled: false, href: '/admin/listpersonnel' },
        { title: 'ผู้ใช้งาน', disabled: false }
      ],
      component: AdminUser
    },
    {
      path: '/admin/listservice',
      name: 'AdminListService',
      meta: [{ title: 'รายการให้บริการ', disabled: false }],
      component: AdminListService
    },
    {
      path: '/admin/createform',
      name: 'AdminCreateForm',
      meta: [{ title: 'สร้างแบบฟอร์ม', disabled: false }],
      component: AdminCreateForm
    },
    {
      path: '/admin/data/form',
      name: 'AdminDataForm',
      component: AdminDataForm
    },
    {
      path: '/admin/listcompany',
      name: 'AdminListCompany',
      meta: [{ title: 'รายการสำนักงาน', disabled: false }],
      component: AdminListCompany
    },
    {
      path: '/admin/status/company',
      name: 'AdminStatusCompany',
      component: AdminStatusCompany
    },
    {
      path: '/admin/status/social',
      name: 'AdminStatusSocial',
      component: AdminStatusSocial
    },
    {
      path: '/admin/setting',
      name: 'AdminSetting',
      meta: [{ title: 'การตั้งค่าโปรไฟล์', disabled: false }],
      component: AdminSetting
    },

    // {
    //   path: '/admin/admin',
    //   name: 'Admin',
    //   component: Admin
    // },

    // {
    //   path: '/superadmin/company/:id',
    //   name: 'CompanyHomeID',
    //   component: CompanyHomeID
    // },

    // User
    {
      path: '/user/dashboard',
      name: 'UserDashboard',
      meta: [{ title: 'แดชบอร์ด', disabled: false }],
      component: UserDashboard
    },
    {
      path: '/user/listupload',
      name: 'UserListUpload',
      meta: [{ title: 'รายการอัปโหลด', disabled: false }],
      component: UserListUpload
    },
    {
      path: '/user/status/upload',
      name: 'UserStatusUpload',
      meta: [{ title: 'สถานะรายการอัปโหลด', disabled: false }],
      component: UserStatusUpload
    },
    {
      path: '/user/setting',
      name: 'UserSetting',
      meta: [{ title: 'การตั้งค่าโปรไฟล์', disabled: false }],
      component: UserSetting
    },
    // {
    //   path: '/superadmin/company/admin',
    //   name: 'AdminTest',
    //   component: AdminTest
    // },

    // {
    //   path: '/superadmin/statussocial',
    //   name: 'StatusSocial',
    //   component: StatusSocial
    // },
    {
      path: '/all/usejoin',
      name: 'Usejoin',
      component: Usejoin
    }
  ]
})

export default router
