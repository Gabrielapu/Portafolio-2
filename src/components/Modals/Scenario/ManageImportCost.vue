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
          <InputValidateField 
            label-text="Flete de importación"
            v-model.number="form.freight"
            placeholder-text="0"
            name="flete de importación"
            :rules="getRules(['max_decimals:3', 'required', 'numeric_float'])"
            :disabled="type === 'delete'"
            class="mb-2"
          />
          <CustomSelect
            label-text="Moneda de flete"
            placeholder-text="Seleccione una moneda"
            v-model="form.market_id"
            :options="marketStore.marketList"
            :loading="loadingSelect"
            :disabled="type === 'delete'"
            name="moneda de flete"            
            class="mb-2"
            no-options-text="No hay monedas"
            :rules="getRules(['required'])"
          />
          <CustomSelect 
            label-text="Material SAP"
            placeholder-text="Seleccione un material SAP"
            v-model="form.material_id"
            :options="materialStore.materialList"
            :loading="loadingSelect"
            :disabled="(/delete|edit/.test(type))"
            name="material SAP"
            label-for-select="code"
            no-options-text="No hay proveedores"
            :rules="getRules(['required'])"
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
  }
})
const emit = defineEmits(['update:modelValue', 'reload'])
let payload = {}
const store = useImportCostsStore()
const marketStore = useMarketsStore()
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
  add: 'Crear costo de importación',
  edit: 'Editar costo de importación',
  delete: 'Eliminar costo de importación',
}
const subtitles = {
  add: 'Agregar una fila de costo',
  edit: 'Modificar características',
  delete: 'Eliminar costo permanentemente',
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
  add: 'addImportCost',
  edit: 'editImportCost',
  delete: 'deleteImportCost',
}

onMounted( async() => {
  if(props.type !== 'add') {
    populateForm()
  }
  await marketStore.getMarketList()
  await materialStore.getMaterialList(route.params.planification_id)
  loadingSelect.value = false
})
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
    freight: form.freight,
    market: form.market_id,
    material: form.material_id,
    scenario: scenarioId,
  }
  await store[crudMethodNames[props.type]]({ payload })
  loading.value = false
  actions.resetForm()
  closeModal(true)
}
</script>