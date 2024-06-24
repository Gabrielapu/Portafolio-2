<template>
  <div>
    <p class="text-sm test-slate-600 mb-0.5">{{ title }}</p>
    <div      
      class="upload-area flex flex-col items-center justify-center h-36 w-full
        px-2 py-6 rounded-xl border-2 border-dashed border-slate-200"
      :class="{ 
        'bg-slate-100': disabled,
        'bg-slate-100': uploadedFiles.length >= 1 || !!uploaded,
        'bg-slate-50': !disabled && !!!uploaded && uploadedFiles.length === 0 ,
        'hover:bg-blue-50': dragover 
      }"
      @drop.prevent="onDrop($event)"
      @dragover.prevent="dragover = true"
      @dragenter.prevent="dragover = true"
      @dragleave.prevent="dragover = false"      
    >
      <div v-if="!!uploaded && uploadedFiles.length === 0">
        <div class="full-center break-all ">
          <p class="mr-2 text-slate-500 pl-2 w-5/6">
            {{uploaded}}
          </p>
          <BaseIcon
            v-if="!disabled" 
            name="uil:times-circle"
            size="24"
            class="cursor-pointer text-slate-500 hover:text-blue-500 w-1/6"
            @click="uploaded = null; $emit('removeFile')" 
          />      
        </div>
      </div>
      
      <div v-else-if="uploadedFiles.length === 0" class="full-center flex-col">
        <BaseIcon name="uil:upload" size="32" class="mb-4 text-slate-400" />
        <p class="text-center text-slate-500">
          Arrastre un archivo .xlsx acá o haga <br />
          <b 
            v-if="!disabled"
            class="cursor-pointer text-blue-500"
            :disabled="uploadedFiles.length >= 1"
            :loading="isSelecting"      
            @click="handleFileImport"    
          >
            click aquí
          </b>
          <b v-else class="text-blue-200">
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
      </div>
      <div v-else-if="uploadedFiles.length >= 1">
        <div v-for="file in uploadedFiles" :key="file.name" class="full-center">
          <p class="mx-2 text-slate-500">
            {{ file.name }}
          </p>
          <BaseIcon
            v-if="!disabled" 
            name="uil:times-circle"
            size="24"
            class="cursor-pointer text-slate-500 hover:text-blue-500"
            @click.stop="removeFile(file.name)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UploadFile',
  inject: ['toast'],
  props: {
    title: { type: String, default: '' },
    error: { 
      type: String, 
      default: 'Ocurrió un error al cargar el archivo, '+
        'puede que este duplicado el nombre' 
    },
    disabled: { type: Boolean, default: false },
    uploaded: { type: String, default: null },
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
  methods: {
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
        this.toast.warning('Solo se permite subir un archivo.')
      } else if (!this.allowedFormats.includes(event.target.files[0].type)) {
        this.toast.warning('Solo se permiten archivos .xlsx y .csv')
      } else {
        this.uploadedFiles.push(event.target.files[0])
        this.$emit('update:modelValue', this.uploadedFiles[0])
      }
    },
    onDrop(event) {
      this.dragover = false
      if (event.dataTransfer.files.length > 1 || this.uploadedFiles.length >= 1) {
        this.toast.warning('Solo se permite subir un archivo.')
      } else if (!this.allowedFormats.includes(event.dataTransfer.files[0].type)) {
        this.toast.warning('Solo se permiten archivos .xlsx y .csv')
      } else {
        this.uploadedFiles.push(event.dataTransfer.files[0])
        this.$emit('update:modelValue', this.uploadedFiles[0])
      }
    },
    removeFile(fileName) {
      const index = this.uploadedFiles.findIndex(
        (file) => file.name === fileName
      )
      if (index > -1) this.uploadedFiles.splice(index, 1)
      this.$emit('update:modelValue', null)
    },
  },
}
</script>

