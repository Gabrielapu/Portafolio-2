<template>
    <BaseModal
      :value="modelValue"
      title='Editar Proyección'
      :subtitle="`Modificar proyección de ${useCapitalizeFirstChar(dayjs(item.date).format('MMMM YYYY'))}`"
      @close="closeModal(false)"
    >
      <template #content>
        <BaseForm id="modal-form" @submit="submitForm">
          <template #form-inputs>
            <InputValidateField 
              label-text="Brent"
              v-model.number="form.brent"
              placeholder-text="0"
              name="brent"
              :rules="numericRules"
              class="mb-2"
              :maxCharacters="9"
            />
            <InputValidateField
              label-text="USD"
              v-model.number="form.usd"
              placeholder-text="0"
              name="usd"
              :rules="numericRules"
              class="mb-2"
              :maxCharacters="9"
            />
            <InputValidateField
              label-text="IPC"
              v-model.number="form.ipc"
              placeholder-text="0"
              name="ipc"
              :rules="numericRules"
              class="mb-2"
              :maxCharacters="9"
            />
            <InputValidateField
              label-text="EURO"
              v-model.number="form.euro"
              placeholder-text="0"
              name="euro"
              :rules="numericRules"
              :maxCharacters="9"
            />
          </template>
          <template #form-actions="{ validate }">
            <Divider class="mt-8 mb-4" />
            <Button
              form="modal-form"
              size="lg"
              width="full"
              color='primary'
              label="Guardar cambios"
              uppercase
              icon="uil:edit"
              :loading="loading"
              @click.native="validate"
            />
          </template>
        </BaseForm>
      </template>
    </BaseModal>
  </template>
  
  <script setup>
  import useCapitalizeFirstChar from '@/composables/useCapitalizeFirstChar'
  const props = defineProps({
    modelValue: { type: Boolean, default: false, required: true },
    item: { type: Object, default: null },
  })
  const emit = defineEmits(['update:modelValue', 'reload'])
  let payload = {}
  const dayjs = inject('dayjs')
  const route = useRoute()
  const scenarioId = route.params.scenario_id
  const loading = ref(false)
  const form = reactive({})
  const numericRules = ['required', 'min:0', 'max_decimals:3']
  const store = useMarketProjectionStore()

  onMounted( async() => {
    populateForm()
  })
  
  
  const populateForm = () => {
    Object.keys(props.item).forEach((key) => {
      form[key] = props.item[key]
    })
  }
  
  const closeModal = (reload) => {
    emit('update:modelValue', !props.modelValue)
    resetValues()
    if (reload) {
      emit('reload')
    } 
  }
  
  const resetValues = () => {
    Object.keys(form).forEach((key) => {
      form[key] = ''
    })
  }
      
  const submitForm = async (values, actions) => {
    loading.value = true 
    payload = {
      scenario: scenarioId,
      date: props.item.date,
      brent: form.brent,
      usd: form.usd,
      ipc: form.ipc,
      euro: form.euro,
    }
    await store.editMarketProjection(payload)
    loading.value = false
    actions.resetForm()
    closeModal(true)
  }
  
  </script>