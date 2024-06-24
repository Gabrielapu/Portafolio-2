<template>
  <div class="input-card p-4 border rounded" :class="inputCardClassNames">
    <div class="flex flex-row justify-between mb-4">
      <h4>{{ title }}</h4>
      <button
        class="full-center rounded-full w-8 h-8 transition-all ease-in-out cursor-pointer"
        :class="buttonClassNames"
      >
        <BaseIcon name="uil:arrow-right" />
      </button>
    </div>
    <div class="flex items-end justify-between">
      <span>{{ value }}</span>
      <BaseIcon :name="icon" size="72" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContentInputCard',
  props: {
    title: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    value: {
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
      inputVariants: {
        default:
          'bg-white border-slate-200 text-slate-600 fill-slate-600 ',
        primary: 'bg-blue-500 border-blue-600 text-white fill-white ',
        success: 'bg-green-600 border-green-700 text-white fill-white ',
        warning: 'bg-orange-500 border-orange-600 text-white fill-white ',
        danger:
          'bg-red-400 border-red-600 text-white fill-white ',
      },
      buttonVariants: {
        default:
          'border bg-slate-50 border-slate-200 fill-slate-600 hover:bg-slate-600 border-slate-600 hover:fill-white focus:bg-slate-600 border-slate-600 hover:fill-white active:bg-slate-600 border-slate-600 hover:fill-white',
        primary:
          'bg-white fill-blue-500 hover:bg-blue-600 hover:fill-white focus:bg-blue-600 hover:fill-white active:bg-blue-700 hover:fill-white',
        success:
          'bg-white fill-green-500 hover:bg-green-600 hover:fill-white focus:bg-green-600 hover:fill-white active:bg-green-700 hover:fill-white',
        warning:
          'bg-white fill-orange-500 hover:bg-orange-600 hover:fill-white focus:bg-orange-600 hover:fill-white active:bg-orange-700 hover:fill-white',
        danger:
          'bg-white fill-red-500 hover:bg-red-600 hover:fill-white focus:bg-red-600 hover:fill-white active:bg-red-700 hover:fill-white',
      },
    }
  },
  computed: {
    inputCardClassNames() {
      const classNames = this.inputVariants[this.color]
      return classNames
    },
    buttonClassNames() {
      const classNames = this.buttonVariants[this.color]
      return classNames
    },
  },
}
</script>

<style lang="scss" scoped>
h4 {
  @include font-style('text', 'md-semibold');
}

span {
  @include font-style('display', 'lg-bold');
}
</style>
