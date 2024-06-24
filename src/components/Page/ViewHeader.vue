<template>
  <BaseHeader
    :title="title"
    :subtitle="subtitle"
  >
    <template #actions>
      <div class="w-60">
        <slot name="filters"></slot>
      </div>
      <Button
        v-if="!hideDownloadTemplateButton"
        class="mr-2"
        color="default"
        label="Descargar plantilla"
        uppercase
        icon="uil:download-alt"
        @click.native="emit('openModal', 'download')"
      />
      <Button
        v-if="!hideUploadTemplateButton"
        color="default"
        label="Subir plantilla"
        uppercase
        icon="uil:upload"        
        @click.native="emit('openModal', 'upload')"
      />      
      <Button
        v-if="!hideNewItemButton"
        class="ml-2"
        color="primary"
        :label="newItemLabel"
        uppercase
        icon="uil:plus"
        @click.native="emit('newItem')"
      />
    </template>
  </BaseHeader>
</template>

<script setup>
const emit = defineEmits(['newItem', 'openModal'])
const props = defineProps({
  title: { type: String, required: true },
  subtitle : { type: String, required: false },
  newItemLabel: { type: String },
  hideNewItemButton: { type: Boolean, default: false },
  hideDownloadTemplateButton: { type: Boolean, default: false },
  hideUploadTemplateButton: { type: Boolean, default: false }
})

</script>