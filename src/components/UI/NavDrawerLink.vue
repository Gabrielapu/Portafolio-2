<template>
  <RouterLink class="flex flex-row items-center my-0.5" :to="link">
    <BaseIcon :name="startIcon" class="mr-2" />
    <p class="mr-2 text-sm font-semibold">{{ name }}</p>
  </RouterLink>
</template>

<script>
export default {
  name: 'NavDrawerLink',
  props: {
    name: { type: String, default: '', },
    startIcon: { type: String, default: '', },
    link: { type: String, default: '', required: true },
  },
}
</script>
