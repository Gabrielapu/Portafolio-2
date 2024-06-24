<template>
  <div>
    <label v-if="!!labelText" class="text-slate-400" :class="labelSizes[size]">
      {{ labelText }}
    </label>
    <Field
      :name="name"
      :rules="rules.join('|')"
      :modelValue="modelValue"
    >
      <VueDatePicker
        :placeholder="placeholder"
        :modelValue="modelValue"
        :input-class-name="inputClasses"
        locale="es"
        :format="format"
        auto-apply
        :teleport="false"
        :min-date="computedMinDate"
        :max-date="computedMaxDate"
        :enable-time-picker="false"
        :month-picker="monthPicker"
        :year-picker="yearPicker"
        :clearable="clearable"
        :model-type="getModelType"
        @update:model-value="updateValue"
        :disabled="disabled"
      >
        <template #input-icon>
          <BaseIcon 
            :size="size === 'sm' ? '20' : '24'" 
            class="mx-1 text-slate-500" 
            name="fe:calendar"
          />
        </template>
      </VueDatePicker>
    </Field>
    <ErrorMessage :name="name" as="div" class="text-red-600 text-xs my-2" />
  </div>
</template>

<script>
import { Field, ErrorMessage } from 'vee-validate';

export default {
  name: 'InputDatePicker',
  inject: ['dayjs'],
  components: { Field, ErrorMessage },
  data() {
    return {
      labelSizes: {
        sm: 'text-sm ',
        md: 'text-md ',
      },
    }
  },
  props: {
    modelValue: { required: true},
    size: {
      type: String,
      default: 'md',
      validator(sizeValue) {
        return ['md', 'sm'].includes(sizeValue)
      },
    },
    labelText: { type: String, default: '' },
    minDate: { type: [String, Date], default: '' },
    maxDate: { type: String, default: '' },
    rules: { type: Array, default: () => [] },
    monthPicker: { type: Boolean, default: false },
    yearPicker: { type: Boolean, default: false },
    format: { type: String, default: 'dd-MM-yyyy' },
    clearable: { type: Boolean, default: false },
    showTrigger: { type: Boolean, default: true },
    form: { type: String, default: '' },
    name: { type: String, default: '' },
    placeholder:{ type: String, default: '' },
    disabled: { type: Boolean, default: false },
  },
  computed: {
    inputClasses() {
      let newClass = this.size === 'sm' ? 'h-8' : 'h-11'
      newClass += ' border-slate-200 text-slate-400 shadow-sm'
      return newClass
    },
    getModelType() {
      if(this.monthPicker) {
        return 'yyyy-MM'
      }
      return null
    },  
    computedDate: {
      get() {
        if(this.monthPicker) {
          return this.modelValue 
            ? this.dayjs(this.modelValue).format('MM-YYYY')
            : null
        }
        if(this.yearPicker) {
          return this.modelValue
            ? this.dayjs(this.modelValue).format('YYYY')
            : null
        }
        if(this.modelValue) {
          return this.dayjs(this.modelValue).format('DD-MM-YYYY')
        }
        return this.modelValue?.toString()
      },
      set(value) {
        return value
      }
    },
    computedMinDate() {
      return this.minDate ? this.dayjs(this.minDate).toDate() : null
    },
    computedMaxDate() {
      return this.maxDate ? this.dayjs(this.maxDate).toDate() : null
    },
  },
  methods: {
    updateValue(event) {
      this.$emit('update:modelValue', event)
    },
  },
}
</script>
