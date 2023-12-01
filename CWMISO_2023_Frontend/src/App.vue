<script setup>
import Sidebar from '@/components/Sidebar.vue'
import {ref} from 'vue';
const theme = ref('light')
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
</script>

<template>
        
      <v-app :theme = "theme" >
        <Sidebar class="v-app-bar-overlay"/>
        <v-main class="d-flex align-center justify-center" >
          <!-- <FontAwesomeIcon icon="fa-solid fa-coffee " />  ไม่ได้ใช้ -->
          <RouterView class="bg-stone-100"/>
        </v-main>
        <!-- <v-btn :icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'" @click="toggleTheme"></v-btn> -->
      </v-app>
</template>
<script>
export default {
    name: 'App',
  }
    </script>
<!-- <style lang="scss"></style> -->
<style >

@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@100;200;300;400;500;600;700;800;900&display=swap');

@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@100;200;300;400;500;600;700;800;900&family=Prompt:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

* {
  font-family:'Noto Sans Thai', sans-serif;
  /* font-family: 'Prompt', sans-serif; */
  /* font-size: 500; */
}
</style>
