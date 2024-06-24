<template>
  <BaseModal
    :value="modelValue"
    :title="`Duplicar ${label}`"
    :subtitle="`Crear una copia de ${label} existente`"
    @close="closeModal()"
  >
    <template #content>
      <InputValidateField
        v-model="itemName"
        size="md"
        :label-text="`Nombre de ${label}`"
        :placeholder-text="`Nombre de ${label}`"
        disabled
      />
    </template>
    <template #actions>
      <Button
        size="md"
        width="full"
        color="primary"
        label="duplicar"
        uppercase
        icon="uil:copy"
        :loading="loading"
        @click.native="duplicateItem"
      />
    </template>
  </BaseModal>
</template>

<script>
export default {
  name: 'DuplicateModal',
  props: {
    modelValue: { type: Boolean, default: false, required: true },
    duplicateMethod: { type: String, default: () => {}},
    currentItem: { type: Object, default: () => {} },
    storeName: { type: Object, default: () => {}},
    label: { type: String, default: ''}
  },
  data() {
    return {
      loading: false,
      itemName: '',
    }
  },
  watch: {
    modelValue(newModelValue) {
      if (newModelValue) {
        this.itemName = this.currentItem?.name
      }
    },
  },
  methods: {
    closeModal(reload) {
      this.$emit('update:modelValue', !this.modelValue)
      if (reload) {
        this.$emit('reload')
      }
    },
    async duplicateItem() {
      this.loading = true
      const payload = {
        id: this.currentItem.id,
      }
      await this.storeName[this.duplicateMethod](payload)
      this.closeModal(true)
      this.loading = false
    },
  },
}
</script>

<style></style>
