<template>
  <LoginBox
    :form="form"
    :set-login-form="setLoginForm"
    :set-reset-password-form-with-email="setResetPasswordFormWithEmail"
    :set-reset-password-form-with-code="setResetPasswordFormWithCode"
    :set-update-password-form="setUpdatePasswordForm"
  />
</template>

<script setup>
import InputValidateField from '@/components/Input/InputValidateField.vue'

const loginForm = {
  name: 'loginForm',
  title: 'Inicio de sesión',
  subtitle: 'Bienvenido',
  fields: [
    { 
      component: InputValidateField,
      label: 'Usuario', 
      placeholder: 'Nombre de usuario',
      type: 'text', 
      value: '',
      hideLabel: true,
      size: 'md',
      name: 'correo',
      rules: ['required', 'email'],
      startIcon: 'uil:envelope'
    },
    { 
      component: InputValidateField,
      label: 'Contraseña', 
      placeholder: 'Contraseña',
      type: 'password', 
      value: '',
      hideLabel: true,
      size: 'md',
      name: 'contraseña',
      rules: ['required'],
      startIcon: 'uil:key-skeleton'
    }
  ],
  button_data: {
    text: 'Iniciar sesión',
    loading_text: 'Iniciando sesión',
  },
  function: 'userLogin',
  small_action: {
    text: 'Olvidé mi contraseña',
    action: 'setResetPasswordFormWithEmail'
  },
}

const resetPasswordFormWithEmail = {
  name: 'resetPasswordFormWithEmail',
  title: 'Restablecer contraseña',
  subtitle: 'Se te enviará un código a tu correo ' 
    + 'electrónico para continuar con el processo',
  fields: [
    { 
      component: InputValidateField,
      label: 'Correo electrónico', 
      placeholder: 'Correo electrónico',
      type: 'email', 
      value: '',
      name: 'correo',
      startIcon: 'uil:envelope',
      rules: ['required', 'email'],
    }
  ],
  button_data: {
    text: 'Enviar código',
    loading_text: 'Enviando...',
  },
  function: 'sendEmailWithCode',
  small_action: {
    text: 'Volver',
    action: 'setLoginForm'
  },
}

const resetPasswordFormWithCode = {
  name: 'resetPasswordFormWithCode',
  title: 'Restablecer contraseña',
  subtitle: 'Escribe el código que se te envio al correo electrónico',
  fields: [
    { 
      component: InputValidateField,
      label: 'Código', 
      type: 'text', 
      value: '',
      name: 'código',
      placeholder: 'Código',
      rules: ['required'],
    }
  ],
  button_data: {
    text: 'Continuar',
    loading_text: 'Continuando...',
  },
  function: 'sendCode',
  small_action: {
    text: 'Volver',
    action: 'setResetPasswordFormWithEmail'
  }
}

const updatePasswordForm = {
  name: 'updatePasswordForm',
  title: 'Actualizar contraseña',
  fields: [
    { 
      component: InputValidateField,
      label: 'Nueva contraseña', 
      type: 'password', 
      value: '',
      name: 'contraseña nueva',
      placeholder: 'Nueva contraseña',
      rules: ['required'],
    },
    { 
      component: InputValidateField,
      label: 'Repetir contraseña', 
      type: 'password', 
      value: '',
      name: 'repetir contraseña',
      placeholder: 'Repetir nueva contraseña',
      rules: ['required'],
    }
  ],
  button_data: {
    text: 'Finalizar',
    loading_text: 'Finalizando...',
  },
  function: 'updatePassword',
  small_action: {
    text: 'Volver',
    action: 'setResetPasswordFormWithCode'
  },
}

let form = shallowRef(loginForm)

const setResetPasswordFormWithEmail = () => {
  form.value = resetPasswordFormWithEmail
}
const setResetPasswordFormWithCode = () => {
  form.value = resetPasswordFormWithCode
}
const setUpdatePasswordForm = () => {
  form.value = updatePasswordForm
}
const resetValues = () => {
  resetPasswordFormWithEmail.fields[0].value = ''
  resetPasswordFormWithCode.fields[0].value = ''
  updatePasswordForm.fields.forEach(field => {field.value = ''})
}
const setLoginForm = () => {
  resetValues()
  form.value = loginForm
}

</script>

<style scoped>
.background {
  background-image: url('@/assets/lake.png');
}
</style>