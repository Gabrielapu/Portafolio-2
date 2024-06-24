<template>
  <BaseModal
    :value="modelValue"
    title="Descargar plantillas"
    subtitle="Selecciona que plantillas quieres descargar"
    @close="closeModal()"
  >
    <template #content> 
      <Button
        class="w-1/3"
        color="default"
        :label="!downloadAll ? 'Todas' : 'Ninguna'"
        size="md"
        icon-size="md"
        uppercase
        :icon="!downloadAll ? 'uil:plus' : 'uil:minus'"
        :disabled="loading"
        @click.native="toggleAll"
      />
      <Divider class="mt-3"/>
      <div class="flex flex-col">
        <Checkbox 
          v-for="choice in choices" 
          :key="choice.name" 
          v-model="choice.value" 
          :label="choice.label" 
          color="primary"
          class="mb-1"
        />
      </div>
    </template>
    <template #actions>
      <Button
        width="full"
        color="primary"
        label="descargar"
        size="lg"
        icon-size="lg"
        uppercase
        :icon="'uil:download-alt'"
        :disabled="loading || !someChoiceSelected"
        :loading="loading"
        @click.native="downloadExamples"
      />
    </template>
  </BaseModal>
</template>

<script setup>

const props = defineProps({
  modelValue: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])
const store = usePlanificationStore()
const downloadAll = ref(true)
const loading = ref(false)

const choices = reactive([
  { label: 'Última OC', name: 'last_oc', value: true },
  { label: 'NS', name: 'ns', value: true },
  { label: 'Conversión', name: 'conversion', value: true },
  { label: 'Descripción de variaciones', name: 'variations_description', value: true },
  { label: 'Valorizado de bodega', name: 'valued_store', value: true },
  { label: 'Lista de materiales', name: 'materials_list', value: true },
  { label: 'Precio budget', name: 'budget_prices', value: true },
  { label: 'Estimado de ventas', name: 'sales_estimate', value: true },
])

const someChoiceSelected = computed(() => {
  return choices.some(choice => choice.value)
})

const toggleAll = () => {
  downloadAll.value = !downloadAll.value
  choices.forEach((choice) => {
    choice.value = downloadAll.value
  })
}

const downloadExamples = async () => {
  const payload = choices.filter(choice => choice.value).map(choice => choice.name)
  loading.value = true
  await store.getTemplates(payload)
  loading.value = false
  closeModal()
}

const closeModal = () => {
  emit('update:modelValue', false)
}
</script>