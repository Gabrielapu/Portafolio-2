
<template>
  <div class="flex flex-col">
    <div class="p-8 border rounded border-slate-200 
      bg-white shadow-md max-w-sm w-[384px]"
    >
      <div class="form-header flex flex-col items-center">
        <!-- <img src="../../assets/logo.png" class="max-h-8 mb-4" alt="logo" /> -->
        <h1 class="text-center  text-company-secondary-variant">{{form.title}}</h1>
        <h2 class="text-center text-company-secondary">{{form.subtitle}}</h2>
      </div>
      <div class="form-inputs mt-8 mb-4">
        <BaseForm id="login-form" @submit="callFn(form.function)">
          <template #form-inputs>
            <component 
              v-for="(field, index) in form.fields" 
              :is="field.component"
              :key="index"
              v-model="field.value"
              class="mb-2"
              :name="field.name"
              :hide-label="field.hideLabel"
              :field-type="getFieldType(field.type)"
              :label="field.label"
              :placeholder-text="field.placeholder || ''"
              :size="field.size"
              :start-icon="field.startIcon"
              :rules="field.rules"       
            />
  
            <span v-if="error" class="block text-sm text-center text-red-600 mt-1">
              {{error}}
            </span>
            <div v-if="passwordErrors.length">
              <span 
                v-for="error, index in passwordErrors" :key="index" 
                class="block text-left text-sm text-red-600"
              >
                {{error}}
              </span>
            </div>
  
            <div 
              class="text-slate-400 text-center hover:text-slate-600 
              transition-all duration-75 full-center cursor-pointer">
              <BaseIcon 
                v-if="form.small_action.text === 'Volver'" class="mt-3 mr-1" small name="uil:arrow-left" 
              />
              <small 
                class="text-sm text-company-secondary-variant mt-3" 
                @click="callFn(form.small_action.action)"
              >
                {{form.small_action.text}}
              </small>          
            </div>
            
          </template>
          <template #form-actions="{ validate }">
            <Button
              form="login-form"
              size="lg"
              width="full"
              color="primary"
              :label="loading ? form.button_data.loading_text : form.button_data.text"
              uppercase
              icon="fe:login"
              class="mr-2 mt-4"
              :loading="loading"
              @click.native="validate"
            />
          </template>
        </BaseForm>
      </div>
    </div>
    <Alert 
      v-if="showAlert" 
      class="mt-3" 
      color="success"  
      title="La contraseña se modifico con éxito"
      @click="showAlert = false"
    />
  </div>
</template>

<script setup>

const router = useRouter()
const store = useSessionStore()

const props = defineProps({
  form: { type: Object, default: () => {}},
  setLoginForm: { type: Function, default: () => {}},
  setResetPasswordFormWithEmail: { type: Function, default: () => {}},
  setResetPasswordFormWithCode: { type: Function, default: () => {}},
  setUpdatePasswordForm: { type: Function, default: () => {}},
})

const error = ref('')
const loading = ref(false)
const showPassword = ref(false)
const code = ref('')
const passwordErrors = ref([])
const showAlert = ref(false)

const getIcon = computed(() => {
  if(props.form.name === 'updatePasswordForm') {
    return showPassword.value ? 'eye-outline' : 'eye-off-outline'
  }
  return ''
})

const callFn = async (fn) => {
  if(fn === 'setResetPasswordFormWithEmail') {
    error.value = ''
    props.setResetPasswordFormWithEmail()
    return
  }
  if(fn === 'setResetPasswordFormWithCode') {
    error.value = ''
    props.setResetPasswordFormWithCode()
    return
  }
  if(fn === 'setUpdatePasswordForm') {
    error.value = ''
    props.setUpdatePasswordForm()
    return
  }
  if(fn === 'setLoginForm') {
    error.value = ''
    props.setLoginForm()
    return
  }
  if(fn === 'userLogin') {
    userLogin()
    return
  }
  if(fn === 'sendEmailWithCode') {
    sendEmailWithCode()
    return
  }
  if(fn === 'sendCode') {
    sendCode()
    return
  }
  if(fn === 'updatePassword') {
    updatePassword()
    return
  }
}

const getFieldType = (fieldType) => {
  if(props.form.name === 'updatePasswordForm') {
    return showPassword.value ? 'text' : 'password'
  }
  return fieldType
}

const userLogin = async () => {
  if(loading.value) return;
  error.value = ''
  loading.value = true
  const loginData = {
    email: props.form.fields[0].value,
    password: props.form.fields[1].value,
  }
  const status = await store.login(loginData)
  if(status !== 200) {
    error.value = 'Credenciales inválidas'
    loading.value = false
    return;
  }
  router.push('/')
}

const sendEmailWithCode = async () => {
  error.value = ''
  const email = props.form.fields.find(field => field.type === 'email').value
  loading.value = true
  const respError = await store.sendCodeToEmail(email)
  loading.value = false
  if(respError) {
    error.value = 'El correo no existe en nuestra base de datos'
    return
  }
  props.setResetPasswordFormWithCode()
}

const sendCode = async() => {
  error.value = ''
  loading.value = true
  code.value = props.form.fields.find(field => field.label === 'Código').value
  const respError = await store.sendCodeToBeValidated({code: code.value})
  loading.value = false
  if(respError) {
    error.value = 'El código es incorrecto'
    return
  }
  props.setUpdatePasswordForm()
}

const updatePassword = async () => {
  error.value = ''
  if(props.form.name === 'updatePasswordForm') {
    if(props.form.fields[0].value !== props.form.fields[1].value) {
      error.value = 'Las contraseñas deben coincidir'
      return 
    }
  }
  loading.value = true
  const newPassword = props.form.fields[0].value
  const respError = await store.sendNewPassword({ newPassword, code: code.value })
  loading.value = false
  if(respError) {
    passwordErrors.value = respError.response.data.password
    return;
  }
  passwordErrors.value = []
  showAlert.value = true
  props.setLoginForm()
}
</script>