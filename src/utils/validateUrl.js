import $axios from '../utils/fetchData.js'
import toastObj from '../plugins/toastify.js'
const { toast } = toastObj

export default async function validateUrl(
    url, 
    errorMsg = 'Error', 
    method = 'get', 
    payload = {},
    responseType = 'json'
) {
  try {
    const { data, status } = await $axios({url, data: payload, method, responseType })
    if(url.includes('upload_excel')) toast.success('Plantilla cargada correctamente')
    return { status, data }
  } catch (error) {
    if(
      !error.response.data.errors
      && !error.response.data.warnings
      && error.response.status === 400 
      && Object.keys(error.response.data).length > 0
    ) {
      Object.keys(error.response.data).forEach(key => {
        const errorLength = error.response.data[key].length
        if(errorLength >= 1) {
          for(let i = 0; i < errorLength; i++) {
            toast.error(error.response.data[key][i])
          }
        }
      })
    } else {
      if(!url.includes('validate_excel')) toast.error(errorMsg)
    }
    return { status: error.response.status, error }
  }   
}