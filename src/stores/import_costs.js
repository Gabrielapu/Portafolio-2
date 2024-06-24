import validateUrl from '../utils/validateUrl.js'

export const useImportCostsStore = defineStore('importCostsStore', {
  state: () => {
    return {
      importCostsList: [],
      importCosts: {},
    }
  },
  actions: {
    async getImportCostsList(scenarioId, pageNum, pageSize, searchQuery) {
      let url = `importation_cost/?scenario=${scenarioId}` 
      if(pageNum) url += `&page=${pageNum}&page_size=${pageSize}`
      if(searchQuery) url += searchQuery 
      const error = 'Error al obtener los costos de importación'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.importCostsList = data      
      return status 
    },
    async getImportCost(id) {
      const url = `importation_cost/${id}/`
      const error = 'Error al obtener costo de importación'
      const { data, status } = await validateUrl(url, error)  
      if (status === 200) this.importCosts = data      
      return status 
    },
    async addImportCost({ payload }) {
      const url = 'importation_cost/'
      const error = 'Error al agregar costo de importación'
      const method = 'post'
      const { status } = await validateUrl(url, error, method, payload)  
      return status 
    },
    async editImportCost({ payload }) {
      const url = `importation_cost/${payload.id}/`
      const error = 'Error al editar costo de importación'
      const method = 'put'
      const { status } = await validateUrl(url, error, method, payload)  
      return status
    },
    async deleteImportCost({ payload }) {
      const url = `importation_cost/${payload.id}/`
      const error = 'Error al eliminar costo de importación'
      const method = 'delete'
      const { status } = await validateUrl(url, error, method)  
      return status
    },
    async validateTemplate(scenarioId, file) {
      const url = 'importation_cost/validate_excel/'
      const errorMsg = 'Error al subir el archivo'
      const method = 'post'
      const bodyFormData = new FormData()
      bodyFormData.append('file_input', file)
      bodyFormData.append('scenario', scenarioId)
      const { status, error } = await validateUrl(url, errorMsg, method, bodyFormData)
      return { status, error }
    },
    async uploadTemplate(scenarioId, file) {
      const url = 'importation_cost/upload_excel/'
      const error = 'Error al subir el archivo'
      const method = 'post'
      const bodyFormData = new FormData()
      bodyFormData.append('file_input', file)
      bodyFormData.append('scenario', scenarioId)
      const { status } = await validateUrl(url, error, method, bodyFormData)  
      return status
    },
    async downloadTemplate(scenarioId) {
      const url = `importation_cost/download_excel/?scenario=${scenarioId}`
      const error = 'Error al descargar plantilla'
      const responseType = 'blob'
      const { status, data } = await validateUrl(url, error, 'get', {}, responseType) 
      if(status !== 404) saveAs(new Blob([data]), 'costos de importacion.xlsx')
      return status
    },
  },
})
