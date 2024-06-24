<template>
  <div class="input-text-area">
    <label
      v-if="labelText !== ''"
      class="text-slate-600"
      :class="labelClassNames"
      >{{ labelText }}</label
    >
    <textarea
      :value="value"
      class="w-full mt-1 p-2 border rounded shadow-sm bg-white border-slate-200 text-slate-500"
      :class="fieldClassNames"
      @input="updateValue"
    >
    </textarea>
  </div>
</template>

<script>
export default {
  name: 'InputTextAreaField',
  props: {
    size: {
      type: String,
      default: 'md',
      validator(sizeValue) {
        return ['md', 'sm'].includes(sizeValue)
      },
    },
    labelText: {
      type: String,
      default: '',
      required: false,
    },
    value: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      labelSizes: {
        sm: 'label-sm ',
        md: 'label-md ',
      },
      textAreaSizes: {
        sm: 'field-sm h-16 ',
        md: 'field-md h-32 ',
      },
    }
  },
  computed: {
    labelClassNames() {
      const classNames = this.labelSizes[this.size]
      return classNames
    },
    fieldClassNames() {
      const classNames = this.textAreaSizes[this.size]
      return classNames
    },
  },
  methods: {
    updateValue(event) {
      this.$emit('input', event.target.value)
    },
  },
}
</script>
