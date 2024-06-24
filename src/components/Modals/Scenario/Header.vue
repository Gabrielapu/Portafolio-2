<template>
  <BaseHeader
    :title="title"
    :subtitle="subtitle"
  >
    <template #actions>
      <Button
        size="lg"
        color="primary"
        label="ejecutar"
        uppercase
        :disabled="disabledExecute"
        icon="uil:play"        
        :loading="loading"
        @click.native="$emit('execute')"
      />
    </template>
  </BaseHeader>
</template>

<script setup>

const props = defineProps({
  title: { type: String, required: true },
  subtitle : { type: String, required: true },
  loading: { type: Boolean, default: false },
  disabledExecute: { type: Boolean, default: false },
})

</script>