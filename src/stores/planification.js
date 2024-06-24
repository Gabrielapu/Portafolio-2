import validateUrl from '../utils/validateUrl.js'

export const usePlanificationStore = defineStore('planificationStore', {
  state: () => {
    return {
      planificationList: [],
      planification: {},
      planificationsSimpleList: [],
      inputStatus: '',
      inputErrors: {}
    }
  },
  actions: {
    async getPlanificationList(pageNum) {
      const url = pageNum ? `planification/?page=${pageNum}` : 'planification/all'
      const error = 'Error al obtener las planificaciones'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.planificationList = data      
      return status 
    },
    async getPlanification(id) {
      const url = `planification/${id}/`
      const error = 'Error al obtener la planificación'
      const { data, status } = await validateUrl(url, error)  
      if (status === 200) this.planification = data      
      return status 
    },
    async addPlanification(payload) {
      const url = 'planification/'
      const error = 'Error al agregar la planificación'
      const method = 'post'
      const { status } = await validateUrl(url, error, method, payload)  
      return status 
    },
    async editPlanification(id, payload) {
      const url = `planification/${id}/`
      const error = 'Error al editar la planificación'
      const method = 'put'
      const { status } = await validateUrl(url, error, method, payload)  
      return status
    },
    async deletePlanification(id) {
      const url = `planification/${id}/`
      const error = 'Error al eliminar la planificación'
      const method = 'delete'
      const { status } = await validateUrl(url, error, method)  
      return status
    },
    async uploadInputs(planificationId, files) {
      const url = 'input_file/upload_all_types/'
      const error = 'Error al subir los archivos'
      const method = 'post'

      const bodyFormData = new FormData()
      bodyFormData.append('planification', planificationId)
      files.forEach(file => {
        if (file.file !== null) bodyFormData.append(`${file.type}`, file.file)
      })
      const { status } = await validateUrl(url, error, method, bodyFormData)  
      return status
    },
    async validateInputs(planificationId, files) {
      const url = 'input_file/input_planification_validations/'
      const errorMsg = 'Error al validar los archivos'
      const method = 'post'

      const bodyFormData = new FormData()
      bodyFormData.append('planification', planificationId)
      files.forEach(file => {
        if (file.file !== null) bodyFormData.append(`${file.type}`, file.file)
      })
      const { status, error } = await validateUrl(url, errorMsg, method, bodyFormData)
      return { status, error }
    },
    async getUploadingInputStatus(planificacionId) {
      const url = `planification/${planificacionId}/get_status/`
      const error = 'Error al obtener el estado de la planificación'
      const { data, status } = await validateUrl(url, error)
      if (status === 200) this.inputStatus = data.status
    },
    async getInputErrors(planificacionId) {
      const url = `planification/${planificacionId}/get_json_validation/`
      const error = 'Error al obtener los errores de la planificación'
      const { data, status } = await validateUrl(url, error)
      if (status === 200) this.inputErrors = data
    },
    async getTemplates(choices) {
      const joinedChoices = choices.join(',')
      const url = `input_file/get_template/?choices=${joinedChoices}`
      const error = `Error al obtener los templates: ${joinedChoices}`
      const method = 'get'
      const responseType = 'blob'
      const { status, data } = await validateUrl(url, error, method, { }, responseType )
      if(status !== 404 && choices.length === 1) saveAs(new Blob([data]), `${choices[0]}.xlsx`)
      if(status !== 404 && choices.length > 1) saveAs(new Blob([data]), 'templates.zip')
      return status
    },
    async deleteInputFile(id) {
      const url = `input_file/${id}/`
      const error = 'Error al eliminar el archivo'
      const method = 'delete'
      const { status } = await validateUrl(url, error, method)  
      return status
    },
    async getPlanificationsSimpleList(date) {
      let url = 'planification/list_simple/'
        if(date) url += `?start_date=${date}`
      const error = 'Error al obtener las planificaciones'
      const { data, status } = await validateUrl(url, error)  
      if (status === 200) this.planificationsSimpleList = data      
      return status
    }
  },
})
