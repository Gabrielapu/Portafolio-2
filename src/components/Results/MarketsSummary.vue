<template>
  <div class="flex items-center w-full px-5">
    <div class="flex items-center w-7/12">
      <DatePicker
        label-text="Fecha del ciclo"
        class="w-full mr-2"
        v-model="selectedMonth"
        month-picker
        format="MM-yyyy"
        placeholder="Mes"
        name="mes"
        @update:modelValue="onMonthChange()"
      />
      <CustomSelect
        class="w-full mr-2" 
        label-text="Planificación"
        placeholder-text="Todas"
        v-model="selectedPlanification"
        :options="pStore.planificationsSimpleList"
        no-options-text="No hay planificaciones"
        :loading="loading"
        @update:modelValue="onPlanificationChange()"
      />
      <CustomSelect
        class="w-full" 
        label-text="Escenario"
        placeholder-text="Todos"
        v-model="selectedScenario"
        :options="sStore.scenarioSimpleList"
        label-for-select="name"
        no-options-text="No hay escenarios"
        :loading="loading"
        @update:modelValue="onScenarioChange()"
      />
    </div> 
  </div>
  <div class="px-5 mt-5 flex w-full">
    <div class="w-full">
      <BaseTable
        :headers="headers"
        :extra-headers="[{ text: rStore.marketsSummary.table_title, colspan: '2' }]"
        :data="rStore.marketsSummary.data"
        :loading="loadingActualCycle"
      />
    </div>
    <div class="w-full">
      <BaseTable
        :headers="headers"
        :extra-headers="[{ text: rStore.marketsSummaryWithDifference.table_title, colspan: '2' }]"
        :data="rStore.marketsSummaryWithDifference.cycle_to_compare"
        :loading="loading"
      />
    </div>
    <div class="w-full">
      <BaseTable
        :headers="differenceHeaders"
        :extra-headers="[{ text: 'Diferencia entre ciclos', colspan: '3' }]"
        :data="rStore.marketsSummaryWithDifference.difference"
        :loading="loading"
      />
    </div>
  </div>
  <div class="w-full flex justify-end pr-5 mt-2">
    <Button
      class="mt-1"
      width="fit"
      color='primary'
      label="Descargar reporte"
      uppercase
      :loading="downloading"
      :disabled="!scenarioToCompare"
      icon="uil:save"
      @click.native="downloadReport()"
    />
  </div>
</template>

<script setup>
const selectedPlanification = ref(null);
const selectedScenario = ref(null);
const selectedMonth = ref(null);
const loading = ref(false);
const loadingActualCycle = ref(false);
const downloading = ref(false);
const pStore = usePlanificationStore();
const rStore = useReportsStore();
const sStore = useScenarioStore();
const route = useRoute()
const scenarioId = route.params.scenario_id

const headers = [
  { text: 'Materia prima', value: 'raw_material' },
  { text: 'Valor', value: 'rounded_value' },
]

const differenceHeaders = [
  { text: 'Nombre', value: 'name' },
  { text: 'Valor', value: 'difference_value' },
  { text: 'Porcentual', value: 'difference_percentage' },
]

onBeforeMount(async () => {
  loadingActualCycle.value = true
  await rStore.getMarketsSummary(scenarioId)
  loadingActualCycle.value = false
})

const onMonthChange = async () => {
  sStore.scenarioSimpleList = []
  selectedScenario.value = null
  pStore.planificationSimpleList = []
  selectedPlanification.value = null
  loading.value = true
  await pStore.getPlanificationsSimpleList(selectedMonth.value)
  loading.value = false
}

const onPlanificationChange = async () => {
  sStore.scenarioSimpleList = []
  selectedScenario.value = null    
  loading.value = true
  await sStore.getScenarioSimpleList(selectedPlanification.value)
  loading.value = false
}

const onScenarioChange = async () => {
  loading.value = true
  await getMarketsDifferenceSummary()
  loading.value = false
}

const scenarioToCompare = computed(() => {
  return !!selectedScenario.value
})

const downloadReport = async () => {
  downloading.value = true
  await sStore.downloadMarketSummaryReport({
    scenario_id: scenarioId,
    compare_id: selectedScenario.value
  })
  downloading.value = false
}

const getMarketsDifferenceSummary = async () => {
  loading.value = true
  await rStore.getMarketsSummaryWithDifference({
    scenario_id: scenarioId, 
    compare_id: selectedScenario.value
  })
  loading.value = false
}

</script>