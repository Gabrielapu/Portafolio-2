<template>
  <div
    class="button-group-wrapper inline-block border-2 rounded box-content"
    :class="wrapperClassNames"
  >
    <div class="flex">
      <div
        v-for="(value, key) in options"
        :key="key"
        class="option py-2 px-4 cursor-pointer"
        :class="buttonGroupBtnClassNames(key)"
        @click="updateValue(key)"
      >
        <p>{{ value }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ButtonGroup',
  props: {
    modelValue: {
      type: Number,
      default: 0,
    },
    size: {
      type: String,
      default: 'md',
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
    options: { type: Array, default: () => [] },
  },
  data() {
    return {
      sizes: {
        sm: 'py-1 px-2 text-sm ',
        md: 'py-2 px-4 text-md ',
      },
      wrapperVariants: {
        default: 'bg-slate-50 border-slate-200 ',
        primary: 'bg-blue-500 border-blue-500 ',
        success: 'bg-green-600 border-green-600 ',
        warning: 'bg-orange-600 border-orange-600 ',
        danger: 'bg-red-500 border-red-500 ',
      },
      buttonVariants: {
        default: 'text-white bg-slate-200 hover:bg-slate-300 ',
        primary: 'text-white bg-blue-500 hover:bg-blue-600 ',
        success: 'text-white bg-green-500 hover:bg-green-600 ',
        warning: 'text-white bg-orange-500 hover:bg-orange-600 ',
        danger: 'text-white bg-red-500 hover:bg-red-600 ',
      },
    }
  },
  computed: {
    wrapperClassNames() {
      let classNames = ''

      switch (this.color) {
        case 'default':
          classNames += this.wrapperVariants.default
          break
        case 'primary':
          classNames += this.wrapperVariants.primary
          break
        case 'success':
          classNames += this.wrapperVariants.success
          break
        case 'warning':
          classNames += this.wrapperVariants.warning
          break
        case 'danger':
          classNames += this.wrapperVariants.danger
          break
        default:
          classNames += this.wrapperVariants.default
          break
      }

      return classNames
    },
  },
  methods: {
    buttonGroupBtnClassNames(index) {
      let classNames = ''

      if (this.modelValue === index) {
        switch (this.color) {
          case 'default':
            classNames += this.buttonVariants.default
            break
          case 'primary':
            classNames += this.buttonVariants.primary
            break
          case 'success':
            classNames += this.buttonVariants.success
            break
          case 'warning':
            classNames += this.buttonVariants.warning
            break
          case 'danger':
            classNames += this.buttonVariants.danger
            break
          default:
            classNames += this.buttonVariants.default
            break
        }
      } else {
        classNames += 'bg-white hover:bg-slate-50 '
      }

      return classNames
    },
    updateValue(event) {
      this.$emit('update:modelValue', event)
    },
  },
}
</script>