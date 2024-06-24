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
          <CustomSelect
            label-text="Grupo artículo"
            placeholder-text="Seleccione un grupo"
            v-model="form.article_group_pk"
            :options="articleGroupStore.articleGroupList"
            :loading="loadingSelect"
            :disabled="(/delete|edit/).test(type) || loadingSelect"
            name="grupo articulo"
            class="mb-2"
            no-options-text="No hay articulos"
            :rules="getRules(['required'])"
            @change="type === 'add' ? form.supplier_pk = null : null"
          />
          <CustomSelect 
            label-text="Proveedor"
            placeholder-text="Seleccione un proveedor"
            v-model="form.supplier_pk"
            :options="supplierStore.supplierList"
            :loading="loadingSelect"
            :disabled="(/delete|edit/).test(type) || loadingSelect"
            name="proveedor"
            class="mb-2"
            no-options-text="No hay proveedores"
            :rules="getRules(['required'])"
          />
          <InputValidateField 
            label-text="Petroleo"
            v-model.number="form.brent"
            placeholder-text="0"
            name="petroleo"
            :rules="getRules(numericRules)"
            :disabled="type === 'delete'"
            class="mb-2"
          />
          <InputValidateField
            label-text="Dólar"
            v-model.number="form.usd"
            placeholder-text="0"
            name="dólar"
            :rules="getRules(numericRules)"
            :disabled="type === 'delete'"
            class="mb-2"
          />
          <InputValidateField
            label-text="IPC"
            v-model.number="form.ipc"
            placeholder-text="0"
            name="IPC"
            :rules="getRules(numericRules)"
            :disabled="type === 'delete'"
          />
          <InputValidateField
            label-text="Papel"
            v-model.number="form.papel"
            placeholder-text="0"
            name="Papel"
            :rules="getRules(numericRules)"
            :disabled="type === 'delete'"
          />
          <Badge
            v-if="moreThan100 && type !== 'delete'" 
            color="warning" 
            label="Petroleo, dólar, IPC y papel suman mas del 100%" 
            class="mt-4" 
            start-icon="uil:exclamation-triangle" 
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
const store = usePolynomialsCompositionStore()
const articleGroupStore = useArticleGroupStore()
const supplierStore = useSupplierStore()
const route = useRoute()
const scenarioId = route.params.scenario_id
const loading = ref(false)
const loadingSelect = ref(true)
const form = reactive({})
const numericRules = ['max_value:1', 'min_value:0', 'required', 'numeric_float']
const colors = {
  add: 'primary',
  edit: 'primary',
  delete: 'danger',
}
const titles = {
  add: 'Crear polinomio',
  edit: 'Editar polinomio',
  delete: 'Eliminar polinomio',
}
const subtitles = {
  add: 'Agregar una fila de polinomio',
  edit: 'Modificar características de polinomio',
  delete: 'Eliminar polinomio permanentemente',
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
  add: 'addPolynomialsComposition',
  edit: 'editOrDeletePolynomialsComposition',
  delete: 'editOrDeletePolynomialsComposition',
}

onMounted( async() => {
  if(props.type !== 'add') {
    populateForm()
  }
  await articleGroupStore.getArticleGroupList({ 
    planificationId: route.params.planification_id
  })
  loadingSelect.value = false
})

const moreThan100 = computed(() => {
  if(Object.keys(form).length) {
    return (form.brent*100 || 0) 
      + (form.usd*100 || 0) 
      + (form.ipc*100 || 0) 
      + (form.papel*100 || 0) > 100
  } else {
    return false
  }
})

watch(() => form.article_group_pk, async (newVal, oldVal) => {
  if(newVal !== oldVal && !!newVal) {
    loadingSelect.value = true
    await supplierStore.getSupplierList(
      route.params.planification_id,
      form.article_group_pk
    )
    loadingSelect.value = false
  }
}, { deep: true })

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
    article_group_pk: form.article_group_pk,
    supplier_pk: form.supplier_pk,
    brent: form.brent,
    usd: form.usd,
    ipc: form.ipc,
    papel: form.papel,
  }
  if(props.type === 'edit') {
    payload.action = 'update'
  } else if(props.type === 'delete') {
    payload.action = 'destroy'
  } else {
    payload.action = null
  } 
  payload.scenario = scenarioId
  await store[crudMethodNames[props.type]]({ payload, scenarioId })
  loading.value = false
  actions.resetForm()
  closeModal(true)
}

</script>