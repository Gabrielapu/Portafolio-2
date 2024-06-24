<template>
  <div
    class="expansion-panel border rounded bg-white border-slate-200 shadow-sm"
  >
    <div
      class="panel-header px-4 py-2 flex flex-row items-center justify-between border-b border-slate-200 cursor-pointer"
      @click="open = !open"
    >
      <div class="flex flex-row">
        <BaseIcon v-if="icon !== ''" name="uil:circle" class="mr-2" />
        <h4>Encabezado de expansion</h4>
      </div>
      <div>
        <button
          class="transition-all ease-in-out duration-50"
          :class="arrowIconClassNames"
        >
          <BaseIcon v-if="icon !== ''" name="uil:angle-down" size="32" />
        </button>
      </div>
    </div>
    <transition name="fade">
      <div v-if="open" class="panel-content" :class="panelClassNames">
        <slot name="panelContent"></slot>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'ContentExpansionPanel',
  props: {
    title: {
      type: String,
      default: 'Encabezado de panel',
    },
    icon: {
      type: String,
      default: '',
    },
    noPadding: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      open: false,
    }
  },
  computed: {
    arrowIconClassNames() {
      let iconClass = 'scale-100'
      if (this.open) iconClass = '-scale-100'
      return iconClass
    },
    panelClassNames() {
      let classNames = ''

      if (this.noPadding) {
        classNames = ''
      } else {
        classNames = 'px-4 pt-2 pb-4'
      }

      return classNames
    },
  },
}
</script>

<style lang="scss" scoped></style>
