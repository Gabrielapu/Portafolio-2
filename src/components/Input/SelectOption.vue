<template>
  <div
    class="select-option py-2 px-2 flex flex-row items-center justify-between fill-slate-600 hover:fill-white hover:text-white cursor-pointer"
    :class="optionClasses"
  >
    <div class="flex flex-row items-center">
      <BaseIcon v-if="startIcon !== ''" :name="startIcon" class="mr-2" />
      <span>{{ name }}</span>
    </div>
    <div v-if="checkEnabled">
      <BaseIcon v-if="state" name="fe:check" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'InputSelectOption',
  props: {
    state: {
      type: Boolean,
      default: false,
    },
    checkEnabled: {
      type: Boolean,
      default: false,
    },
    startIcon: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: 'primary',
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
        default: 'hover:bg-slate-500 ',
        primary: 'hover:bg-blue-500 ',
        success: 'hover:bg-green-500 ',
        warning: 'hover:bg-orange-500 ',
        danger: 'hover:bg-red-500 ',
      },
    }
  },
  computed: {
    optionClasses() {
      let classNames = this.variants[this.color]
      if (this.checkEnabled) {
        this.state
          ? (classNames += 'text-slate-400')
          : (classNames += 'text-slate-600')
      } else {
        classNames += 'text-slate-600'
      }
      return classNames
    },
  },
}
</script>
