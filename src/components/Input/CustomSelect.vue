<template>
  <div>
    <label class="text-slate-400"> {{ labelText }}</label>
    <Field
      :name="name"
      :rules="rules.join('|')"
      :modelValue="modelValue"
    >
      <Multiselect
        :modelValue="modelValue"
        :classes="{
          singleLabel: disabled 
          ? labelClasses + ' text-slate-300' 
          : labelClasses + ' text-slate-600',
        }"
        :options="options"
        value-prop="id"
        :disabled="disabled"
        :label="labelForSelect"
        :placeholder="placeholderText"
        :searchable="searchable"
        :loading="loading"
        :no-options-text="noOptionsText"
        noResultsText="No hay resultados"
        :can-clear="canClear"
        :hideSelected="false"
        :multipleLabel="(value) => getLabel(value)"
        :mode="mode"
        :close-on-select="closeOnSelect"
        @update:modelValue="val => emit('update:modelValue', val)"
        @change="val => emit('change', val)"
        @select="val => emit('select', val)"
        @deselect="val => emit('deselect', val)"
      />
    </Field>
    <ErrorMessage :name="name" as="div" class="text-red-600 text-xs my-2" />
  </div>
</template>

<script setup>
import { Field, ErrorMessage } from 'vee-validate';
import Multiselect from '@vueform/multiselect'

const emit = defineEmits(['update:modelValue', 'change', 'select', 'deselect'])
const props = defineProps({
  name: { type: String, default: '' },
  mode: { type: String, default: 'single' },
  rules: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  options: { type: Array, default: () => [] },
  canClear: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  labelText: { type: String, default: '' },
  modelValue: { default: '', required: true },
  searchable: { type: Boolean, default: true },
  optionLabel: { type: String, default: '' },
  noOptionsText: { type: String, default: 'No hay opciones' },
  closeOnSelect: { type: Boolean, default: true },
  labelForSelect: { type: String, default: 'name' },
  placeholderText: { type: String, default: '' },
})
const labelClasses = 'flex items-center h-full max-w-full absolute left-0 top-0' 
  + ' pointer-events-none bg-transparent leading-snug pl-3.5 pr-16 box-border' 
  + ' rtl:left-auto rtl:right-0 rtl:pl-0 rtl:pr-3.5'

const getLabel = (value) => {
  if(value.length === 1) {
    return `${getFirstWord(value, 13)}`
  }
  if(value.length > 1) {    
    return `${getFirstWord(value, 8)}, +${value.length -1}`
  }
}

const getFirstWord = (value, cut) => {
  const temporalFirstWord = value[0].code || value[0].name
  const firstWordLength = temporalFirstWord.length
  const firstWord = firstWordLength > cut
    ? `${temporalFirstWord.slice(0, cut)}... `
    : temporalFirstWord
  return firstWord
}

</script>

<style src="@vueform/multiselect/themes/default.css"></style>