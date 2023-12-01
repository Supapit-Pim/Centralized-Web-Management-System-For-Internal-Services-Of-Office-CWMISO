import '@/assets/css/main.css'

// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives
})

import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { pinia } from './stores'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUser, faXmark, faTrashCan, faPen, faImage} from '@fortawesome/free-solid-svg-icons'
// import { BeakerIcon } from '@heroicons/vue/24/solid'
// import { OutlineIcon } from '@heroicons/vue/24/outline'

// import { faUser } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faUser, faXmark, faTrashCan, faPen, faImage)

const app = createApp(App)

app.use(vuetify)
app.use(VueSweetalert2)
app.use(pinia)
app.use(router)
// app.component('Heroicons', BeakerIcon)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')

router.beforeEach((to, from, next) => {
  document.title = to.name
  next()
})
