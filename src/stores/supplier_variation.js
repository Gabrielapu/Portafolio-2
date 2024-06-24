import validateUrl from '../utils/validateUrl.js'

export const useSupplierVariationStore = defineStore('supplierVariationStore', {
  state: () => {
    return {
      supplierVariationList: [],
      supplierVariation: {},
    }
  },
  actions: {
    async getSupplierVariationList(scenarioId, pageNum, date, searchQuery) {  
      let url = `supplier_variation/?scenario=${scenarioId}` 
      if(pageNum) url += `&page=${pageNum}`
      if(date) url += `&date=${date}`
      if(searchQuery) url += searchQuery
      const error = 'Error al obtener las variación de proveedores'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.supplierVariationList = data 
      return status 
    },    
    async addSupplierVariation({payload}) {
      const url = 'supplier_variation/'
      const error = 'Error al agregar variación de proveedor'
      const method = 'post'
      const { status } = await validateUrl(url, error, method, payload)  
      return status 
    },
    async editSupplierVariation({payload}) {
      const url = `supplier_variation/${payload.id}/`
      const error = 'Error al editar variacion de proveedor'
      const method = 'put'
      const { status } = await validateUrl(url, error, method, payload)  
      return status
    },
    async deleteSupplierVariation({payload}) {
      const url = `supplier_variation/${payload.id}/`
      const error = 'Error al eliminar variación de proveedor'
      const method = 'delete'
      const { status } = await validateUrl(url, error, method)  
      return status
    },
    async validateTemplate(scenarioId, file) {
      const url = 'supplier_variation/validate_excel/'
      const errorMsg = 'Error al subir el archivo'
      const method = 'post'
      const bodyFormData = new FormData()
      bodyFormData.append('file_input', file)
      bodyFormData.append('scenario', scenarioId)
      const { status, error } = await validateUrl(url, errorMsg, method, bodyFormData)
      return { status, error }
    },
    async uploadTemplate(scenarioId, file) {
      const url = 'supplier_variation/upload_excel/'
      const error = 'Error al subir el archivo'
      const method = 'post'
      const bodyFormData = new FormData()
      bodyFormData.append('file_input', file)
      bodyFormData.append('scenario', scenarioId)
      const { status } = await validateUrl(url, error, method, bodyFormData)  
      return status
    },
    async downloadTemplate(scenarioId) {
      const url = `supplier_variation/download_excel/?scenario=${scenarioId}`
      const error = 'Error al descargar plantilla'
      const responseType = 'blob'
      const { status, data } = await validateUrl(url, error, 'get', {}, responseType) 
      if(status !== 404) saveAs(new Blob([data]), 'variacion_proveedores.xlsx')
      return status
    },
  },
})
