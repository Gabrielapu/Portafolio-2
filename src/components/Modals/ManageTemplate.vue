<template>
  <BaseModal
    :value="modelValue"
    :title="`${getAction} una plantilla de ${label}`"
    :subtitle="`${getAction} un archivo excel`"
    @close="emit('update:modelValue', false)"
  >
    <template #content>
      <slot name="inputs"></slot>
      <UploadFile 
        v-if="action === 'upload'" 
        @update:modelValue="file => emit('addFile', file)"
      />
    </template>
    <template #actions>
      <Button
        width="full"
        color="primary"
        :label="getAction"
        size="lg"
        uppercase
        :icon="action === 'upload' ? 'uil:upload' : 'uil:download-alt'"
        :disabled="loading || disabledButton"
        :loading="loading"
        @click.native="emit('manage')"
      />
    </template>
  </BaseModal>
</template>

<script setup>

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, default: ''},
  disabledButton: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  action: { 
    type: String, 
    default: '', 
    validator(value) { 
      return ['download', 'upload'].includes(value) 
    } 
  },
})
const emit = defineEmits(['update:modelValue', 'manage' , 'addFile'])

const getAction = computed(() => {
  return props.action === 'upload' ? 'Cargar' : 'Descargar'
})
</script>