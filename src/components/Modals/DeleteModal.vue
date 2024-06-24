<template>
  <BaseModal
    :value="modelValue"
    :title="`Eliminar ${label}`"
    :subtitle="`Borrar totalmente el registro de ${label}`"
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
        width="full"
        color="danger"
        label="Eliminar"
        uppercase
        icon="uil:trash"
        class="mr-2"
        :loading="loading"
        @click.native="deleteItem"
      />
    </template>
  </BaseModal>
</template>

<script>
export default {
  name: 'DeleteModal',
  props: {
    modelValue: { type: Boolean, default: false, required: true },
    currentItem: { type: Object, default: () => {} },
    label: { type: String, default: ''},
    storeName: { type: Object, default: () => {}},
    deleteMethod: { type: String, default: () => {}}
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
        this.itemName = this.currentItem?.name || this.currentItem?.email || this.currentItem?.description
      }
    },
  },
  methods: {
    closeModal(reload) {
      this.$emit('update:modelValue', !this.modelValue)
      if (reload) {
        this.$emit('reload')
        return
      }
      
    },
    async deleteItem() {
      try {
        this.loading = true
        await this.storeName[this.deleteMethod](this.currentItem.id)
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
