import { createPinia } from 'pinia';

export const pinia = createPinia();
const PiniaRoot = pinia.state._rawValue

import { useTokenStore } from '@/stores/modules/token'
import { useSuperAdminStore } from '@/stores/modules/superadmin'
import { useAdminStore } from '@/stores/modules/admin'
import { useUserStore } from '@/stores/modules/user'

import { useTypeAllStore } from '@/stores/modules/type_all'
import { useTypeCompanyStore } from '@/stores/modules/type_company'
import { useTypeFormStore } from '@/stores/modules/type_form'
import { useTypeSocialStore } from '@/stores/modules/type_social'

import { useCompanyStore } from '@/stores/modules/company'

import { useListCompanyStore } from '@/stores/modules/list_company'
import { useListPersonnelStore } from '@/stores/modules/list_personnel'
import { useListServiceStore } from '@/stores/modules/list_service'
import { useListUploadStore } from '@/stores/modules/list_upload'

import { useStatusCompanyStore } from '@/stores/modules/status_company'
import { useStatusSocialStore } from '@/stores/modules/status_social'
import { useStatusUploadStore } from '@/stores/modules/status_upload'

import { useCreateFormStore } from '@/stores/modules/create_form'
import { useDataFormStore } from '@/stores/modules/data_form'
import { useDataPersonnelStore } from '@/stores/modules/data_personnel'


export { PiniaRoot,  useTokenStore, useSuperAdminStore, useAdminStore, useUserStore, 
    useTypeAllStore, useTypeCompanyStore, useTypeFormStore, useTypeSocialStore, useCompanyStore, 
    useListCompanyStore, useListPersonnelStore, useListServiceStore, useListUploadStore, 
    useStatusCompanyStore, useStatusSocialStore, useStatusUploadStore, 
    useDataFormStore, useCreateFormStore, useDataPersonnelStore, }

