<template>
  <BaseModal
    :value="modelValue"
    :title="`Subir archivo de ${label}`"
    :subtitle="`Cargar un archivo .xlsx para actualizar ${label}`"
    @close="closeModal()"
  >
    <template #content>
      <div
        class="upload-area flex flex-col items-center justify-center px-2 py-8 rounded border-2 border-dashed border-blue-500 bg-white"
        :class="{ 'bg-blue-50': dragover }"
        @drop.prevent="onDrop($event)"
        @dragover.prevent="dragover = true"
        @dragenter.prevent="dragover = true"
        @dragleave.prevent="dragover = false"
      >
        <BaseIcon name="uil:upload" size="32" class="mb-4 text-slate-400" />
        <p class="text-center text-slate-500">
          Arrastre un archivo .xlsx acá o haga
          <b
            class="cursor-pointer text-blue-500"
            :disabled="uploadedFiles.length >= 1"
            :loading="isSelecting"
            @click="handleFileImport"
          >
            click aquí
          </b>
          para subir un archivo
        </p>
        <input
          ref="uploader"
          class="hidden"
          type="file"
          :accept="allowedFormats.join(',')"
          @change="onFileChanged"
        />
        <div v-if="uploadedFiles.length >= 1">
          <Divider class="mt-8 mb-4" />
          <div
            v-for="file in uploadedFiles"
            :key="file.name"
            class="full-center"
          >
            <p class="mr-2 text-slate-500">
              {{ getFileName(file.name) }}
            </p>
            <BaseIcon
              name="uil:times-circle"
              size="24"
              class="cursor-pointer text-slate-500 hover:text-blue-500"
              @click.stop="removeFile(file.name)"
            />
          </div>
        </div>
      </div>
    </template>
    <template #actions>
      <Button
        size="md"
        width="full"
        color="primary"
        label="subir archivo"
        uppercase
        icon="uil:upload"
        :disabled="buttonDisabled"
        :loading="loading"
        @click.native="uploadFile"
      />
    </template>
  </BaseModal>
</template>

<script>
export default {
  name: 'UploadModal',
  props: {
    modelValue: { type: Boolean, default: false, required: true },
    storeName: { type: Object, default: () => {} },
    label: { type: String, default: '' },
    error: { 
      type: String, 
      default: 'Ocurrió un error al cargar el archivo, '+
        'puede que este duplicado el nombre' 
    }
  },
  data() {
    return {
      loading: false,
      dragover: false,
      isSelecting: false,
      uploadedFiles: [],
      allowedFormats: [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
        'text/csv'
      ],
    }
  },
  computed: {
    buttonDisabled() {
      let state = true
      this.uploadedFiles.length <= 0 ? (state = true) : (state = false)
      return state
    },
  },
  watch: {
    modelValue(newModelValue) {
      if (newModelValue) {
        this.uploadedFiles.length = 0
      }
    },
  },
  methods: {
    closeModal(reload) {
      this.loadingFile = false
      this.uploadedFiles = []

      this.$emit('update:modelValue', !this.modelValue)
      if (reload) {
        this.$emit('reload')
      }
    },
    getFileName(fileName) {
      const name = fileName.length > 40 
        ? `${fileName.slice(0, 40)}...` 
        : fileName
      return name
    },
    handleFileImport() {
      this.isSelecting = true
      window.addEventListener('focus', () => {
          this.isSelecting = false
        }, { once: true }
      )
      this.$refs.uploader.click()
    },
    onFileChanged(event) {
      if (event.target.files.length > 1 || this.uploadedFiles.length >= 1) {
        this.$toast.warning('Solo se permite subir un archivo.')
      } else if (
        !this.allowedFormats.includes(event.target.files[0].type)
      ) {
        this.$toast.warning('Solo se permiten archivos .xlsx y .csv')
      } else {
        this.uploadedFiles.push(event.target.files[0])
      }
    },
    onDrop(event) {
      this.dragover = false

      if (
        event.dataTransfer.files.length > 1 ||
        this.uploadedFiles.length >= 1
      ) {
        this.$toast.warning('Solo se permite subir un archivo.')
      } else if (
        !this.allowedFormats.includes(event.dataTransfer.files[0].type)
      ) {
        this.$toast.warning('Solo se permiten archivos .xlsx y .csv')
      } else {
        this.uploadedFiles.push(event.dataTransfer.files[0])
      }
    },
    removeFile(fileName) {
      const index = this.uploadedFiles.findIndex(
        (file) => file.name === fileName
      )
      if (index > -1) this.uploadedFiles.splice(index, 1)
    },
    async uploadFile() {
      this.loading = true
      const type = useProductTypes[this.$route.params.type]?.id
      const status = await this.storeName.uploadFile(
        this.$route.params.scenario_id, 
        this.uploadedFiles[0],
        type
      )

      if(status !== 200){
        this.$toast.error(this.error)
        this.loading = false
        return
      }

      this.$toast.success('Archivo cargado con éxito')
      this.closeModal(true)
      this.loading = false
    },
  },
}
</script>

