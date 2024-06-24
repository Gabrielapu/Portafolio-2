<template>
  <div v-if="!loading">    
    <BaseHeader
      :title="planification.name || 'Planificación sin nombre'"
      :subtitle="`Planifica los escenarios de ${planification.name  || 'la planificación'}`"
    />
    <Card class="my-8">
      <template #content>
        <div class="text-md w-full">
          <BaseForm id="save-planning-form" @submit="savePlanificationChanges">
            <template #form-inputs>
              <div class="flex items-center w-9/12">
                <InputValidateField
                  v-model="planification.name"
                  size="sm"
                  label-text="Nombre"
                  :placeholder-text="planification.name"
                  name="nombre"
                  :rules="['required', 'max:255']"
                />
                <InputValidateField
                  v-model="getDate"
                  size="sm"
                  label-text="Fecha de incio"
                  :placeholder-text="getDate"
                  start-icon="fe:calendar"
                  name="fecha"
                  disabled
                  class="w-1/3 ml-8"
                />
              </div>
            </template>
          </BaseForm>
          <Divider class="mt-6" />
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <Badge
                size="sm"
                :color="getColor"
                :label="getLabel"
                :start-icon="getIcon"
                :icon-spin="scenarioStatus[pStore.inputStatus || 'Cargando']?.spin"
                class="mr-2 font-semibold"
              />
              <Button
                v-if="pStore.inputStatus === 'Errores en inputs'
                 || pStore.planification.status === 'Errores en inputs'"
                size="sm"
                class="mr-3"
                width="fit"
                color="primary"
                label="Ver errores"
                uppercase
                :disabled="loadingJson"
                :loading="loadingJson"
                @click.native="getInputErrors()"              
              />
              <span class="text-slate-600 text-xs">
                Última modificación:
                <span class="text-slate-400">
                  {{ dayjs(pStore.planification.updated_at).format('DD MMM, YYYY - HH:mm')}}
                </span>
              </span>
            </div>
            <div v-if="userIsAnalyst" class="flex">
              <Button
                class="mr-3"
                color="primary"                
                label="Guardar cambios"
                uppercase
                icon="uil:save"
                @click.native="savePlanificationChanges"
              />
              <Button
                color="danger"
                label="Eliminar"
                uppercase
                outlined                
                icon="uil:trash"
                @click.native="deletePlanModal = true"
              />
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
  <DeleteModal
    v-model="deletePlanModal"
    :current-item="pStore.planification"
    label="planificación"
    :store-name="pStore"
    delete-method="deletePlanification"
    @reload="$router.push('/')"
  />
  <InputErrorsAlerts
    v-if="alertModal"
    v-model="alertModal"
    :loading="loadingJson"
    :data="pStore.inputErrors"
  />
</template>

<script setup>

const props = defineProps({
  loading: { type: Boolean },
})
const dayjs = inject('dayjs')
const $toast = inject('toast')
const userIsAnalyst = JSON.parse(localStorage.getItem('loggedUserIsAnalyst'))
const route = useRoute()
const router = useRouter()
const planificationId = route.params.planification_id
const deletePlanModal = ref(false)
const pStore = usePlanificationStore()
const scenarioStatus = useInputStatus()
const alertModal = ref(false)
const loadingJson = ref(false)
const timer = ref(null)
let planification = reactive({})

watch(() => pStore.inputStatus, () => {
  if(
    (/Sin errores o advertencias|Planillas pendientes|Errores en inputs|Inputs cargados|Error/)
      .test(pStore.inputStatus) && !!timer.value
  ) {
    console.log(`El estado es ${pStore.inputStatus} y se ejecuta clearTimer()`)
    clearTimer()
  }
})

onBeforeMount(() => {
  pStore.getUploadingInputStatus(route.params.planification_id)
  planification = {...pStore.planification}
})

onMounted(() => {
  if(!timer.value && (/Validando inputs|Cargando inputs/).test(pStore.planification.status)) {
    console.log(`Llamando a callStatus() porque es estado al cargar es ${pStore.planification.status}`)
    callStatus()
  }
})

const getDate = computed(() => {
  return dayjs(pStore.planification.start_date).format('DD-MM-YYYY')
})

const getColor = computed(() => {
  return scenarioStatus[pStore.inputStatus || 'Cargando']?.color
})

const getLabel = computed(() => {
  return scenarioStatus[pStore.inputStatus || 'Cargando']?.text
})

const getIcon = computed(() => {
  return scenarioStatus[pStore.inputStatus || 'Cargando']?.icon
})

const clearTimer = () => {
  clearInterval(timer.value)
  timer.value = null
}

const callStatus = () => {
  timer.value = setInterval(() => {
    pStore.getUploadingInputStatus(route.params.planification_id)
  }, 5000)
}

const getInputErrors = async () => {
  loadingJson.value = true
  await pStore.getInputErrors(planificationId)
  loadingJson.value = false
  alertModal.value = true
}

const requestData = async () => {
  await pStore.getPlanification(route.params.planification_id)
}

const savePlanificationChanges = async () => {
  if(!pStore.planification.name) return
  await pStore.editPlanification(planificationId, {
    name: planification.name
  })
  $toast.success('Planificacion actualizada')
  await pStore.getPlanification(route.params.planification_id)
  planification = {...pStore.planification}
  router.replace({ query: { 
    planification_name: planification.name
  }})
}

onUnmounted(() => {
  clearTimer()
  planification = {}
  pStore.planification = {}
  pStore.inputStatus = ''
})
</script>