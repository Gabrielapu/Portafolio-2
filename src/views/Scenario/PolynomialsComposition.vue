<template>
  <div>
    <ViewHeader 
      title="Composición de polinomios" 
      subtitle="Detalle del escenario"
      newItemLabel="Agregar polinomio"
      @newItem="createPolynomialComposition"
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
          :data="polynomialCompositions"
          :loading="loading"
          edit-link=""
          hide-duplicate-button
          paginated
          :items-per-page="8"
          :items-amount="totalCount"
          :current-page="currentPage"
          @toogle-edit-modal="rowData => editRow(rowData)"
          @toogle-delete-modal="rowData => deleteRow(rowData)"
          @change-page="page => requestData(page)"
        >
          <template #brent="{ item }">
            {{ getPercent(item.brent)}}
          </template>
          <template #usd="{ item }">
            {{ getPercent(item.usd) }}
          </template>
          <template #ipc="{ item }">
            {{ getPercent(item.ipc) }}
          </template>
          <template #papel="{ item }">
            {{ getPercent(item.papel) }}
          </template>
        </BaseTable>
      </template>
    </Section>
  </div>
  <ManagePolynomialsComposition 
    v-if="crudModal"
    v-model="crudModal" 
    :item="currentItem"
    :type="formType" 
    @reload="requestData(currentPage)"
  />
  <ManageTemplate 
    v-model="manageTemplateModal"
    label="Composición de Polinomios"
    :action="templateAction"
    :loading="loadingTemplate"
    :disabled-button="getButtonStatus"
    @manage="manageTemplate"
    @addFile="file => fileToUpload = file"
    @update:modelValue="fileToUpload = false"
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

let polynomialCompositions = reactive([])
let currentItem = {}
let timerId = ref(null)
const totalCount = ref(0)
const currentPage = ref(1)
const loading = ref(true)
const fileToUpload = ref(null)
const loadingTemplate = ref(false)
const store = usePolynomialsCompositionStore()
const route = useRoute()
const filter = ref('')
const FIRST_PAGE = 1
const search = ref('')
const crudModal = ref(false)
const formType = ref('add')
const manageTemplateModal = ref(false)
const alertModal = ref(false)
const errorAndAlerts = ref({})
const templateAction = ref(null)
const filterOptions = [
  { name: 'Grupo artículo', id: 'article_group' },
  { name: 'Proveedor', id: 'supplier' },
]
const headers = [
  { text: 'Grupo artículo', value: 'article_group' },
  { text: 'Proveedor', value: 'supplier' },
  { text: 'Brent', value: 'brent' },
  { text: 'Dólar', value: 'usd' },
  { text: 'IPC', value: 'ipc' },
  { text: 'Papel', value: 'papel' },
  { text: 'Acciones', value: 'actions' }
]

onMounted(() => {
  requestData(FIRST_PAGE)
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

const createPolynomialComposition = () => {
  currentItem = {}
  formType.value = 'add'
  crudModal.value = true
}

const openTemplateModal = async (action) => {
  if(action === 'download') {
    await store.downloadTemplate(route.params.scenario_id)
    return
  }
  manageTemplateModal.value = true
  templateAction.value = action
}
const getButtonStatus = computed(() => {
  return templateAction.value === 'upload' && !fileToUpload.value 
})
const getPercent = (value) => {
  if(value) {
    return `${(value * 100).toFixed(1)}%`
  }
  return value
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

const requestData = async (pageNum) => {
  currentPage.value = pageNum
  loading.value = true
  polynomialCompositions = []
  const urlFilter = filter.value ? `&${filter.value}=${search.value}` : null
  await store.getPolynomialsCompositionsList(
    route.params.scenario_id, 
    pageNum,
    urlFilter
  )
  polynomialCompositions = store.polynomialsCompositionList.results
  totalCount.value = store.polynomialsCompositionList.count
  loading.value = false
}

const deleteRow = (rowData) => {
  currentItem = rowData
  formType.value = 'delete'
  crudModal.value = true
}

const editRow = (rowData) => {
  currentItem = rowData
  formType.value = 'edit'
  crudModal.value = true
}
</script>
