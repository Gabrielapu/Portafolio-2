import validateUrl from '../utils/validateUrl.js'

export const useScenarioStore = defineStore('scenarioStore', {
  state: () => {
    return {
      scenarioList: [],
      scenario: {},
      scenarioSimpleList: []
    }
  },
  getters: {
    scenarioData: state => state.scenario
  },
  actions: {
    async getScenarioList(planningId, pageNum) {    
      const url = pageNum 
        ? `scenario/?page=${pageNum}&planification=${planningId}` 
        : `scenario/all_scenarios/?planification=${planningId}`   
      const error = 'Error al obtener los escenarios'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.scenarioList = data      
      return status 
    },
    async duplicateScenario({id}) {
      const url = `scenario/${id}/duplicate/`
      const error = 'Error al obtener el escenario'
      const { status } = await validateUrl(url, error)
      return status
    },
    async getScenario(id) {
      const url = `scenario/${id}/`
      const error = 'Error al obtener el escenario'
      const { data, status } = await validateUrl(url, error)  
      if (status === 200) this.scenario = data      
      return status 
    },
    async addScenario(payload) {
      const url = 'scenario/'
      const error = 'Error al agregar el escenario'
      const method = 'post'
      const { status } = await validateUrl(url, error, method, payload)  
      return status 
    },
    async editScenario(id, payload) {
      const url = `scenario/${id}/`
      const error = 'Error al editar el escenario'
      const method = 'put'
      const { status } = await validateUrl(url, error, method, payload)  
      return status
    },
    async deleteScenario(id) {
      const url = `scenario/${id}/`
      const error = 'Error al eliminar el escenario'
      const method = 'delete'
      const { status } = await validateUrl(url, error, method)  
      return status
    },
    async executeScenario(id) {
      const url = 'execution/'
      const error = 'Error al ejecutar el escenario'
      const method = 'post'
      const { status } = await validateUrl(url, error, method, { scenario: id})  
      return status
    },
    async downloadResults(scenarioId) {
      const url = `output_file/download_all_results/?scenario=${scenarioId}`
      const error = 'Error al descargar los resultados'
      const { status, data } = await validateUrl(url, error)
      if(data && data.url) {
        window.open(data.url)
      }
      return status
    },
    async getScenarioSimpleList(planificationId) {
      const url = `scenario/list_simple/?planification=${planificationId}`
      const error = 'Error al obtener los escenarios'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.scenarioSimpleList = data      
      return status
    },
    async activateScenario(scenarioId) {
      const url = `scenario/${scenarioId}/activate/`
      const error = 'Error al activar el escenario'
      const { status } = await validateUrl(url, error)  
      return status
    },
    async downloadCycleComparisonReport(body) {
      const url 
        = `cycle_comparison/get_file/?scenario_id=${body.scenario_id}&compare_id=${body.compare_id}`
      const error = 'Error al descargar el reporte de comparación de ciclos'
      const method = 'get'
      const responseType = 'blob'
      const { status, data } = await validateUrl(url, error, method, {}, responseType) 
      if(status !== 404) saveAs(new Blob([data]), 'reporte_comparacion_ciclos.xlsx')
      return status
    },
    async downloadMarketSummaryReport(body) {
      const url 
        = `markets_summary/get_file/?scenario_id=${body.scenario_id}&compare_id=${body.compare_id}`
      const error = 'Error al descargar el reporte de resumen de mercados'
      const method = 'get'
      const responseType = 'blob'
      const { status, data } = await validateUrl(url, error, method, {}, responseType) 
      if(status !== 404) saveAs(new Blob([data]), 'reporte_resumen_mercados.xlsx')
      return status
    }
  },
})
