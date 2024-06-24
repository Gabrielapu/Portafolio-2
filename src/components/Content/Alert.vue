<template>
  <div class="alert-wrapper p-4 border rounded" :class="alertClassNames">
    <div class="flex items-center justify-between w-full">
      <BaseIcon class="mr-2" :name="iconName" />
      <h4>{{ title }}</h4>
      <BaseIcon name="uil:times" class="cursor-pointer" @click="$emit('close')"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContentAlert',
  props: {
    title: {
      type: String,
      default: '',
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
  },
  data() {
    return {
      variants: {
        default:
          'bg-slate-50 border-slate-200 text-slate-600 fill-slate-600',
        primary:
          'bg-blue-100 border-blue-500 text-blue-800 fill-blue-800',
        success:
          'bg-green-100 border-green-500 text-green-800 fill-green-800',
        warning:
          'bg-orange-100 border-orange-500 text-orange-800 fill-orange-800',
        danger:
          'bg-red-100 border-red-500 text-red-800 fill-red-800',
      },
      iconVariants: {
        default: 'uil:comment',
        primary: 'uil:info-circle',
        success: 'uil:check-circle',
        warning: 'uil:exclamation-triangle',
        danger: 'uil:times-circle',
      },
    }
  },
  computed: {
    alertClassNames() {
      const classNames = this.variants[this.color]
      return classNames
    },
    iconName() {
      const icon = this.iconVariants[this.color]
      return icon
    },
  },
}
</script>