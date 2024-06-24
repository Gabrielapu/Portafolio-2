<template>
  <div class="flex items-center" @click="updateValue">
    <label v-if="!!labelText" class="text-slate-400 mr-2">
      {{ labelText }}
    </label>
    <div
      class="input-toogle w-9 h-5 relative px-0.5 rounded-full cursor-pointer transition-all ease-in-out"
      :class="toogleClassName"
    >
      <div
        class="w-4 h-4 absolute top-0.5 left-0.5 rounded-full shadow-sm bg-slate-50 transition-all ease-in-out"
        :class="knobClassName"
      ></div>
      <input
        ref="toogle"
        :checked="modelValue"
        type="checkbox"
        class="appearance-none"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'InputToogle',
  props: {
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
    modelValue: { type: Boolean, default: false },
    labelText: { type: String, default: '' }
  },
  data() {
    return {
      variants: {
        default: 'bg-slate-400',
        primary: 'bg-blue-500',
        success: 'bg-green-800',
        warning: 'bg-orange-700',
        danger: 'bg-red-500',
      },
    }
  },
  computed: {
    toogleClassName() {
      let className = ''

      if (!this.modelValue) {
        className = 'bg-slate-200'
      } else {
        className = this.variants[this.color]
      }

      return className
    },
    knobClassName() {
      let className = ''

      if (!this.modelValue) {
        className = ''
      } else {
        className = 'translate-x-4'
      }

      return className
    },
  },
  methods: {
    updateValue() {
      this.$emit('update:modelValue', !this.$refs.toogle.checked)
      this.$emit('change')
    },
  },
}
</script>