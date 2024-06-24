<template>
  <Form
    v-slot="{ validate, meta: { valid }, resetForm }"
    :id="id || false"
    @submit="onSubmit[0]"
  >
    <slot name="form-inputs"></slot>
    <slot
      name="form-actions"
      :validate="validate"
      :valid="valid"
      :reset="resetForm"
    ></slot>
  </Form>
</template>

<script setup>
import { Form } from 'vee-validate';

const props = defineProps({
  id: { type: String, default: '' }
})

const onSubmit = (values) => {
  this.$emit('submit', values)
}
</script>

<style lang="scss" scoped></style>
