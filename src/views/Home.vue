<template>
  <div>
    <ViewHeader 
      title="Planificaciones" 
      subtitle="Resumen de todas las planificaciones" 
      newItemLabel="nueva planificación"
      hide-download-template-button
      hide-upload-template-button
      @newItem="createPlanningModal = !createPlanningModal"
    />
    <div v-if="tableLoading">
      <Spinner />
    </div>
    <Section v-else>
      <template #content>
        <BaseTable
          :headers="headers"
          :data="planifications"
          paginated
          :items-per-page="8"
          :items-amount="totalCount"
          :current-page="currentPage"
          :edit-button-options="{ icon: 'uil:folder-open', text: 'ver' }"
          edit-link=""
          hide-duplicate-button
          :hide-delete-button="!userIsAnalyst"
          @change-page="changePage"
          @toogleDelete-modal="toogleDeleteModal"
          @toogleEditModal="row => showPlanificationDetail(row)"
        >          
          <template #start_date="{ item }">
            <div class="p-2 flex flex-row justify-center">
              {{ dayjs(item.start_date).format('DD/MM/YYYY') }}
            </div>
          </template>
        </BaseTable>
      </template>
    </Section>
    <ManagePlanification v-model="createPlanningModal" @reload="reload"/>
    <DeleteModal
      v-model="deletePlanningModal"
      :current-item="currentPlanning"
      label="planificación"
      :store-name="planificationStore"
      delete-method="deletePlanification"
      @reload="reload"
    />
  </div>
</template>


<script setup>
let currentPlanning = reactive({})
let planifications = reactive([])
const dayjs = inject('dayjs')
const router = useRouter()
const totalCount = ref(0)
const currentPage = ref(1)
const tableLoading = ref(true)
const createPlanningModal = ref(false)
const deletePlanningModal = ref(false)
const planificationStore = usePlanificationStore()
const userIsAnalyst = JSON.parse(localStorage.getItem('loggedUserIsAnalyst'))
const headers = [
  { text: 'Nombre', value: 'name' },
  { text: 'Fecha de inicio', value: 'start_date' },
  { text: 'Acciones', value: 'actions' }
]

onMounted(() => {
  requestData(currentPage.value)
})

const reload = () => {
  requestData(currentPage.value)
}

const showPlanificationDetail = (row) => {
  router.push({
    name: 'planification_id',
    params: {
      planification_id: row.id
    },
    query: {
      planification_name: row.name
    }
  })
}

const requestData = async (pageNum) => {
  tableLoading.value = true
  planifications = []
  currentPage.value = pageNum
  await planificationStore.getPlanificationList(pageNum)
  planifications = planificationStore.planificationList.results
  totalCount.value = planificationStore.planificationList.count
  tableLoading.value = false
}

const changePage = (pageNum) => {
  requestData(pageNum)
}

const toogleDeleteModal = (planning) => {
  currentPlanning = planning || {}
  deletePlanningModal.value = !deletePlanningModal.value
}

</script>
