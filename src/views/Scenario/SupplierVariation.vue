<template>
  <div>
    <ViewHeader 
      title="Variación de proveedores" 
      subtitle="Detalle del escenario"
      newItemLabel="Agregar variación"
      @newItem="createSupplierVariation"
      @openModal="e => openTemplateModal(e)"
    />
    <Section>
      <template #content>
        <div class="flex justify-end mb-3">
          <div class="flex items-center w-1/2">
            <Select 
              v-model="filter" 
              size="sm"
              :options="filterOptions" 
              placeholder="Filtro"
            />
            <InputValidateField
              size="sm"
              start-icon="uil:search"
              class="ml-3"
              placeholder-text="Buscar"
              v-model="search"
            />
            <DatePicker
              v-model="filterDate"
              month-picker
              format="MM-yyyy"
              placeholder="Seleccione fecha"
              size="sm"
              class="ml-3 w-full"
              clearable
            /> 
          </div>
        </div>
        <BaseTable
          :headers="headers"
          :data="supplierVariations"
          :loading="loading"
          edit-link=""
          hide-duplicate-button
          paginated
          :items-per-page="8"
          :items-amount="totalCount"
          :current-page="currentPage"
          @change-page="page => requestData(page)"
          @toogle-edit-modal="rowData => editRow(rowData)"
          @toogle-delete-modal="rowData => deleteRow(rowData)"
        >
          <template #converted_percentage="{ item }"> 
            {{ `${item.converted_percentage}%` }} 
          </template>
          <template #date="{ item }">
            {{ useCapitalizeFirstChar(dayjs(item.date).format('MMM YYYY')) }}
          </template>
          <template #entry_date="{ item }">
            {{ item.entry_date 
              ? useCapitalizeFirstChar(dayjs(item.entry_date).format('MMM YYYY')) 
              : '-'
            }}
          </template>
        </BaseTable>
        </template>
    </Section>
  </div>
  <ManageTemplate 
    v-model="manageTemplateModal"
    label="variación de proveedores"
    :action="templateAction"
    :loading="loadingTemplate"
    :disabled-button="getButtonStatus"
    @manage="manageTemplate"
    @addFile="file => fileToUpload = file"
    @update:modelValue="closeModal"
  />
  <ManageSupplierVariationCRUD
    v-if="crudModal"
    v-model="crudModal" 
    :item="currentItem"
    :type="formType" 
    :selected-date = filterDate
    @reload="requestData(currentPage)"
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
import useCapitalizeFirstChar from '@/composables/useCapitalizeFirstChar'
const dayjs = inject('dayjs')

let supplierVariations = reactive([])
let timerId = ref(null)
let currentItem = {}
const totalCount = ref(0)
const currentPage = ref(1)
const search = ref('')
const filter = ref('')
const loading = ref(true)
const store = useSupplierVariationStore()
const route = useRoute()
const FIRST_PAGE = 1
const filterDate = ref(null)
const manageTemplateModal = ref(false)
const alertModal = ref(false)
const errorAndAlerts = ref({})
const templateAction = ref(null)
const fileToUpload = ref(null)
const loadingTemplate = ref(false)
const crudModal = ref(false)
const formType = ref('add')

const headers = [
  { text: 'Fecha', value: 'date' },
  { text: 'Fecha de ingreso', value: 'entry_date' },
  { text: 'Proveedor de línea', value: 'supplier_name' },
  { text: 'Material SAP', value: 'material_code' },
  { text: 'Nombre material', value: 'material_name' },
  { text: 'Estado', value: 'status' },
  { text: 'Tipo variación', value: 'variation_type' },
  { text: 'Variación', value: 'converted_percentage' },
  { text: 'Acciones', value: 'actions' }
]
const filterOptions = [
  { text: 'Proveedor de línea', id: 'supplier_name' },
  { text: 'Nombre material', id: 'material_name' },
  { text: 'Material SAP', id: 'material_code' },
  { text: 'Estado', id: 'status' },
]
onMounted(() => {
  requestData(FIRST_PAGE)
})

watch(filterDate, () => {
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
      requestData(FIRST_PAGE)
    }, 500)
  }
}
const getButtonStatus = computed(() => {
  return templateAction.value === 'upload' && !fileToUpload.value 
})

const openTemplateModal = async (action) => {
  if(action === 'download') {
    await store.downloadTemplate(route.params.scenario_id)
    return
  }
  manageTemplateModal.value = true
  templateAction.value = action
}
const createSupplierVariation = () => {
  formType.value = 'add'
  crudModal.value = true
}
const editRow = (rowData) => {
  currentItem = rowData
  formType.value = 'edit'
  crudModal.value = true
}
const deleteRow = (rowData) => {
  currentItem = rowData
  formType.value = 'delete'
  crudModal.value = true
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
const closeModal = () => {
  fileToUpload.value = false
}
const requestData = async (pageNum) => {
  currentPage.value = pageNum
  loading.value = true
  supplierVariations = []
  const urlFilter = filter.value ? `&${filter.value}=${search.value}` : null
  await store.getSupplierVariationList(
    route.params.scenario_id, 
    pageNum, 
    filterDate.value, 
    urlFilter
  )
  supplierVariations = store.supplierVariationList.results
  totalCount.value = store.supplierVariationList.count
  loading.value = false
}

</script>
