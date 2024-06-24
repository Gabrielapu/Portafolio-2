<template>
  <div>
    <ViewHeader 
      title="Proyección de mercados" 
      subtitle="Detalle de proyección de mercados" 
      hide-new-item-button
      @openModal="e => openTemplateModal(e)"
    />
    <Section>
      <template #content>
        <div class="flex justify-end items-center">
          <div class="w-1/5">
            <DatePicker
              class="mb-3"
              v-model="filterDate"
              label="Mes"
              year-picker
              format="yyyy"
              min-date="2019"
              :max-date="dayjs().add(3, 'year').format('YYYY')"
              :showTrigger=false
              placeholder="Seleccione año"
              clearable
              size="sm"
            />
          </div>
        </div>
        <BaseTable
          :headers="headers"
          :loading="loading"
          :extra-headers="extraHeaders"
          :data="marketProjection"
          edit-link=""
          hide-duplicate-button
          hide-delete-button
          paginated
          :items-per-page="pageSize"
          :items-amount="totalCount"
          :current-page="currentPage"
          @toogle-edit-modal="rowData => editRow(rowData)"
          @change-page="page => requestData(page)"
        >
          <template #date="{ item }">
            {{ useCapitalizeFirstChar(dayjs(item.date).format('MMMM YYYY')) }}
          </template>
          <template #variation_brent="{ item }"> 
            {{ `${item.variation_brent}%` }} 
          </template>
          <template #variation_usd="{ item }"> 
            {{ `${item.variation_usd}%` }} 
          </template>
          <template #variation_ipc="{ item }"> 
            {{ `${item.variation_ipc}%` }} 
          </template>
          <template #variation_euro="{ item }"> 
            {{ `${item.variation_euro}%` }} 
          </template>
          <template #variation_papel="{ item }"> 
            {{ `${item.variation_papel}%` }} 
          </template>
        </BaseTable>
      </template>
    </Section>
  </div>
  <ManageTemplate 
    v-model="manageTemplateModal"
    label="Proyección de mercados"
    :action="templateAction"
    :loading="loadingTemplate"
    :disabled-button="getButtonStatus"
    @manage="manageTemplate"
    @addFile="file => fileToUpload = file"
  />
  <ManageMarketProjection
    v-if="crudModal"
    v-model="crudModal" 
    :item="currentItem"
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

let marketProjection = reactive([])
let currentItem = {}
const crudModal = ref(false)
const dayjs = inject('dayjs')
const filterDate = ref(null)
const loadingTemplate = ref(false)
const templateAction = ref(null)
const fileToUpload = ref(null)
const loading = ref(true)
const totalCount = ref(0)
const currentPage = ref(1)
const store = useMarketProjectionStore()
const route = useRoute()
const manageTemplateModal = ref(false)
const alertModal = ref(false)
const errorAndAlerts = ref({})
const FIRST_PAGE = 1
const pageSize = 12
const headers = [
  { text: 'Fecha', value: 'date' },
  { text: 'Brent', value: 'brent' },
  { text: 'USD', value: 'usd' },
  { text: 'IPC', value: 'ipc' },
  { text: 'Euro', value: 'euro' },
  { text: 'Papel', value: 'papel' },
  { text: 'Variación Brent', value: 'variation_brent' },
  { text: 'Variación USD', value: 'variation_usd' },
  { text: 'Variación IPC', value: 'variation_ipc' },
  { text: 'Variación Euro', value: 'variation_euro' },
  { text: 'Variación Papel', value: 'variation_papel' },
  { text: 'Acciones', value: 'actions' }
]
const extraHeaders = [
  { text: '', colspan: '1' },
  { text: 'Valores', colspan: '5' },
  { text: 'Variación', colspan: '5' },
  { text: '', colspan: '1' },
]
onMounted(() => {
  requestData(FIRST_PAGE)
})
watch(filterDate, () => {
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
const requestData = async (pageNum) => {
  loading.value = true
  currentPage.value = pageNum
  marketProjection = []
  await store.getMarketProjectionList(
    route.params.scenario_id, 
    pageNum, 
    pageSize, 
    filterDate.value
  )
  marketProjection = store.marketProjectionList.results
  totalCount.value = store.marketProjectionList.count
  loading.value = false
}
const editRow = (rowData) => {
  currentItem = rowData
  crudModal.value = true
}
</script>
