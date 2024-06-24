<template>
  <BaseModal
    :value="modelValue"
    title="Nueva planificación"
    subtitle="Crear una nueva planificación"
    @close="closeModal()"
  >
    <template #content>
      <BaseForm id="create-planning-form" @submit="createNewPlanning">
        <template #form-inputs>
          <InputValidateField
            v-model="planningName"
            size="md"
            label-text="Nombre de planificación"
            placeholder-text="Planificación"
            name="nombre de planificacion"
            type="text"
            :rules="['required', 'max:255']"
          />
        </template>
        <template #form-actions="{ validate, valid, reset }">
          <Divider class="mt-8 mb-4" />
          <Button
            form="create-planning-form"
            size="md"
            width="full"
            color="primary"
            label="Crear"
            uppercase
            icon="uil:plus"
            :loading="loading"
            @click.native="validate"
          />
        </template>
      </BaseForm>
    </template>
  </BaseModal>
</template>

<script>
export default {
  name: 'ManagePlanification',
  inject: ['dayjs'],
  props: {
    modelValue: { type: Boolean, default: false, required: true },
  },
  setup() {
    const pStore = usePlanificationStore()
    return { pStore }
  },
  data() {
    return {
      loading: false,
      planningName: '',
      planningDate: '',
    }
  },
  methods: {
    closeModal(reload) {
      this.$emit('update:modelValue', !this.modelValue)
      this.resetValues()
      this.$emit('clearUser')
      if (reload) {
        this.$emit('reload')
      }
    },
    resetValues() {
      this.planningName = ''
    },
    async createNewPlanning(values, actions) {
      try {
        this.loading = true

        const payload = {
          name: this.planningName,
        }

        await this.pStore.addPlanification(payload)

        actions.resetForm()
        this.closeModal(true)
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style></style>
