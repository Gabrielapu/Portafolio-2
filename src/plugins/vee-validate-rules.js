import { configure, defineRule } from 'vee-validate';
import AllRules from '@vee-validate/rules';
import { localize } from '@vee-validate/i18n';
import es from '@vee-validate/i18n/dist/locale/es.json';


configure({
  generateMessage: localize('es', es)
})

Object.keys(AllRules).forEach(rule => {
  defineRule(rule, AllRules[rule]);
});

defineRule('numeric_float', value => {
  if (!value || !value.length) {
    return true;
  }
  if (!/^[-+]?\d+(\.\d+)?$/.test(value)) {
    return 'El campo debe ser numérico o decimal con punto como separador';
  }
  return true;
})

defineRule('max_decimals', (value, [limit]) => {
  if (!value || !value.length) {
    return true;
  }
  if (value.includes(',')) {
    return 'El campo no puede contener comas. Usar un punto para los decimales';
  }
  if (!/^[0-9]+(\.[0-9]*)?$/.test(value)) {
    return 'El campo no puede contener letras';
  }
  if (!/^(\d*\.?\d{0,3}|\d+)$/.test(value)) {
    return `El campo debe tener como máximo ${limit} decimales`;
  }
  return true;
})
