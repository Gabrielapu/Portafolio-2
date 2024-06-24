<template>
  <BaseModal
    :value="modelValue"
    title="Activar escenario"
    subtitle="¿Estás seguro de que quieres activar el escenario?"
    @close="emit('update:modelValue', false)"
  >
    <template #content>
      <p class="text-lg text-slate-500">Escenario {{ scenario.name }}, 
        modificado el 
        {{ dayjs(scenario.updated_at).format('DD MMM, YYYY') }}
      </p>
    </template>
    <template #actions>
      <Button
        width="full"
        color="primary"
        :label="loadingBtn ? 'Activando...' : 'Activar'"
        size="lg"
        icon-size="lg"
        uppercase
        :icon="'uil:check-circle'"
        :disabled="loadingBtn"
        :loading="loadingBtn"
        @click.native="emit('activateScenario', scenario.id)"
      />
    </template>
  </BaseModal>
</template>

<script setup>
const props = defineProps({
  scenario: { type: Object, default: () => {} },
  modelValue: { type: Boolean, default: false },
  loadingBtn: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue', 'activateScenario'])
const dayjs = inject('dayjs')
</script>