<template>
  <div class="input-text w-full">
    <label v-if="!!labelText" class="text-slate-400" :class="labelClassNames">
      {{ labelText }}
    </label>
    <div class="input-wrapper relative">
      <BaseIcon
        v-if="startIcon !== ''"
        :name="startIcon"
        class="absolute left-2 text-slate-500"
        :size="size === 'md' ? '24' : '20'"
        :class="size === 'md' ? 'top-2.5' : 'top-1.5'"
      />
      <Field
        :name="name"
        :modelValue="modelValue"
        @update:model-value="updateValue"
        :rules="fieldRules"    
        :disabled="disabled"
        :placeholder="placeholderText"
        class="w-full min-w-fit border rounded shadow-sm 
          transition-all ease-in-out duration-75"
        :class="fieldClassNames"    
        :type="fieldType"
        :maxlength="maxCharacters"
      />
      <ErrorMessage :name="name" as="div" class="text-red-600 text-xs my-2" />
    </div>
  </div>
</template>

<script>
import { Field, ErrorMessage } from 'vee-validate';
export default {
  name: 'InputValidateField',
  components: {
    Field,
    ErrorMessage,
  },
  props: {
    form: { type: String, default: '' },
    name: { type: String, default: '' },
    rules: { type: Array, default: () => [] },
    validate: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    clickable: { type: Boolean, default: false },    
    labelText: { type: String, default: '' },
    startIcon: { type: String, default: '' },
    modelValue: { type: [String, Number], default: '' },
    placeholderText: { type: String, default: '' },
    maxCharacters: { type: Number, default: null },
    size: {
      type: String,
      default: 'md',
      validator(sizeValue) {
        return ['md', 'sm'].includes(sizeValue)
      },
    },
    fieldType: {
      type: String,
      default: 'text',
      validator(typeValue) {
        return ['text', 'number', 'email', 'password'].includes(typeValue)
      },
    },
    
  },
  watch: {
    modelValue(newVal) {
      if (this.maxCharacters && newVal.length > this.maxCharacters) {
        this.modelValue = newVal.slice(0, this.maxCharacters);
      }
    },
  },
  data() {
    return {
      labelSizes: {
        sm: 'text-sm ',
        md: 'text-md ',
      },
      fieldSizes: {
        sm: 'h-8 ',
        md: 'h-11 ',
      },
      errorStyles: false,
    }
  },
  computed: {
    labelClassNames() {
      const classNames = this.labelSizes[this.size]
      return classNames
    },
    fieldClassNames() {
      return {
        [this.fieldSizes[this.size]]: true,
        'cursor-pointer': this.clickable,
        'pl-10 pr-2': !!this.startIcon,
        'px-2': !this.startIcon,
        'bg-red-50 border-red-500 text-red-500': this.errorStyles,
        'bg-slate-50 border-slate-200 text-slate-400': this.disabled,
        'bg-white border-slate-200 text-slate-500': !this.disabled && !this.errorStyles
      }
    },
    fieldRules() {
      let rules = ''
      this.rules.forEach((rule) => {
        rules += `${rule}|`
      })
      return rules
    },
  },
  methods: {
    updateValue(event) {
      this.$emit('update:modelValue', event)
    },
  },
}
</script>
