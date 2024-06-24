const scenarioStatus = {
  'Planillas pendientes': { 
    text: 'Planillas pendientes', 
    color: 'warning', 
    icon: 'uil:exclamation-triangle' 
  },
  'Validando inputs': { 
    text: 'Validando inputs', 
    color: 'primary', 
    icon: 'uil:spinner-alt',
    spin: true 
  },
  'Errores en inputs': { 
    text: 'Errores en inputs', 
    color: 'danger', 
    icon: 'uil:times-circle', 
  },
  'Sin errores o advertencias': { 
    text: 'Sin errores o advertencias', 
    color: 'success', 
    icon: 'uil:check' 
  },
  'Sin errores': { 
    text: 'Sin errores', 
    color: 'success', 
    icon: 'uil:check' 
  },
  'Cargando inputs': {
    text: 'Cargando inputs', 
    color: 'primary', 
    icon: 'uil:spinner-alt',
    spin: true
  },
  'Inputs cargados': {
    text: 'Inputs cargados',
    color: 'success',
    icon: 'uil:check-circle'
  },
  'Error': {
    text: 'Error',
    color: 'danger',
    icon: 'uil:times-circle'
  },
  'Cargando': {
    text: 'Cargando estado de inputs',
    color: 'primary',
    icon: 'uil:spinner-alt',
    spin: true
  }
}

export default function getInputStatus() {
  return scenarioStatus
}