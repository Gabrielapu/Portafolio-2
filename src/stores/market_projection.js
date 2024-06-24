import validateUrl from '../utils/validateUrl.js'
import { saveAs } from 'file-saver';

export const useMarketProjectionStore = defineStore('marketProjectionStore', {
  state: () => {
    return {
      marketProjectionList: [],
      marketProjection: {},
    }
  },
  actions: {
    async getMarketProjectionList(scenarioId, pageNum, pageSize, year) {    
      let url = `market_projection/?scenario=${scenarioId}` 
      if(pageNum) url += `&page=${pageNum}`
      if(pageSize) url += `&page_size=${pageSize}`
      if(year) url += `&year=${year}`
      const error = 'Error al obtener las proyecciones de mercado'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.marketProjectionList = data      
      return status 
    },
    async getMarketProjection(id) {
      const url = `market_projection/${id}/`
      const error = 'Error al obtener proyección de mercado'
      const { data, status } = await validateUrl(url, error)  
      if (status === 200) this.marketProjection = data      
      return status 
    },
    async addMarketProjection(payload) {
      const url = 'market_projection/'
      const error = 'Error al agregar proyección de mercado'
      const method = 'post'
      const { status } = await validateUrl(url, error, method, payload)  
      return status 
    },
    async editMarketProjection(payload) {
      const url = `market_projection/update_market_projection/`
      const error = 'Error al editar proyección de mercado'
      const method = 'put'
      const { status } = await validateUrl(url, error, method, payload)  
      return status
    },
    async deleteMarketProjection(id) {
      const url = `market_projection/${id}/`
      const error = 'Error al eliminar proyección de mercado'
      const method = 'delete'
      const { status } = await validateUrl(url, error, method)  
      return status
    },
    async validateTemplate(scenarioId, file) {
      const url = 'market_projection/validate_excel/'
      const errorMsg = 'Error al subir el archivo'
      const method = 'post'
      const bodyFormData = new FormData()
      bodyFormData.append('file_input', file)
      bodyFormData.append('scenario', scenarioId)
      const { status, error } = await validateUrl(url, errorMsg, method, bodyFormData)
      return { status, error }
    },
    async uploadTemplate(scenarioId, file) {
      const url = 'market_projection/upload_excel/'
      const error = 'Error al subir el archivo'
      const method = 'post'
      const bodyFormData = new FormData()
      bodyFormData.append('file_input', file)
      bodyFormData.append('scenario', scenarioId)
      const { status } = await validateUrl(url, error, method, bodyFormData)  
      return status
    },
    async downloadTemplate(scenarioId) {
      const url = `market_projection/download_excel/?scenario=${scenarioId}`
      const error = 'Error al descargar plantilla'
      const responseType = 'blob'
      const { status, data } = await validateUrl(url, error, 'get', {}, responseType) 
      if(status !== 404) saveAs(new Blob([data]), 'proyeccion mercados.xlsx')
      return status
    },
  },
})
