import validateUrl from '../utils/validateUrl.js'

export const usePolynomialsCompositionStore = defineStore('polynomialsCompositionStore', {
  state: () => {
    return {
      polynomialsCompositionList: [],
      polynomialsComposition: {},
    }
  },
  actions: {
    async getPolynomialsCompositionsList(scenarioId, pageNum, searchQuery) {    
      let url = `polynomial_composition/?page=${pageNum}&scenario=${scenarioId}` 
      if(searchQuery) url += searchQuery 
      const error = 'Error al obtener composiciones de polinomios'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.polynomialsCompositionList = data      
      return status 
    },
    async addPolynomialsComposition({payload}) {
      const url = 'polynomial_composition/'
      const error = 'Error al agregar composición de polinomios'
      const method = 'post'
      const { status } = await validateUrl(url, error, method, payload)  
      return status 
    },
    async editOrDeletePolynomialsComposition({payload}) {
      const url = 'polynomial_composition/'
      const error = `Error al ${payload.action === 'update' ? 'editar' : 'eliminar'}` 
        + 'composición de polinomios'
      const method = 'put'
      const { status } = await validateUrl(url, error, method, payload)  
      return status
    },
    async validateTemplate(scenarioId, file) {
      const url = 'polynomial_composition/validate_excel/'
      const errorMsg = 'Error al subir el archivo'
      const method = 'post'
      const bodyFormData = new FormData()
      bodyFormData.append('file_input', file)
      bodyFormData.append('scenario', scenarioId)
      const { status, error } = await validateUrl(url, errorMsg, method, bodyFormData) 
      return { status, error }
    },
    async uploadTemplate(scenarioId, file) {
      const url = 'polynomial_composition/upload_excel/'
      const error = 'Error al subir el archivo'
      const method = 'post'
      const bodyFormData = new FormData()
      bodyFormData.append('file_input', file)
      bodyFormData.append('scenario', scenarioId)
      const { status } = await validateUrl(url, error, method, bodyFormData)  
      return status
    },
    async downloadTemplate(scenarioId) {
      const url = `polynomial_composition/download_excel/?scenario=${scenarioId}`
      const error = 'Error al descargar plantilla'
      const responseType = 'blob'
      const { status, data } = await validateUrl(url, error, 'get', {}, responseType) 
      if(status !== 404) saveAs(new Blob([data]), 'composicion polinomios.xlsx')
      return status
    },
  },
})
