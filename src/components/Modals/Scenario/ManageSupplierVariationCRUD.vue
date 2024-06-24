<template>
  <BaseModal
    :value="modelValue"
    :title="titles[type]"
    :subtitle="subtitles[type]"
    @close="closeModal(false)"
  >
    <template #content>
      <BaseForm id="modal-form" @submit="submitForm">
        <template #form-inputs>
          <DatePicker
            label-text="Fecha"
            v-model="form.date"
            month-picker
            format="MM-yyyy"
            placeholder="Fecha"
            class="mb-2"
            name="fecha"
            :rules="getRules(['required'])"
            :disabled="type === 'delete'"
          />
          <DatePicker
            label-text="Fecha de ingreso"
            v-model="form.entry_date"
            month-picker
            format="MM-yyyy"
            placeholder="Fecha de ingreso"
            class="mb-2"
            name="fecha de ingreso"
            :rules="getRules(['required'])"
            :disabled="type === 'delete'"
          />
           <InputValidateField 
            label-text="Proveedor de línea"
            v-model="form.supplier_name"
            placeholder-text="Proveedor en base a material sap"
            name="proveedor"
            :rules="getRules([])"
            :disabled="true"
            class="mb-2"
          />
          <CustomSelect 
            label-text="Material SAP"
            placeholder-text="Seleccione un material SAP"
            v-model.number="form.material_id"
            :options="materialStore.materialList"
            :loading="loadingSelect"
            :disabled="(/delete|edit/.test(type))"
            name="material SAP"
            label-for-select="code"
            no-options-text="No hay materiales"
            :rules="getRules(['required'])"
            class="mb-2"
            @change="val => setSupplier(val)"
          />
          <CustomSelect
            label-text="Estado"
            placeholder-text="Seleccione un estado"
            v-model="form.status"
            :options="['Supuesto', 'Real']"
            :loading="loadingSelect"
            :disabled="type === 'delete'"
            name="estado"            
            class="mb-2"
            no-options-text="No hay estados"
            :rules="getRules(['required'])"
          />
          <CustomSelect 
            label-text="Tipo de variación"
            placeholder-text="Seleccione un tipo de variación" 
            v-model="form.variation_type"
            :options="['Mercado', 'Iniciativa']"
            :loading="loadingSelect"
            :disabled="type === 'delete'"
            name="tipo de variación"
            no-options-text="No hay variaciones"
            :rules="getRules(['required'])"
            class="mb-2"
          />
          <InputValidateField 
            label-text="Variación"
            v-model.number="form.percentage"
            placeholder-text="0"
            name="flete de importación"
            :rules="getRules(['max_value:1', 'min_value:0', 'numeric_float', 'required'])"
            :disabled="type === 'delete'"
            class="mb-2"
          />
        </template>
        <template #form-actions="{ validate, valid, reset }">
          <Divider class="mt-8 mb-4" />
          <Button
            form="modal-form"
            size="lg"
            width="full"
            :color="colors[type]"
            :label="buttonLabels[type]"
            uppercase
            :icon="iconNames[type]"
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
  item: { type: Object, default: null },
  type: {
    type: String,
    default: 'add',
    validator: (value) => ['add', 'edit', 'delete'].includes(value)
  },
  selectedDate  : { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue', 'reload'])
let payload = {}
const store = useSupplierVariationStore()
const materialStore = useMaterialStore()
const route = useRoute()
const scenarioId = route.params.scenario_id
const loading = ref(false)
const loadingSelect = ref(true)
const form = reactive({})
const colors = {
  add: 'primary',
  edit: 'primary',
  delete: 'danger',
}
const titles = {
  add: 'Agregar variación',
  edit: 'Editar variación',
  delete: 'Eliminar variación',
}
const subtitles = {
  add: 'Agregar nueva variación',
  edit: 'Editar variación del mes selecionado',
  delete: 'Eliminar variación del mes selecionado',
}
const buttonLabels = {
  add: 'Agregar',
  edit: 'Guardar cambios',
  delete: 'Eliminar',
}
const iconNames = {
  add: 'uil:plus',
  edit: 'uil:edit',
  delete: 'uil:trash-alt',
}
const crudMethodNames = {
  add: 'addSupplierVariation',
  edit: 'editSupplierVariation',
  delete: 'deleteSupplierVariation',
}

onMounted( async() => {
  if(props.type !== 'add') {
    populateForm()
  }
  else {
    form.date = props.selectedDate
  }
  await materialStore.getMaterialList(route.params.planification_id)
  loadingSelect.value = false
})
const setSupplier = async (materialId) => {
  if(!materialId) return
  await materialStore.getMaterial(materialId)
  form.supplier_name = materialStore.material.supplier_name
}
const getRules = (rules) => {
  return props.type === 'delete' ? [] : rules 
}
const populateForm = () => {
  Object.keys(props.item).forEach((key) => {
    form[key] = props.item[key]
  })
}
const closeModal = (reload) => {
  emit('update:modelValue', !props.modelValue)
  resetValues()
  if (reload) {
    emit('reload')
  } 
}
const resetValues = () => {
  Object.keys(form).forEach((key) => {
    form[key] = ''
  })
}    
const submitForm = async (values, actions) => {
  loading.value = true 
  payload = {
    id: form.id,
    date: form.date,
    entry_date: form.entry_date,
    material: form.material_id,
    status: form.status,
    variation_type: form.variation_type,
    percentage: form.percentage,
    scenario: scenarioId,
  }
  await store[crudMethodNames[props.type]]({ payload })
  loading.value = false
  actions.resetForm()
  closeModal(true)
}
</script>