<template>
  <div class="button-wrapper" :class="wrapperClassNames">
    <button
      v-if="!link"
      :form="form"
      class="flex flex-row items-center justify-center 
         transition-all ease-in-out"
      :class="buttonClassNames"
      :disabled="disabled"
    >
      <BaseIcon 
        v-if="icon || loading" 
        :class="iconClassNames" 
        :name="loading ? 'uil:spinner-alt': icon " 
        :size="icon_sizes[iconSize]" 
      />
      <p v-if="!iconOnly" :class="{ 'ml-1': loading }"> {{ label }} </p>
    </button>
    <RouterLink
      v-else
      class="flex flex-row items-center justify-center 
        transition-all ease-in-out"
      :class="buttonClassNames"
      :disabled="disabled"
      :to="link"
    >
      <BaseIcon 
        :class="iconClassNames" 
        :name="loading ? 'uil:spinner-alt': icon " 
        :size="icon_sizes[iconSize]" 
      />
      <p v-if="!iconOnly"> {{ label }} </p>
    </RouterLink>
  </div>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    size: {
      type: String,
      default: 'md',
      validator(sizeValue) {
        return ['sm', 'md', 'lg' ].includes(sizeValue)
      },
    },
    iconSize: {
      type: String,
      default: 'md',
      validator(sizeValue) {
        return ['sm', 'md', 'lg' ].includes(sizeValue)
      } 
    },
    width: {
      type: String,
      default: 'fit',
      validator(sizeValue) {
        return ['fit', 'full'].includes(sizeValue)
      },
    },
    color: {
      type: String,
      default: 'default',
      validator(colorValue) {
        return ['default', 'primary', 'success', 'warning', 'danger'].includes(colorValue)
      },
    },
    link: { type: String, default: '' },
    form: { type: String, default: '' },
    icon: { type: String, default: '' },
    label: { type: String, default: '' },
    shadow: { type: Boolean, default: true },
    loading: { type: Boolean, default: false },
    rounded: { type: Boolean, default: true },
    outlined: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    iconOnly: { type: Boolean, default: false },
    textOnly: { type: Boolean, default: false },
    uppercase: { type: Boolean, default: false },
  },
  data() {
    return {
      sizes: {
        sm: 'py-0.5 px-1 text-xs font-medium h-6',
        md: 'py-1 px-2 text-sm font-medium h-8' ,
        lg: 'py-2 px-4 text-md font medium h-10',
      },
      icon_sizes: {
        sm: '14',
        md: '18',
        lg: '20',
      },
      variants: {
        default: 'bg-slate-white border border-slate-300 text-slate-600 hover:bg-slate-50',
        primary: 'bg-company-secondary border border-company-secondary-variant'+
          ' text-white hover:bg-company-secondary-variant',
        success: 'bg-green-600 border border-green-700 text-green-50 hover:bg-green-700',
        warning: 'bg-yellow-500 border border-yellow-600 text-yellow-50 hover:bg-yellow-600',
        danger: 'bg-red-500 border border-red-600 text-red-50 hover:bg-red-600',
      },
      outlined_variants: {
        primary: 'text-company-secondary-variant border border-company-secondary-variant'+
          ' bg-blue-50 hover:bg-blue-100',
        success: 'text-green-600 border border-green-600 bg-green-50 hover:bg-green-100',        
        warning: 'text-yellow-500 border border-yellow-500 bg-yellow-100 hover:bg-yellow-200',
        danger: 'text-red-500 border border-red-500 bg-red-50 hover:bg-red-100',
      },
      only_text_variants: {
        default: 'text-slate-600',
        primary: 'text-company-secondary bg-slate-50 border-0 font-bold',
        success: 'text-green-600',
        warning: 'text-yellow-600',
        danger: 'text-red-600',
      },
      disabled_variants: {
        default: 'bg-white text-slate-300',
        primary: 'bg-blue-200 text-white',
        success: 'bg-green-50 text-green-300',
        warning: 'bg-yellow-100 text-yellow-400',
        danger: 'bg-red-200 text-red-50',
      },
      disabled_outlined_variants: {
        primary: 'text-blue-200 bg-blue-100 border border-blue-200',
        success: 'text-green-300 bg-green-100 border border-green-300',
        warning: 'text-yellow-200 bg-yellow-50 border border-yellow-200',
        danger: 'text-red-300 bg-red-100 border border-red-300',        
      }
    }
  },
  computed: {
    wrapperClassNames() {
      return {
        'w-full': this.width === 'full'
      }
    },
    buttonClassNames() {
      return {
        'uppercase': this.uppercase,
        'rounded-[4px]': this.rounded,
        'shadow-md': this.shadow,
        'w-full': this.width === 'full',
        [this.sizes[this.size]]: !this.iconOnly,
        [this.variants[this.color]]: !this.outlined && !this.disabled && !this.iconOnly && !this.textOnly,
        [this.outlined_variants[this.color]]: this.outlined && !this.disabled,
        [this.disabled_variants[this.color]]: this.disabled && !this.outlined,
        [this.only_text_variants[this.color]]: this.textOnly,
        [this.disabled_outlined_variants[this.color]]: this.disabled && this.outlined
      }
    },
    iconClassNames() {
      return {
        'mr-0': this.iconOnly,
        'animate-spin': this.loading,
        'mr-1.5': !!this.icon && !this.iconOnly
      }
    },
  },
}
</script>