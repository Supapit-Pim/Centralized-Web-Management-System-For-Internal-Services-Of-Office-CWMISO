
<template>
  <!-- box col -->
    <div class="grid lg:grid-cols-3 mt-2 md:grid-cols-1 grid-cols-1 gap-6">
      <div class="border border-blue-300 shadow rounded-xl p-12 max-lg w-full mx-auto" v-for="index in 9" :key="index">
        <div class="animate-pulse flex space-x-4">
          <div class="rounded-full bg-slate-300 h-32 w-32"></div>
          <div class="flex-1 space-y-6 py-5">
            <div class="h-2 bg-slate-300 rounded"></div>
            <div class="space-y-4">
              <div class="grid grid-cols-3 gap-5">
                <div class="h-2 bg-slate-300 rounded col-span-2"></div>
                <div class="h-2 bg-slate-300 rounded col-span-1"></div>
                <div class="h-2 bg-slate-300 rounded col-span-1"></div>
              </div>
              <div class="h-2 bg-slate-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>