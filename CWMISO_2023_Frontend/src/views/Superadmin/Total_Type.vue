<script setup>
import Type_Company from '@/views/superadmin/Type_Company.vue'
import Type_Form from '@/views/superadmin/Type_Form.vue'
import Type_All from '@/views/superadmin/Type_All.vue'
import Type_Social from '@/views/superadmin/Type_Social.vue';
</script>

<template>
  <div class="w-full">
    <div>
      <Type_Company />
      <Type_Social />
      <!-- <Type_Form /> -->
      <Type_All />
    </div>
  </div>
</template>

<style>
html {
  scroll-behavior: smooth !important;
}
</style>
