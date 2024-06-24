<template>
  <div
    class="input-checkbox relative inline-block cursor-pointer z-0"
    @click="updateValue"
  >
    <div class="flex">
      <input
        :checked="modelValue"
        type="checkbox"
        class="appearance-none w-6 h-6 bg-slate-50 border border-slate-200 rounded grid place-content-center peer"
      />
      <BaseIcon
        v-show="modelValue"
        name="uil:check"
        class="absolute top-0 fill-slate-50 text-company-secondary"
      />
      <span class="ml-2">{{ label }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InputCheckbox',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
      required: true,
    },
    label: { type: String, default: '' },
  },
  methods: {
    updateValue() {
      this.$emit('update:modelValue', !this.modelValue)
    },
  },
}
</script>
