<template>
  <div class="flex items-center rounded-full shadow-sm" :class="badgeClassName">
    <BaseIcon
      v-if="startIcon"
      :name="startIcon"
      :size="size === 'md' ? '20' : '15'"
      class="mr-1"
      :spin="iconSpin"
    />
    <p> {{ label }} </p>
  </div>
</template>

<script setup>
const props = defineProps({
  label: { type: String, default: '' },
  uppercase: { type: Boolean, default: false },
  startIcon: { type: String, default: '' },
  iconSpin: { type: Boolean, default: false },
  size: {
    type: String,
    default: 'sm',
    validator(sizeValue) {
      return ['md', 'sm'].includes(sizeValue)
    },
  },
  color: {
    type: String,
    default: 'default',
    validator(colorValue) {
      return [
        'default',
        'primary',
        'success',
        'warning',
        'danger',
      ].includes(colorValue)
    },
  },
})

const badgeSizes = {
  sm: 'text-sm px-2 ',
  md: 'text-md px-4 ',
}

const variants = {
  default: 'bg-slate-100 text-slate-600 ',
  primary: 'bg-blue-50 text-blue-700 ',
  success: 'bg-green-50 text-green-800 ',
  warning: 'bg-orange-50 text-orange-800 ',
  danger: 'bg-red-50 text-red-500 ',
}

const badgeClassName = computed(() => {
  return {
    [badgeSizes[props.size]]: true,
    [variants[props.color]]: true,
    'uppercase': props.uppercase
  }
})
</script>
