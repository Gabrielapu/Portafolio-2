<template>
  <BaseModal
    :value="modelValue"
    title="Nuevo escenario"
    subtitle="Crear nuevo esceario"
    @close="closeModal(false)"
  >
    <template #content>
      <BaseForm id="create-form" @submit="createNewItem">
        <template #form-inputs>
          <InputValidateField
            v-model="name"
            size="md"
            label-text="Nombre del escenario"
            placeholder-text="Nombre"
            name="nombre"
            type="text"
            :rules="['required', 'max:255']"
          />
        </template>
        <template #form-actions="{ validate, valid, reset }">
          <Divider class="mt-8 mb-4" />
          <Button
            form="create-form"
            size="md"
            width="full"
            color="primary"
            label="Crear escenario"
            uppercase
            icon="uil:save"
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
  name: 'CreateScenario',
  props: {
    modelValue: { type: Boolean, default: false, required: true }
  },
  setup() {
    const sStore = useScenarioStore()
    return { sStore }
  },
  data() {
    return {
      loading: false,
      name: '', 
    }
  },
  methods: {
    closeModal(reload) {
      this.$emit('update:modelValue', !this.modelValue)
      this.resetValues()
      if (reload) {
        this.$emit('reload')
      } 
    },
    resetValues() {
      this.name = ''
    },
    async createNewItem(values, actions) {
      try {
        this.loading = true

        const payload = {
          name: this.name,
          planification: this.$route.params.planification_id
        }
        await this.sStore.addScenario(payload)
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
