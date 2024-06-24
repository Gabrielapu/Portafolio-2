import validateUrl from '../utils/validateUrl.js'

export const useReportsStore = defineStore('reportsStore', {
  state: () => {
    return {
      historicalProjectedPrice: [],
      cycleComparisonPercentages: {},
      actualCycle: {},
      cycleToCompare: {},
      marketsSummary: {},
      marketsSummaryWithDifference: {},
    }
  },
  actions: {
    async getHistoricalProjectedPrice({
      article_group, 
      material_type, 
      materials, 
      months, 
      plant, 
      scenarioId,
      weighters
    }) {
      let url = 'historical_projected_prices/'
        url += `?article_group=${article_group}`
        url += `&material_type=${material_type}`
        url += `&materials=${materials}`
        url += `&months=${months}`
        url += `&plant=${plant}`
        url += `&scenario=${scenarioId}`
        url += `&weighters=${weighters}`
      const error = 'Error al obtener precio historico y proyectado'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.historicalProjectedPrice = data      
      return status 
    },
    async getCycleComparisonPercentages(scenarioId) {
      const url = `percentage/?scenario=${scenarioId}`
      const error = 'Error al obtener porcentajes en comparación de ciclos'
      const { data, status } = await validateUrl(url, error)
      if (status === 200) this.cycleComparisonPercentages = data
      return status
    },
    async setCycleComparisonPercentages(data) {
      const url = 'percentage/'
      const error = 'Error al guardar porcentajes en comparación de ciclos'
      const method = 'put'
      const { status } = await validateUrl(url, error, method, data)
      return status
    },
    async getActualCycle(scenarioId) {
      const url = `cycle_comparison/?scenario=${scenarioId}`
      const error = 'Error al obtener el ciclo actual'
      const { data, status } = await validateUrl(url, error)
      if (status === 200) this.actualCycle = data
      return status
    },
    async getCycleToCompareAndDifference(body) {
      const url = 'cycle_comparison/'
      const error = 'Error al obtener el ciclo a comparar y la diferencia entre ciclos'
      const method = 'post'
      const { data, status } = await validateUrl(url, error, method, body)
      if (status === 200) this.cycleToCompare = data 
      return status      
    },
    async getMarketsSummary(scenarioId) {
      const url = `markets_summary/?scenario=${scenarioId}`
      const error = 'Error al obtener el resumen de mercado'
      const { data, status } = await validateUrl(url, error)
      if (status === 200) this.marketsSummary = data
      return status
    },
    async getMarketsSummaryWithDifference(body) {
      const url = 'markets_summary/'
      const error = 'Error al obtener ciclo a comparar y la diferencia'
      const method = 'post'
      const { data, status } = await validateUrl(url, error, method, body)
      if (status === 200) this.marketsSummaryWithDifference = data
      return status
    }
  },
})
