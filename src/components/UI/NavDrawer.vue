<template>
  <aside
    ref="navDrawer"
    class="nav-drawer-wrapper fixed top-0 left-0 w-64 
      h-screen overflow-auto shadow-md z-30 bg-white"
  >
    <div class="flex flex-col w-full px-4 pb-16 pt-7">
      <!-- <img src="../../assets/logo.png" class="mb-10" alt="logo" /> -->
      
      <div v-for="(item, i) in navItems" :key="i">
        <NavDrawerOption 
          v-if="item.show" 
          :item="item" 
          @displayChildren="e => displayItems(e)" 
        />
        <Divider v-if="item.divider && item.show" class="my-3" />
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'NavDrawer',
  props: {
    state: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      navItems: [],  
    }
  },
  beforeMount() {
    this.setNavItems()
  },
  computed: {
    planificationId() {
      return this.$route?.params.planification_id
    },
    scenarioId() {
      return this.$route?.params.scenario_id
    },
  },
  watch: {
    $route() {
      this.setNavItems()
    }
  },
  methods: {    
    displayItems(item) {
      const itemToDisplay = this.navItems.find(i => i.title === item.title)
      itemToDisplay.displayItems = !itemToDisplay.displayItems
    },
    getLink(url) {
      let modifiedUrl = url 
      modifiedUrl += `?planification_name=${this.$route.query.planification_name}`
      modifiedUrl += `&scenario_name=${this.$route.query.scenario_name}`
      return modifiedUrl
    },
    setNavItems() {
      this.navItems = [
        {
          title: 'Planificaciones',
          icon: 'uil:layer-group',
          link: '/',
          children: [],
          active: 'home',
          show: true,
        },
        {
          title: `Planificación: ${this.$route.query.planification_name}`,
          icon: 'uil:calender',
          link: this.getLink(`/planification/${this.planificationId}`),
          children: [],
          active: 'planification_id',
          show: !!this.planificationId,
          divider: true
        },
        {
          title: `Escenario: ${this.$route.query.scenario_name}`,
          icon: 'uil:clipboard',
          link: this.getLink(`/planification/${this.planificationId}/scenario/${this.scenarioId}`),
          children: [],
          active: 'scenario_id',
          show: !!this.scenarioId,
        },
        {
          title: 'Variación de proveedores',
          link: this.getLink(`/planification/${this.planificationId}/scenario/`
            +`${this.scenarioId}/supplier_variation`),
          active: 'supplier_variation',
          show: !!this.scenarioId
        },
        {
          title: 'Composición de polinomios',
          link: this.getLink(`/planification/${this.planificationId}/scenario/`
            +`${this.scenarioId}/composition_polynomials`),
          active: 'composition_polynomials',
          show: !!this.scenarioId
        },
        {
          title: 'Proyección de mercados',
          link: this.getLink(`/planification/${this.planificationId}/scenario/`
            +`${this.scenarioId}/market_projection`),
          active: 'market_projection',
          show: !!this.scenarioId
        },
        {
          title: 'Costos de importación',
          link: this.getLink(`/planification/${this.planificationId}/scenario/`
            +`${this.scenarioId}/import_costs`),
          active: 'import_costs',
          show: !!this.scenarioId,
          divider: true
        },
        {
          title: 'Resultados',
          icon: 'uil:graph-bar',
          link: this.getLink(`/planification/${this.planificationId}/scenario/`
            +`${this.scenarioId}/results`),
          active: 'results',
          show: !!this.scenarioId
        },
      ]
    }
  },
}
</script>