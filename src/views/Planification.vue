<template>
  <div v-if="loading">
    <Spinner />
  </div>
  <div v-else >
    <EditPlanification v-if="!loading && thereIsPlanning"/>   
    <TabPanel :options="tabOptions">
      <template #content="{ active }">
        <Section v-show="active === tabOptions[0].tabId">
          <template #content>
            <InputTemplates v-if="!loading && thereIsPlanning"/>
          </template>
        </Section>
        <Section v-show="active === tabOptions[1].tabId" >
          <template #content>
            <ScenariosList />
          </template>
        </Section>        
      </template>
    </TabPanel> 
  </div>
</template>

<script setup>
const loading = ref(false)
const route = useRoute()
const pStore = usePlanificationStore()

const tabOptions = [
  { tabId: 1, name: 'Plantillas input', icon: 'uil:file' },
  { tabId: 2, name: 'Lista de escenarios', icon: 'uil:list-ul' }
]

onBeforeMount(async () => {
  loading.value = true
  await pStore.getPlanification(route.params.planification_id)
  loading.value = false
})

const thereIsPlanning = computed(() => {
  return !!Object.keys(pStore.planification).length
})
</script>