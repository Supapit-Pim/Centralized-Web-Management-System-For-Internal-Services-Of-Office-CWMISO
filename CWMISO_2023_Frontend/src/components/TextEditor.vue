<script setup>
import { ref, defineComponent } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
</script>

<template>
  <QuillEditor theme="snow" :options="options" style="height: 350px">
  </QuillEditor>
</template>

<script>
export default defineComponent({
  components: {
    QuillEditor
  },
  data() {
    return {
      options: {
        modules: {
          toolbar: [
            // ขนาด
            [{ 'size': ['small', false, 'large', 'huge'] }, { 'header': [1, 2, 3, 4, 5, 6, false] }],
            // ตัวหน้า, ตัวเอียง, สี, หัวห้อย, ตัวยก
            ['bold', 'italic', 'underline', 'link', { 'color': [] }, { 'background': [] }, { 'script': 'sub' }, { 'script': 'super' }],
            // ย่อหน้า, ตำแหน่ง, เลขหัวข้อ, จุดหัวข้อ
            [{ 'indent': '-1' }, { 'indent': '+1' }, { 'align': [] }, { 'list': 'ordered' }, { 'list': 'bullet' }],
            // ภาพ, วิดีโอ
            ['image', 'video',],
            // โคด, บล็อค
            ['blockquote', 'code-block'],
            // ลบรูปแบบ
            ['clean']
          ]
        },
      }
    }
  },
})
</script>

<style>
/* ถ้ามีตัวหนังสือและรูป ทำให้ตัวหนังสืออยู่แถวเดียวกับรูป */
.ql-editor img {
  display: inline-block;
}

/* ทำให้รูปอยู่ตรงกลาง */
.ql-editor .ql-align-center img {
  margin-left: auto;
  margin-right: auto;
}

.ql-editor .ql-align-right img {
  margin-left: auto;
}

.ql-editor iframe {
  display: inline-block;
}

.ql-editor iframe .ql-align-center {
  margin-left: auto;
  margin-right: auto;
}

.ql-editor iframe .ql-align-right {
  margin-left: auto;
}
</style>
