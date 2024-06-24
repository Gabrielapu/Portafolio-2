<template>
  <BaseModal
    :value="modelValue"
    title="Atención"
    :subtitle="getSubtitle()"
    @close="emit('update:modelValue', false)"
  >
    <template #content>
      <div v-if="hasErrors" class="bg-red-400 mb-1" :class="commonClasses">
        <BaseIcon name="uil:exclamation-octagon" size="20" class="ml-1 mr-2" />
        <p> Errores </p>
      </div>
      <div v-if="hasErrors" class="mt-1 mb-3 text-sm overflow-y-auto max-h-52">
        <ul class="list-disc ml-5">
          <li v-for="errorKey, idx in errorKeys" :key="idx" class="mb-1 font-medium text-slate-600">
            {{ keyNames[errorKey]}}
            <ul class="list-disc ml-3 font-normal">
              <li v-for="key, i in Object.keys(props.data.errors[errorKey])" :key="i" >
                {{ props.data.errors[errorKey][key].message }}
                <ul class="list-decimal ml-3">
                  <li v-for="data, i in props.data.errors[errorKey][key].data" :key="i" >
                    {{ getData(data) }}
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div v-if="hasWarnings" class="bg-amber-500" :class="commonClasses">
        <BaseIcon name="uil:exclamation-triangle" size="20" class="ml-1 mr-2" />
        <p> Alertas </p>
      </div>
      <div v-if="hasWarnings" class="mt-1 mb-3 text-sm overflow-y-auto max-h-52">
        <ul class="list-disc ml-5">
          <li v-for="warningKey, idx in warningKeys" :key="idx" class="mb-1">
            {{ keyNames[warningKey] }}
            <ul class="list-disc ml-3">
              <li v-for="key, i in Object.keys(props.data.errors[warningKey])" :key="i" >
                {{ props.data.errors[warningKey][key].message }}
                <ul class="list-decimal ml-3">
                  <li v-for="data, i in props.data.errors[warningKey][key].data" :key="i" >
                    {{ getData(data) }}
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>      
    </template>
    <template #actions>
      <Button
        width="full"
        color="danger"
        outlined
        label="cerrar"
        size="lg"
        icon-size="lg"
        uppercase
        :icon="'uil:times'"
        :disabled="loading"
        @click.native="emit('update:modelValue', false)"
      />
    </template>
  </BaseModal>
</template>

<script setup>

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  data: { type: Object, default: {} },
})

const keyNames = {
  'last_oc': 'Última OC',
  'ns': 'NS',
  'conversion': 'Conversión',
  'variations_description': 'Descripción de variaciones',
  'valued_store': 'Valorizado de bodega',
  'materials_list': 'Lista de materiales',
  'budget_prices': 'Precio budget',
  'sales_estimate': 'Estimado de ventas',
}

const emit = defineEmits(['update:modelValue', 'uploadTemplate'])
const commonClasses = 'w-full p-1 text-white font-medium rounded-md flex items-center'

const hasErrors = computed(() => {
  return !!props.data.errors
})
const hasWarnings = computed(() => {
  return !!props.data.warnings
})
const errorKeys = computed(() => {
  return Object.keys(props.data.errors)
})
const warningKeys = computed(() => {
  return Object.keys(props.data.warnings)
})
const getSubtitle = () => {
  if(hasErrors.value && hasWarnings.value) {
    return 'Errores y alertas'
  }
  if(hasErrors.value) {
    return 'Errores. Hay que corregir y reintentar'
  }
  if(hasWarnings.value) {
    return 'Alertas'
  }
}

const getData = (data) => {
  if(Array.isArray(data)) {
    return data.join(', ')
  }
  return data
}
</script>