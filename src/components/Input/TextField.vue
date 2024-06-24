<template>
  <div class="input-text">
    <label v-if="!hideLabel" class="text-slate-400" :class="labelClassNames">
      {{ labelText }}
    </label>
    <div class="input-wrapper relative">
      <BaseIcon
        v-if="startIcon !== ''"
        :name="startIcon"
        class="absolute left-2 fill-slate-500"
        :size="size === 'md' ? '24' : '20'"
        :class="size === 'md' ? 'top-2.5' : 'top-1.5'"
      />
      <input
        v-if="!validate"
        :value="modelValue"
        :type="type"
        :placeholder="placeholderText"
        class="w-full min-w-fit border rounded shadow-sm"
        :class="fieldClassNames"
        :form="form !== '' ? form : false"
        :name="name !== '' ? name : false"
        :disabled="disabled"
        @input="updateValue"
      />
      <ValidationProvider
        v-else
        v-slot="{ errors }"
        ref="validationProvider"
        :rules="fieldRules"
        :name="name"
      >
        <input
          :value="modelValue"
          :type="input"
          :placeholder="placeholderText"
          class="w-full min-w-fit border rounded shadow-sm transition-all ease-in-out duration-75"
          :class="fieldClassNames"
          :form="form !== '' ? form : false"
          :name="name !== '' ? name : false"
          :disabled="disabled"
          @input="updateValue"
        />
        <div v-if="errors[0] !== ''" class="error-message my-2">
          <span class="max-w-full text-red-400">
            {{ errors[0] }}
          </span>
        </div>
      </ValidationProvider>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InputTextField',
  props: {
    size: {
      type: String,
      default: 'md',
      validator(sizeValue) {
        return ['md', 'sm'].includes(sizeValue)
      },
    },
    type: {
      type: String,
      default: 'text',
      validator(typeValue) {
        return ['text', 'email', 'password'].includes(typeValue)
      },
    },
    modelValue: { type: String, default: '' },
    labelText: { type: String, default: '' },
    placeholderText: { type: String, default: '' },
    hideLabel: { type: Boolean, default: false },
    startIcon: { type: String, default: '' },
    form: { type: String, default: '' },
    name: { type: String, default: '' },
    validate: { type: Boolean, default: false },
    rules: { type: Array, default: () => [] },
    disabled: { type: Boolean, default: false },
  },
  data() {
    return {
      labelSizes: {
        sm: 'label-sm',
        md: 'label-md',
      },
      fieldSizes: {
        sm: 'field-sm h-8 ',
        md: 'field-md h-11 ',
      },
      errorStyles: false,
    }
  },
  computed: {
    labelClassNames() {
      const classNames = this.labelSizes[this.size]
      return classNames
    },
    fieldClassNames(errors) {
      let classNames = this.fieldSizes[this.size]

      if (this.labelText !== '') {
        classNames += 'mt-1 '
      }

      if (this.startIcon !== '') {
        classNames += 'pl-10 pr-2 '
      } else {
        classNames += 'px-2 '
      }

      if (this.errorStyles) {
        classNames +=
          'bg-red-50 border-red-500 text-red-500 '
      } else if (this.disabled) {
        classNames += 'bg-slate-50 border-slate-200 text-slate-400 '
      } else {
        classNames += 'bg-white border-slate-200 text-slate-500 '
      }

      return classNames
    },
    fieldRules() {
      let rules = ''
      this.rules.forEach((rule) => {
        rules += `${rule}|`
      })
      return rules
    },
  },
  mounted() {
    // watch refs para determinar si es que el
    // validador tiene errores o no
    if (this.validate) {
      this.$watch(
        () => {
          return this.$refs.validationProvider.errors
        },
        (val) => {
          val.length > 0
            ? (this.errorStyles = true)
            : (this.errorStyles = false)
        }
      )
    }
  },
  methods: {
    updateValue(event) {
      this.$emit('update:modelValue', event.target.value)
      // this.$emit('input', event.target.value)
    },
  },
}
</script>