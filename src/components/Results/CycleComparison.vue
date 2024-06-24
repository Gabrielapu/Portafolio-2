<template>
  <div class="flex items-start w-full px-5">
    <div class="w-5/12 mr-5">
      <div class="flex">
        <InputValidateField 
          label-text="Variación Brent"
          v-model.number="brent"
          placeholder-text="0"
          start-icon="uil:percentage"
          name="brent"
          field-type="number"
          class="w-28 mr-2"
        />
        <InputValidateField 
          label-text="Variación USD"
          v-model.number="dolar"
          placeholder-text="0"
          start-icon="uil:percentage"
          name="brent"
          field-type="number"
          class="w-28 mr-2"
        />
        <InputValidateField 
          label-text="Variación IPC"
          v-model.number="ipc"
          placeholder-text="0"
          start-icon="uil:percentage"
          name="brent"
          field-type="number"
          class="w-28 mr-2"
        />
      </div>
      <Button
        class="mt-1"
        width="fit"
        color='primary'
        label="Guardar porcentajes"
        uppercase
        icon="uil:save"
        @click.native="savePercentages()"
      />
    </div>
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
  <div class="px-5 mt-5 flex w-full overflow-x-auto">
    <div class="w-full">
      <BaseTable
        :headers="headers"
        :extra-headers="[{ text: rStore.actualCycle.table_title, colspan: '4' }]"
        :data="rStore.actualCycle.data"
        :loading="loadingTable"
      />
    </div>
    <div class="w-full">
      <BaseTable
        :headers="headers"
        :extra-headers="[{ text: rStore.cycleToCompare.table_title, colspan: '4' }]"
        :data="rStore.cycleToCompare.cycle_to_compare"
        :loading="loadingTable"
      />
    </div>
    <div class="w-full">
      <BaseTable
        :headers="lastTableHeader"
        :extra-headers="[{ text: 'Diferencia entre ciclos', colspan: '3' }]"
        :data="rStore.cycleToCompare.difference"
        :loading="loadingTable"
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
const toast = inject('toast')
const selectedPlanification = ref(null);
const selectedScenario = ref(null);
const selectedMonth = ref(null);
const brent = ref(0);
const dolar = ref(0);
const ipc = ref(0);
const loading = ref(false);
const loadingTable = ref(false);
const downloading = ref(false);
const pStore = usePlanificationStore();
const rStore = useReportsStore()
const route = useRoute()
const scenarioId = route.params.scenario_id
const sStore = useScenarioStore()

const headers = [
  { text: '', value: 'name' },
  { text: 'Variación', value: 'variation' },
  { text: 'Polinomio', value: 'polynomial' },
  { text: 'Total', value: 'total' },
]

const lastTableHeader = [
  { text: '', value: 'name' },
  { text: 'Diferencia', value: 'difference_value' },
  { text: 'Porcentual', value: 'difference_percentage' },
]

onBeforeMount(async () => {
  rStore.cycleToCompare = []
  rStore.difference = []
  loading.value = true  
  await rStore.getActualCycle(scenarioId)
  await rStore.getCycleComparisonPercentages(scenarioId)
  brent.value = rStore.cycleComparisonPercentages.brent * 100
  dolar.value = rStore.cycleComparisonPercentages.dolar * 100
  ipc.value = rStore.cycleComparisonPercentages.ipc * 100
  loading.value = false
})

const add100 = computed(() => {
  return (brent.value + dolar.value + ipc.value) === 100
})

const scenarioToCompare = computed(() => {
  return !!selectedScenario.value
})

const downloadReport = async () => {
  downloading.value = true
  await sStore.downloadCycleComparisonReport({
    scenario_id: scenarioId,
    compare_id: selectedScenario.value
  })
  downloading.value = false
}

const savePercentages = async () => {
  if(!add100.value) {
    toast.error('La suma de porcentajes debe ser 100%')
    return;
  }
  loadingTable.value = true
  await rStore.setCycleComparisonPercentages({
    scenario: scenarioId,
    brent: brent.value / 100,
    dolar: dolar.value / 100,
    ipc: ipc.value / 100
  })
  if(!!selectedScenario.value) await getDifference()
  await rStore.getActualCycle(scenarioId)
  loadingTable.value = false
} 

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
  await getDifference()
  loading.value = false
}

const getDifference = async () => {
  await rStore.getCycleToCompareAndDifference({
    scenario_id: scenarioId, 
    compare_id: selectedScenario.value
  })
}
</script>