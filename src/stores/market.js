import validateUrl from '../utils/validateUrl.js'

export const useMarketsStore = defineStore('marketsStore', {
  state: () => {
    return {
      marketList: [],
    }
  },
  actions: {
    async getMarketList() {
      let url = `market/?market_type=Moneda`
      const error = 'Error al obtener la lista de mercados'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.marketList = data      
      return status 
    },
  },
})
