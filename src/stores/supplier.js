import validateUrl from '../utils/validateUrl.js'

export const useSupplierStore = defineStore('supplierStore', {
  state: () => {
    return {
      supplierList: [],
    }
  },
  actions: {
    async getSupplierList(planificationId, articleGroup) {
      let url = `supplier/?planification=${planificationId}&materials__article_group=${articleGroup}`
      const error = 'Error al obtener la lista de proveedores'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.supplierList = data      
      return status 
    },
  },
})
