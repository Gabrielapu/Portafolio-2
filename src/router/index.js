import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Planification from '../views/Planification.vue'
import Scenario from '../views/Scenario/Scenario.vue'
import SupplierVariation from '../views/Scenario/SupplierVariation.vue'
import PolynomialsComposition from '../views/Scenario/PolynomialsComposition.vue'
import MarketProjection from '../views/Scenario/MarketProjection.vue'
import ImportCosts from '../views/Scenario/ImportCosts.vue'
import Results from '../views/Scenario/Results.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/login', name: 'login', component: Login },
    {   
      path: '/planification/:planification_id', 
      name: 'planification_id', 
      component: Planification 
    },
    { 
      path: '/planification/:planification_id/scenario/:scenario_id', 
      name: 'scenario_id', 
      component: Scenario 
    },
    {
      path: '/planification/:planification_id/scenario/:scenario_id/supplier_variation', 
      name: 'supplier_variation', 
      component: SupplierVariation
    },
    {
      path: '/planification/:planification_id/scenario/:scenario_id/composition_polynomials', 
      name: 'composition_polynomials', 
      component: PolynomialsComposition
    },
    {
      path: '/planification/:planification_id/scenario/:scenario_id/market_projection', 
      name: 'market_projection', 
      component: MarketProjection
    },
    {
      path: '/planification/:planification_id/scenario/:scenario_id/import_costs', 
      name: 'import_costs', 
      component: ImportCosts
    },
    {
      path: '/planification/:planification_id/scenario/:scenario_id/results', 
      name: 'results', 
      component: Results
    }
  ]
})

router.beforeEach((to) => {
  if(to.name !== 'login') {
    const token = localStorage.getItem('access_token')
    if(token) {
      return true
    } else {
      return { name: 'login'}
    }
  }
  return true
})

export default router
