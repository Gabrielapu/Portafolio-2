import validateUrl from '../utils/validateUrl.js'

export const usePlantStore = defineStore('plantStore', {
  state: () => {
    return {
      plantSimpleList: [],
    }
  },
  actions: {
    async getPlantSimpleList({scenarioId, materialTypes}) {
      let url = `plant/list_simple/?scenario=${scenarioId}`
        url += `&material_types=${materialTypes}`
      const error = 'Error al obtener la lista simple de plantas'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.plantSimpleList = data      
      return status 
    },
  },
})
