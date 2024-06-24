<template>
  <BaseModal
    :value="modelValue"
    :title="form[form.type].title"
    :subtitle="form[form.type].subtitle"
    @close="closeModal(false)"
  >
    <template #content>
      <BaseForm id="modal-form" @submit="submitForm">
        <template #form-inputs>
          <component 
            v-for="(field, index) in form.fields" 
            :is="field.component"
            :key="index"
            v-model="field.value"
            class="mb-2"
            :name="field.name"
            :field-type="field.type || 'text'"
            :label-text="field.label || ''"
            form="modal-form"
            :disabled="form.type === 'delete' || loading"
            :placeholder-text="field.placeholder || ''"
            :options="field.options"
            :option-label="field.optionLabel"
            :label="field.label"
            :size="field.size || 'md'"
            :start-icon="field.startIcon"
            :rules="getRules(field.rules)"       
          />
        </template>
        <template #form-actions="{ validate, valid, reset }">
          <Divider class="mt-8 mb-4" />
          <Button
            form="modal-form"
            size="lg"
            width="full"
            :color="getColor"
            :label="getButtonLabel"
            uppercase
            :icon="getIcon"
            :loading="loading"
            @click.native="validate"
          />
        </template>
      </BaseForm>
    </template>
  </BaseModal>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Boolean, default: false, required: true },
  form: { type: Object, default: () => {} },
  type: {
    type: String,
    default: 'add',
    validator: (value) => ['add', 'edit', 'delete'].includes(value)
  }
})
const emit = defineEmits(['update:modelValue', 'reload'])
const route = useRoute()
const scenarioId = route.params.scenario_id
const loading = ref(false)
const colors = {
  add: 'primary',
  edit: 'primary',
  delete: 'danger',
}
const buttonLabels = {
  add: 'Crear',
  edit: 'Guardar cambios',
  delete: 'Eliminar',
}
const iconNames = {
  add: 'uil:plus',
  edit: 'uil:edit',
  delete: 'uil:trash-alt',
}
const crudMethodNames = {
  add: props.form.add.action,
  edit: props.form.edit?.action,
  delete: props.form.delete?.action,
}

let payload = {}

const getColor = computed(() => {
  return colors[props.form.type]
})
const getButtonLabel = computed(() => {
  return buttonLabels[props.form.type]
})
const getIcon = computed(() => {
  return iconNames[props.form.type]
})

const getRules = (rules) => {
  if(props.form.type === 'delete') return []
  return rules
}

const closeModal = (reload) => {
  emit('update:modelValue', !props.modelValue)
  resetValues()
  if (reload) {
    emit('reload')
  } 
}

const resetValues = () => {
  props.form.fields.forEach(field => field.value = '')
}

const populateFields = () => {
  props.form.fields.forEach(field => {
    payload[field.field_name] = field.value
  })
  payload.scenario = scenarioId
}
    
const submitForm = async (values, actions) => {
  loading.value = true  
  if(props.form.type === 'add' || props.form.type === 'edit') {
    populateFields()
  }
  if(props.form.type === 'delete' || props.form.type === 'edit') {
    payload.id = props.form.relatedItem.id
  }
  if(props.form.name === 'polynomialComposition') {
    populateFields()
    payload.action = props.form.type === 'edit' ? 'update' : 'destroy'
  }

  await props.form.store[crudMethodNames[props.form.type]]({ payload, scenarioId })
  loading.value = false
  actions.resetForm()
  closeModal(true)
}

</script>