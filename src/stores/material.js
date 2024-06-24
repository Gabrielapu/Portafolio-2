import validateUrl from '../utils/validateUrl.js'

export const useMaterialStore = defineStore('materialStore', {
  state: () => {
    return {
      materialList: [],
      material: {},
      materialSimpleList: [],
      materialTypeList: [],
    }
  },
  actions: {
    async getMaterialList(planificationId) {
      let url = `material/list_simple/?planification=${planificationId}`
      const error = 'Error al obtener la lista de materiales'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.materialList = data      
      return status 
    },
    async getMaterial(materialId) {
      const url = `material/${materialId}/`
      const error = 'Error al obtener el material'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.material = data      
      return status
    },
    async getMaterialSimpleList({
      planification, 
      plants, 
      material_type,
      article_groups
    }) {
      let  url = `material/select_for_projected_price/?planification=${planification}`
        url += `&plants=${plants}`
        url += `&material_type=${material_type}`
        url += `&article_groups=${article_groups}`
      const error = 'Error al obtener los materiales'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.materialSimpleList = data      
      return status
    },
    async getMaterialTypeList(planificationId) {
      const url = `material/list_types_materials/?planification=${planificationId}`
      const error = 'Error al obtener los tipos de materiales'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.materialTypeList = data      
      return status
    }
  },
})
