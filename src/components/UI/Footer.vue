<template>
  <footer
    class="fixed bottom-0 left-0 flex w-full items-center 
      justify-end px-8 h-8 z-10 bg-white shadow-sm"
  >
    <span class="text-slate-600">© Notus {{year}}</span>
  </footer>
</template>

<script setup>
const year = ref(new Date().getFullYear())
</script>

