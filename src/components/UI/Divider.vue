<template>
  <div class="divider rounded" :class="dividerClassNames"></div>
</template>

<script>
export default {
  name: 'TheDivider',
  props: {
    vertical: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: 'default',
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
  },
  data() {
    return {
      direction: {
        h: 'w-full h-[1px] my-2 ',
        v: 'flex-initial w-0.5 mx-4 ',
      },
      variants: {
        default: 'bg-slate-200',
        primary: 'bg-blue-500',
        success: 'bg-green-500',
        warning: 'bg-orange-500',
        danger: 'bg-red-500',
      },
    }
  },
  computed: {
    dividerClassNames() {
      let classNames = ''

      if (this.vertical) {
        classNames = this.direction.v
      } else {
        classNames = this.direction.h
      }

      classNames += this.variants[this.color]

      return classNames
    },
  },
}
</script>

<style lang="scss" scoped></style>
