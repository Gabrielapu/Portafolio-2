<template>
  <div v-if="loading">
    <Spinner />
  </div>
  <div v-else class="mb-5">
    <ResultsHeader
      title="Resultados"
      subtitle="Detalles de los resultados de la ejecución"
      newItemLabel="Descargar"
      :loading="loading"
      :disabled-button="scenarioWithoutResults"
      @download="downloadResults()"
    />
    <div 
      v-if="scenarioWithoutResults" 
      class="w-full text-center text-2xl mt-5"
    >
      No hay resultados disponibles. Debes ejecutar el escenario.
    </div>
    <TabPanel v-else class="mt-5" :activeOption="activeOption" :options="tabOptions">
      <template #content="{ active }">
        <Section v-show="active === tabOptions[0].tabId">
          <template #content>
            <HistoricalProjectedPrice />
          </template>
        </Section>
        <Section v-show="active === tabOptions[1].tabId">
          <template #content>
            <CycleComparison />
          </template>
        </Section>
        <Section v-show="active === tabOptions[2].tabId">
          <template #content>
            <MarketsSummary />
          </template>
        </Section>
      </template>
    </TabPanel>
  </div>
</template>


<script setup>
const loading = ref(false)
const activeOption = ref(0)
const route = useRoute()
const store = useScenarioStore()

const tabOptions = [
  { tabId: 1, name: 'Precio histórico y proyectado', icon: 'uil:graph-bar' },
  { tabId: 2, name: 'Comparación de ciclos', icon: 'uil:file-alt' },
  { tabId: 3, name: 'Resumen de mercados', icon: 'uil:file-alt' }
]

const scenarioWithoutResults = computed(() => {
  return store.scenario.status !== 'Ejecutado' && store.scenario.status !== 'Activo'
})

onMounted(async () => {
  loading.value = true
  await store.getScenario(route.params.scenario_id)
  loading.value = false
})

const downloadResults = async () => {
  loading.value = true
  await store.downloadResults(route.params.scenario_id)
  loading.value = false
}

</script>

