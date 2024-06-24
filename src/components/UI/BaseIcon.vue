<template>
  <div :class="spin ? 'animate-spin' :  ''">
    <Icon :icon="name" :width="size" :height="size" />
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';
const props = defineProps({
  name: { type: String, default: '' },
  size: { type: String, default: '24' },
  spin: {type: Boolean, default: false},
})
</script>

