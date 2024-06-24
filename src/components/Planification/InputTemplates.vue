<template>
  <div>
    <div class="grid grid-cols-4 gap-2 mb-3 mx-6">
      <UploadFile 
        v-model="last_oc" 
        title="Última OC" 
        :disabled="!userIsAnalyst" 
        :uploaded="getUploadedName('last_oc')"
        @removeFile="deleteFile(filesInSystem.last_oc)"
      />
      <UploadFile 
        v-model="ns" 
        title="Nivel de Servicio" 
        :disabled="!userIsAnalyst" 
        :uploaded="getUploadedName('ns')"
        @removeFile="deleteFile(filesInSystem.ns)"
      />
      <UploadFile 
        v-model="conversion" 
        title="Conversión" 
        :disabled="!userIsAnalyst" 
        :uploaded="getUploadedName('conversion')"
        @removeFile="deleteFile(filesInSystem.conversion)"
      />
      <UploadFile 
        v-model="estimate_sales" 
        title="Estimado de ventas" 
        :disabled="!userIsAnalyst" 
        :uploaded="getUploadedName('estimate_sales')"
        @removeFile="deleteFile(filesInSystem.estimate_sales)"
      />
    </div> 
    <div class="grid grid-cols-4 gap-2 mx-6">
      <UploadFile 
        v-model="valued_store" 
        title="Valorizado de bodega" 
        :disabled="!userIsAnalyst" 
        :uploaded="getUploadedName('valued_store')"
        @removeFile="deleteFile(filesInSystem.valued_store)"
      />
      <UploadFile 
        v-model="materials_list" 
        title="Lista de materiales" 
        :disabled="!userIsAnalyst" 
        :uploaded="getUploadedName('materials_list')"
        @removeFile="deleteFile(filesInSystem.materials_list)"
      />
      <UploadFile 
        v-model="budget_prices" 
        title="Precio budget" 
        :disabled="!userIsAnalyst" 
        :uploaded="getUploadedName('budget_prices')"
        @removeFile="deleteFile(filesInSystem.budget_prices)"
      />
      <UploadFile 
        v-model="variations_description" 
        title="Descripción de variaciones" 
        :disabled="!userIsAnalyst" 
        :uploaded="getUploadedName('variations_description')"
        @removeFile="deleteFile(filesInSystem.variations_description)"
      />
    </div>
    <div class="full-center mx-6">
      <Divider class="mt-5" />
    </div>
    <div class="flex justify-end mr-6">
      <Button
        class="mr-2"
        color="default"
        label="descargar ejemplos"
        uppercase
        icon="uil:download-alt"
        @click.native="downloadExamples"
      />
      <Button
        color="primary"
        label="guardar plantillas"
        uppercase
        icon="uil:save"
        :loading="!!timer || loading"
        :disabled="!newTemplateToUpload || !userIsAnalyst || !!timer || loading"
        @click.native="validateTemplates"
      />
    </div>
  </div>
  <DownloadSampleTemplates 
    v-if="sampleTemplatesModal" 
    v-model="sampleTemplatesModal" 
  />
</template>

<script setup>

const emit = defineEmits(['templatesUploaded'])
const pStore = usePlanificationStore()
const userIsAnalyst = JSON.parse(localStorage.getItem('loggedUserIsAnalyst'))
const route = useRoute()

const sampleTemplatesModal = ref(false)
const last_oc = ref(null)
const ns = ref(null)
const conversion = ref(null)
const estimate_sales = ref(null)
const valued_store = ref(null)
const materials_list = ref(null)
const budget_prices = ref(null)
const variations_description = ref(null)
const loading = ref(false)
const timer = ref(null)

let filesInSystem = ref({
  valued_store: null,
  materials_list: null,
  variations_description: null,
  last_oc: null,
  conversion: null,
  ns: null,
  budget_prices: null,
  all_files: null,
})

onBeforeMount(() => {
  filesInSystem.value = pStore.planification.uploaded_files
})

const newTemplateToUpload = computed(() => {
  return !!last_oc.value ||
    !!ns.value ||
    !!conversion.value ||
    !!estimate_sales.value ||
    !!valued_store.value ||
    !!materials_list.value ||
    !!budget_prices.value ||
    !!variations_description.value
})

const files = computed(() => {
  return [
    { file: last_oc.value, type: 'last_oc' },
    { file: ns.value, type: 'ns' },
    { file: conversion.value, type: 'conversion' },
    { file: estimate_sales.value, type: 'sales_estimate' },
    { file: valued_store.value, type: 'valued_store' },
    { file: materials_list.value, type: 'materials_list' },
    { file: budget_prices.value, type: 'budget_prices' },
    { file: variations_description.value, type: 'variations_description' },
  ]
}) 

watch(() => pStore.inputStatus, () => {
  if((/Sin errores o advertencias|Sin errores/).test(pStore.inputStatus)) {
    console.log(`El estado es ${pStore.inputStatus} y se ejecuta uploadTemplate()`)
    uploadTemplate()
  }
  if(
    (/Sin errores o advertencias|Planillas pendientes|Errores en inputs|Inputs cargados|Error/)
      .test(pStore.inputStatus) && !!timer.value
  ) {
    console.log(`El estado es ${pStore.inputStatus} y se ejecuta clearTimer()`)
    clearTimer()
  }
})

const getUploadedName = (name) => {
  if (!filesInSystem.value[name]) return null
  return filesInSystem.value[name].file_name
}
 
const deleteFile = async ({id}) => {
  if(id) {
    await pStore.deleteInputFile(id)
  }
}

const clearTimer = () => {
  clearInterval(timer.value)
  timer.value = null
}

const validateTemplates = async () => {
  if(!!timer.value) return
  
  loading.value = true
  const { status } = await pStore.validateInputs(route.params.planification_id, files.value)
  loading.value = false

  if(status !== 201) clearTimer()

  if(!timer.value) pStore.getUploadingInputStatus(route.params.planification_id)

  callStatus()
}

const callStatus = () => {
  timer.value = setInterval(() => {
    pStore.getUploadingInputStatus(route.params.planification_id)
  }, 5000)
}

const uploadTemplate = async () => {
  const status = await pStore.uploadInputs(route.params.planification_id, files.value)
  if(status !== 201) clearTimer()
}

const downloadExamples = () => {
  sampleTemplatesModal.value = true
}

onUnmounted(() => {
  clearTimer()
})
</script>