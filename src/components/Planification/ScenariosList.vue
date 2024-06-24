<template>
  <div class="w-full px-4">
    <div class="flex justify-end">
      <Button
        class="mb-3"
        color="primary"
        label="Nuevo escenario"
        uppercase
        icon="uil:plus"
        @click="createModal = !createModal"
      />
    </div>
  </div>
  <Divider />
  <BaseTable
    :headers="scenariosHeaders"
    :data="scenarios"
    paginated
    noBorder
    :loading="loading"
    :items-per-page="8"
    :items-amount="totalCount"
    :current-page="currentPage"
    :edit-button-options="{ icon: 'uil:folder-open', text: 'ver' }"
    edit-link=""
    @change-page="changePage"
    @toogle-duplicate-modal="toogleDuplicateModal"
    @toogle-delete-modal="toogleDeleteModal"
    @toogleEditModal="row => showScenarioDetail(row)"
  >
    <template #more_actions="{ item }">
      <Button
        size="sm"
        color="default"
        label="Activar"
        uppercase
        icon="uil:check-circle"
        class="mr-1"
        :disabled="item.status !== 'Ejecutado'"
        @click.native="toggleActivateModal(item)"
      />
    </template>
    <template #updated_at="{ item }">
      {{ useCapitalizeFirstChar(dayjs(item.updated_at).format('MMM DD, YYYY - HH:mm'))}}
    </template>
    <template #status="{ item }">
      <Badge
        size="sm"
        :color="scenarioStatus[item.status || 'Sin ejecutar'].color"
        :label="item.status"
        :start-icon="scenarioStatus[item.status || 'Sin ejecutar'].icon"
        :icon-spin="scenarioStatus[item.status || 'Sin ejecutar'].spin"
        class="mr-2 font-semibold"
      />
    </template>
  </BaseTable>
  <ActivateScenario 
    v-model="showActivateModal" 
    :scenario="selectedScenario"
    :loading-btn="activating"
    @activateScenario="scenarioId => activateScenario(scenarioId)"
  />
  <ManageScenario v-model="createModal" @reload="reload"/>
  <DeleteModal
    v-model="deleteModal"
    :current-item="currentScenario"
    label="escenario"
    :store-name="sStore"
    delete-method="deleteScenario"
    @reload="reload"
  />    
  <DuplicateModal
    v-model="duplicateModal"
    label="escenario"
    :current-item="currentScenario"
    :store-name="sStore"
    duplicate-method="duplicateScenario"
    @reload="reload"
  />
</template>

<script setup>
import useCapitalizeFirstChar from '@/composables/useCapitalizeFirstChar'

let scenarios = reactive([])
let currentScenario = reactive({})
let selectedScenario = ref({})
const route = useRoute()
const dayjs = inject('dayjs')
const loading = ref(false)
const activating = ref(false)
const router = useRouter()
const planificationId = route.params.planification_id
const totalCount = ref(0)
const currentPage = ref(1)
const createModal = ref(false)
const deleteModal = ref(false)
const duplicateModal = ref(false)
const showActivateModal = ref(false)
const sStore = useScenarioStore()
const activeOption = ref(1)
const timer = ref(null)
const scenarioStatus = reactive({
  'Sin ejecutar': { color: 'warning', icon: 'uil:exclamation-triangle' }, 
  'Ejecutando': { color: 'warning', icon: 'uil:spinner', spin: true },
  'Ejecutado': { color: 'success', icon: 'uil:check-circle' },
  'Activo': { color: 'primary', icon: 'uil:check-circle' },
  'Activando': { color: 'primary', icon: 'uil:spinner', spin: true },
  'Error': { color: 'danger', icon: 'uil:times-circle' },
})

const scenariosHeaders = [
  { text: 'Nombre', value: 'name' },
  { text: 'Estado', value: 'status' },
  { text: 'Última modificación', value: 'updated_at' },
  { text: 'Acciones', value: 'actions' },
]

onMounted( async () => {
  const FIRST_PAGE = 1
  await requestScenarios(FIRST_PAGE)
})

const toggleActivateModal = (item) => {
  selectedScenario.value = item
  showActivateModal.value = true
}

const showScenarioDetail = (row) => {
  router.push({
    name: 'scenario_id',
    params: {
      scenario_id: row.id
    },
    query: {
      scenario_name: row.name,
      planification_name: route.query.planification_name
    }
  })
}

const clearTimer = () => {
  clearInterval(timer.value)
  timer.value = null
}

const callStatus = () => {
  timer.value = setInterval(async () => {
    await requestScenarios(currentPage.value)
    const noActivatingScenarios = scenarios.every(scenario => scenario.status !== 'Activando')
    if(noActivatingScenarios) clearTimer()
  }, 20000)
}

const requestScenarios = async (page, reload) => {
  const INDEX_SCENARIOS_TAB = 1
  loading.value = true
  scenarios = []
  await sStore.getScenarioList(planificationId, page)
  scenarios = [...sStore.scenarioList.results]
  totalCount.value = sStore.scenarioList.count
  if(reload) activeOption.value = INDEX_SCENARIOS_TAB
  loading.value = false
}

const changePage = (page) => {
  requestScenarios(page)
}

const reload = async () => {
  const reload = true
  await requestScenarios(currentPage.value, reload)  
}

const toogleDeleteModal = (scenario) => {
  currentScenario = scenario || {}
  deleteModal.value = !deleteModal.value
}

const toogleDuplicateModal = (scenario) => {
  currentScenario = scenario || {}
  duplicateModal.value = !duplicateModal.value
}

const activateScenario = async (scenarioId) => {
  activating.value = true
  await sStore.activateScenario(scenarioId)
  activating.value = false
  showActivateModal.value = false
  requestScenarios(currentPage.value)
  callStatus()
}

onUnmounted(() => {
  clearTimer()
})
</script>