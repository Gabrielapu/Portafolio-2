<template>
  <div v-if="loading">
    <Spinner />
  </div>
  <div v-else >
    <Header
      :title="scenario.name"
      :subtitle="`Planifica los escenarios de ${scenario.name}`"
      :disabled-execute="
        !templatesUploaded 
        || scenarioStore.scenario.status !== 'Sin ejecutar' 
        || executing"
      :loading="scenarioStore.scenario.status === 'Ejecutando' || executing"
      @execute="executeScenario"
    />
    <Card class="my-8">
      <template #content>
        <div class="text-md w-full">
          <InputValidateField
            v-model="scenario.name"
            class="w-60"
            size="sm"
            label-text="Nombre"
            placeholder-text="Nombre del scenarrio"
            name="itemName"
            type="text"
            :rules="['required', 'max:255']"
          />
          <Divider class="mt-6" />
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <Badge
                size="sm"
                :color="scenarioStatus[scenarioStore.scenario.status || 'Sin ejecutar'].color"
                :label="scenarioStore.scenario.status"
                :start-icon="scenarioStatus[scenarioStore.scenario.status || 'Sin ejecutar'].icon"
                :icon-spin="scenarioStatus[scenarioStore.scenario.status || 'Sin ejecutar'].spin"
                class="mr-2 font-semibold"
              />
              <span class="text-default-600 text-xs mr-5">
                Fecha de creación:
                <span class="text-slate-400">
                  {{ dayjs(planificationStore.planification.start_date).format('DD MMM, YYYY - HH:mm')}}
                </span>
              </span>
              <span class="text-default-600 text-xs">
                Última modificación:
                <span class="text-slate-400">
                  {{ dayjs(planificationStore.planification.updated_at).format('DD MMM, YYYY - HH:mm')}}
                </span>
              </span>
            </div>
            <div class="flex">
              <Button
                class="mr-3"
                size="md"
                color="primary"                
                label="Guardar escenario"
                icon="uil:save"
                @click.native="saveScenarioChanges"
              />
              <Button
                color="danger"
                size="md"
                label="Eliminar escenario"
                outlined                
                icon="uil:trash"
                @click.native="deleteScenarioModal = true"
              />
            </div>
          </div>
        </div>
      </template>
    </Card>
    <Divider />
    <DeleteModal
      v-model="deleteScenarioModal"
      :current-item="scenario"
      label="escenario"
      :store-name="scenarioStore"
      delete-method="deleteScenario"
      @reload="goToPlanification()"
    />
  </div>  
</template>

<script setup>

const $toast = inject('toast')
const dayjs = inject('dayjs')
const route = useRoute()
const router = useRouter()
let scenario = reactive({})
let executing = ref(false)
const loading = ref(true)
const deleteScenarioModal = ref(false)
const scenarioId = route.params.scenario_id
const planificationId = route.params.planification_id
const planificationStore = usePlanificationStore()
const scenarioStore = useScenarioStore()
const timer = ref(null)
const scenarioStatus = reactive({
  'Sin ejecutar': { color: 'warning', icon: 'uil:exclamation-triangle' }, 
  'Ejecutando': { color: 'warning', icon: 'uil:spinner', spin: true },
  'Ejecutado': { color: 'success', icon: 'uil:check-circle' },
  'Activo': { color: 'primary', icon: 'uil:check-circle' },
  'Error': { color: 'danger', icon: 'uil:times-circle' },
})

onMounted(() => {
  requestPlanification()
  if(!timer.value && scenarioStore.scenario.status === 'Ejecutando') {
    callStatus()
  }
})

watch(() => scenarioStore.scenario.status, () => {
  if((/Ejecutado|Error/).test(scenarioStore.scenario.status)) {
    clearTimer()
  }
}, { deep: true })

const templatesUploaded = computed(() => {
  return scenarioStore.scenario.uploaded_scenario_templates
})

const requestPlanification = async () => {
  loading.value = true
  await scenarioStore.getScenario(scenarioId)
  await planificationStore.getPlanification(planificationId)
  scenario = {...scenarioStore.scenario, id: scenarioId}
  loading.value = false
}

const executeScenario = async () => {
  clearTimer()
  executing.value = true
  await scenarioStore.executeScenario(scenarioId)
  executing.value = false
  if(!timer.value) scenarioStore.getScenario(scenarioId)
  callStatus()
}

const clearTimer = () => {
  clearInterval(timer.value)
  timer.value = null
}

const callStatus = () => {
  timer.value = setInterval(() => {
    scenarioStore.getScenario(scenarioId)
  }, 30000)
}

const saveScenarioChanges = async () => {
  await scenarioStore.editScenario(scenarioId, scenario)
  $toast.success('Escenario editado correctamente')
  await scenarioStore.getScenario(scenarioId)
  router.replace({ query: { 
    planification_name: planificationStore.planification.name,
    scenario_name: scenarioStore.scenario.name 
  } })
}

const goToPlanification = () => {
  router.push({
    name: 'planification_id',
    params: {
      planification_id: planificationId
    },
    query: {
      planification_name: route.query.planification_name
    }
  })
}

onUnmounted(() => {
  clearTimer()
})
</script>
