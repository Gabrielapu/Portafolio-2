import validateUrl from '../utils/validateUrl.js'

export const useArticleGroupStore = defineStore('articleGroupStore', {
  state: () => {
    return {
      articleGroupList: [],
    }
  },
  actions: {
    async getArticleGroupList({planificationId, materialTypes, plants}) {
      let url = 'article_group/'
        url += `?planification=${planificationId}`
        if (!!materialTypes) url += `&material_types=${materialTypes}`
        if(!!plants) url += `&plants=${plants}`
      const error = 'Error al obtener la lista de grupo artículo'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.articleGroupList = data      
      return status 
    },
  },
})
