<template>
  <div>
    <ViewHeader 
      title="Costos de importación" 
      subtitle="Detalle del escenario"
      newItemLabel="Agregar costo"
      @newItem="crudModal = true; formType = 'add'"
      @openModal="e => openTemplateModal(e)"
    />
    <Section>
      <template #content>
        <div class="flex justify-end mb-3">
          <div class="flex items-center w-2/5">
            <Select 
              v-model="filter" 
              size="sm" 
              :options="filterOptions" 
              placeholder="Filtro"
              class="w-2/5"
            />
            <InputValidateField
              size="sm"
              start-icon="uil:search"
              class="ml-3 w-3/5"
              placeholder-text="Buscar"
              v-model="search"
            />
          </div>
        </div>
        <BaseTable
          :headers="headers"
          :data="importCosts"
          :loading="loading"
          edit-link=""
          hide-duplicate-button
          paginated
          :items-per-page="pageSize"
          :items-amount="totalCount"
          :current-page="currentPage"
          @toogle-edit-modal="rowData => editRow(rowData)"
          @toogle-delete-modal="rowData => deleteRow(rowData)"
          @change-page="page => requestData(page)"
        />
      </template>
    </Section>
  </div>
  <ManageTemplate 
    v-model="manageTemplateModal"
    label="Costos de importación"
    :action="templateAction"
    :loading="loadingTemplate"
    :disabled-button="getButtonStatus"
    @manage="manageTemplate"
    @addFile="file => fileToUpload = file"
  />
  <ManageImportCost 
    v-if="crudModal" 
    v-model="crudModal" 
    :item="currentItem"
    :type="formType" 
    @reload="reload"
  />
  <TemplateAlerts
    v-if="alertModal"
    v-model="alertModal"
    :loading="loadingTemplate"
    :data="errorAndAlerts"
    @uploadTemplate="uploadWithWarnings"
    @update:modelValue="fileToUpload = null"
  />
</template>

<script setup>

let importCosts = reactive([])
let timerId = ref(null)
let currentItem = {}
const totalCount = ref(0)
const currentPage = ref(1)
const loading = ref(true)
const loadingTemplate = ref(false)
const store = useImportCostsStore()
const route = useRoute()
const search = ref('')
const filter = ref('')
const formType = ref('add')
const FIRST_PAGE = 1
const pageSize = 12
const fileToUpload = ref(null)
const crudModal = ref(false)
const templateAction = ref(null)
const manageTemplateModal = ref(false)
const alertModal = ref(false)
const errorAndAlerts = ref({})

const filterOptions = [
  { text: 'Proveedor de línea', id: 'supplier_name' },
  { text: 'Nombre de material', id: 'material_name' },
  { text: 'Material SAP', id: 'material_code' },
]
const headers = [
  { text: 'Flete de importación', value: 'freight' },
  { text: 'Moneda flete', value: 'market_name' },
  { text: 'Proveedor de línea', value: 'supplier_name' },
  { text: 'Material SAP', value: 'material_code' },
  { text: 'Nombre material', value: 'material_name' },
  { text: 'Acciones', value: 'actions' }
]

onMounted(() => {
  requestData(FIRST_PAGE)
})

const openTemplateModal = async (action) => {
  if(action === 'download') {
    await store.downloadTemplate(route.params.scenario_id)
    return
  }
  manageTemplateModal.value = true
  templateAction.value = action
}

const uploadWithWarnings = async () => {
  loadingTemplate.value = true
  await uploadTemplate()
  loadingTemplate.value = false
  alertModal.value = false
}

const uploadTemplate = async () => {
  await store.uploadTemplate(route.params.scenario_id, fileToUpload.value)
  await requestData(currentPage.value)
  fileToUpload.value = null
}

const manageTemplate = async () => {
  loadingTemplate.value = true
  const { status, error } = await store.validateTemplate(
    route.params.scenario_id, 
    fileToUpload.value
  )
  if(status === 200) {
    await uploadTemplate()
  } else {
    errorAndAlerts.value = error.response.data 
    alertModal.value = true
  } 
  loadingTemplate.value = false
  manageTemplateModal.value = false
}

const getButtonStatus = computed(() => {
  return templateAction.value === 'upload' && !fileToUpload.value
})

watch(search, () => {
  searchValue()
})

watch(filter, () => {
  if(search.value) searchValue()
})

const searchValue = () => {
  clearTimeout(timerId.value)
  if((filter.value && search.value) || (filter.value && !search.value)) {
    timerId.value = setTimeout(() => {
      requestData(FIRST_PAGE, search.value)
    }, 500)
  }
}

const reload = () => {
  requestData(currentPage.value)
}

const requestData = async (pageNum) => {
  currentPage.value = pageNum
  loading.value = true
  const urlFilter = filter.value ? `&${filter.value}=${search.value}` : null
  importCosts = []
  await store.getImportCostsList(route.params.scenario_id, pageNum, pageSize, urlFilter)
  importCosts = store.importCostsList.results
  totalCount.value = store.importCostsList.count
  loading.value = false
}

const deleteRow = (rowData) => {
  currentItem = rowData
  crudModal.value = true
  formType.value = 'delete'
}

const editRow = (rowData) => {
  currentItem = rowData
  crudModal.value = true
  formType.value = 'edit'
}

</script>
