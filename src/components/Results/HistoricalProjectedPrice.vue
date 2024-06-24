<template>
  <div class="">
    <div class="mx-4 flex items-start justify-between">
      <div>
        <label class="text-slate-400">Horizonte</label>
        <div class="flex mt-2">
          <Button 
            class="mr-2"
            label="12 M" 
            :color="horizon === 12 ? 'primary' : 'default'"
            @click="horizon = 12; getChartData()"
          />
          <Button 
            class="mr-2"
            label="24 M" 
            :color="horizon === 24 ? 'primary' : 'default'"
            @click="horizon = 24; getChartData()"
          />
          <Button 
            label="48 M" 
            :color="horizon === 48 ? 'primary' : 'default'"
            @click="horizon = 48; getChartData()"
          />
        </div>
        <Toogle 
          label-text="Ver ponderados" 
          class="mt-3" 
          v-model="seeWeighted" 
          @change="hideWeighters()"
        />
      </div>
      <div class="flex w-9/12">
        <CustomSelect
          class="w-full mr-1" 
          label-text="Tipo de material"
          placeholder-text="Ninguno"
          v-model="selectedMaterialType"
          :options="mStore.materialTypeList"
          :loading="loading"
          label-for-select="code"
          mode="multiple"
          no-options-text="No hay tipos"
          :close-on-select="false"
          @update:modelValue="onMaterialTypeChange()"
        />
        <CustomSelect
          class="w-full mr-1" 
          label-text="Plantas"
          placeholder-text="Ninguna"
          v-model="selectedPlant"
          :options="plantStore.plantSimpleList"
          :loading="loading"
          mode="multiple"
          no-options-text="No hay plantas"
          :close-on-select="false"
          @update:modelValue="onPlantChange()"
        />
        <CustomSelect
          class="w-full mr-1" 
          label-text="Grupo de artículo"
          placeholder-text="Ninguno"
          v-model="selectedArticleGroup"
          :options="agStore.articleGroupList"
          :loading="loading"
          mode="multiple"
          no-options-text="No hay grupos"
          :close-on-select="false"
          @update:modelValue="onArticleGroupChange()"
        />
        <CustomSelect
          class="w-full"
          label-text="Materiales"
          placeholder-text="Ninguno"
          :model-value="selectedMaterials"
          :options="mStore.materialSimpleList"
          :loading="loading"
          label-for-select="code"
          mode="multiple"
          no-options-text="No hay materiales"
          :close-on-select="false"
          @select="e => onSelect(e)"
          @deselect="e => onDeselect(e)"
        />
      </div>
    </div>
    <apexchart 
      ref="chart"
      class="w-full h-[300px]" 
      type="line" 
      :options="options" 
      :series="series"
      height="500px"
    />
  </div>
</template>

<script setup>
const chart = ref(null)
const dayjs = inject('dayjs')
const route = useRoute()
const scenarioId = route.params.scenario_id
const planificationId = route.params.planification_id
const horizon = ref(12)
const seeWeighted = ref(true)
const loading = ref(false)
const mStore = useMaterialStore()
const plantStore = usePlantStore()
const rStore = useReportsStore()
const agStore = useArticleGroupStore()
const selectedMaterialType = ref([])
const selectedPlant = ref([])
const selectedArticleGroup = ref([])
const selectedMaterials = ref([])
const ALL = 0
let options = reactive({
  chart: {
    type: 'line',
    toolbar: {
      show: false, // Hide the default toolbar
    },
  },
  noData: {
    text: 'Filtra por tipo de material, plantas y grupo artículo para ver datos',
    align: 'center',
    verticalAlign: 'middle',
    style: {
      fontSize: '14px',
    }
  },  
  yaxis: {
    title: {
      text: 'Precio proyectado por material', // Y-axis name
      style: {
        color: undefined,
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 500,
        cssClass: 'apexcharts-yaxis-title',
      },
    },
  },
  stroke: {
    width: [4, 4],
    dashArray: [0, 8, 5]
  },
  annotations: {
    xaxis: [
      {
        x: '',
        borderColor: '#475569',
        fillColor: '#475569',
        strokeDashArray: 0,          
        label: {
          text: 'Proyeccion', 
          orientation: 'vertical', 
          position: 'top',
          textAnchor: 'start',
          offsetX: -10,
          style: {
            background: '#475569',
            color: '#FFFFFF',
            fontSize: '14px',
          },
        },
      },
    ],
  },
})
let series = reactive([])

onMounted(async () => {
  loading.value = true
  await mStore.getMaterialTypeList(planificationId)
  loading.value = false
})

const getLabels = computed(() => {
  const labels = []
  for(let i = -(horizon.value/2); i < (horizon.value/2) + 1; i++) {
    labels.push(
      dayjs(rStore.historicalProjectedPrice.projection_date)
        .add(i, 'month')
        .format('MMMM YY')
    )
  }
  return labels
})

const onSelect = (optionId) => {
  if(optionId === ALL) {
    selectedMaterials.value = mStore.materialSimpleList.map(m => m.id)
  }
  if(optionId !== ALL) {
    selectedMaterials.value.push(optionId)
  }
  getChartData()
}

const onDeselect = (optionId) => {
  if(optionId === ALL) {
    selectedMaterials.value = []
  }
  if(optionId !== ALL) {
    selectedMaterials.value = selectedMaterials.value
      .filter(m => m !== optionId && m !== ALL)
  }
  getChartData()
}

const onMaterialTypeChange = async () => {
  selectedPlant.value = []
  selectedArticleGroup.value = []
  selectedMaterials.value = []
  loading.value = true
  await plantStore.getPlantSimpleList({
    scenarioId,
    materialTypes: selectedMaterialType.value.join(','),
  })
  loading.value = false
}

const onPlantChange = async () => {
  selectedArticleGroup.value = []
  selectedMaterials.value = []
  loading.value = true
  await agStore.getArticleGroupList({
    planificationId: route.params.planification_id,
    materialTypes: selectedMaterialType.value.join(','),
    plants: selectedPlant.value.join(','),
  })
  loading.value = false
}

const onArticleGroupChange = async () => {
  selectedMaterials.value = []
  loading.value = true
  await mStore.getMaterialSimpleList({
    planification: route.params.planification_id, 
    plants: selectedPlant.value.join(','),
    material_type: selectedMaterialType.value.join(','),
    article_groups: selectedArticleGroup.value.join(','),
  })
  loading.value = false
}

const hideWeighters = () => {
  if(!seeWeighted.value) {
    chart.value.hideSeries('Ponderado total')
    chart.value.hideSeries('Ponderado materiales')
  } else {
    chart.value.showSeries('Ponderado total')
    chart.value.showSeries('Ponderado materiales')
  }
}

const getChartData = async () => {
  if(!selectedMaterials.value.length) {
    series = []
    return
  }
  loading.value = true
  seeWeighted.value = true
  await rStore.getHistoricalProjectedPrice({
    article_group: selectedArticleGroup.value.join(','),
    material_type: selectedMaterialType.value.join(','),
    materials: selectedMaterials.value.length && selectedMaterials.value[ALL] === ALL 
      ? mStore.materialSimpleList.filter(m => m.code !== 'Todos').map(m => m.id)
      : selectedMaterials.value.join(','),
    months: horizon.value,
    plant: selectedPlant.value.join(','),
    scenarioId: route.params.scenario_id,
    weighters: true,
  })
  setOptions()
  setSeries()
  loading.value = false
}

const setSeries = () => {
  series = rStore.historicalProjectedPrice.data
}

const setOptions = () => {
  options = { ...options, labels: getLabels.value };
  options.annotations.xaxis[0].x 
    = dayjs(rStore.historicalProjectedPrice.projection_date).format('MMMM YY') 
}
</script>