<template>
  <BaseHeader
    :title="title"
    :subtitle="subtitle"
  >
    <template #actions>
      <Button
        class="ml-2"
        color="primary"
        label="descargar todos los resultados"
        uppercase
        icon="uil:download-alt"
        :disabled="disabledButton"
        :loading="loading"
        @click.native="emit('download')"
      />
    </template>
  </BaseHeader>
</template>

<script setup>
const emit = defineEmits(['download'])
const props = defineProps({
  title: { type: String, required: true },
  subtitle : { type: String, required: false },
  loading: { type: Boolean, default: false },
  disabledButton: { type: Boolean, default: false },
})

</script>