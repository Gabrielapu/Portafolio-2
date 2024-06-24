<template>
  <div class="base-modal">
    <!-- overlay de modal -->
    <transition name="fade" appear>
      <div
        v-if="value"
        class="overlay fixed top-0 left-0 z-40 w-screen h-screen bg-black/50"
      ></div>
    </transition>
    <!-- contenido de modal -->
    <transition name="pop" appear>
      <div
        v-if="value"
        ref="modal"
        role="dialog"
        class="modal fixed top-0 left-0 right-0 bottom-0 m-auto z-50 p-4 rounded shadow-md bg-white"
        :class="modalClassNames"
        tabindex="0"
        @keydown.esc="closeModal"
      >
        <div
          class="modal-header flex flex-row items-start justify-between pt-2 pb-4"
        >
          <div class="flex flex-row">
            <div v-if="icon !== ''" class="mr-2">
              <BaseIcon :name="icon" size="24" />
            </div>
            <div>
              <h1 class="text-slate-600">{{ title }}</h1>
              <h2 class="text-slate-400">{{ subtitle }}</h2>
            </div>
          </div>
          <button
            v-if="!fullScreen"
            class="cursor-pointer fill-slate-500 hover:fill-slate-600 transition-colors duration-75"
            @click="closeModal"
          >
            <BaseIcon name="uil:times" size="32" />
          </button>
          <Button
            v-else
            size="sm"
            color="default"
            icon="uil:compress-alt"
            icon-only
            @click.native="closeModal"
          />
        </div>
        <Divider v-if="hasContentSlot" />
        <div
          v-if="hasContentSlot"
          :class="modalContentSlotClassNames"
          tabindex="1"
        >
          <slot name="content" />
        </div>
        <Divider v-if="hasActionsSlot" />
        <div v-if="hasActionsSlot" class="mt-4 flex flex-row">
          <slot name="actions" tabindex="2" />
        </div>
        <div v-if="hasExtrasSlot" tabindex="3">
          <slot name="extras" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'BaseModal',
  props: {
    value: { type: Boolean, default: false, required: true },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    icon: { type: String, default: '' },
    fullScreen: { type: Boolean, default: false },
  },
  data() {
    return {
      test: false,
    }
  },
  computed: {
    hasContentSlot() {
      return !!this.$slots.content
    },
    hasActionsSlot() {
      return !!this.$slots.actions
    },
    hasExtrasSlot() {
      return !!this.$slots.extras
    },
    modalClassNames() {
      let classNames = ''

      if (this.fullScreen) {
        classNames =
          'w-[calc(100vw-2rem)] min-w-min h-[calc(100vh-2rem)] min-h-min'
      } else {
        classNames = 'w-96 min-w-min h-fit'
      }

      return classNames
    },
    modalContentSlotClassNames() {
      let classNames = ''

      if (this.fullScreen) classNames = 'h-[calc(100%-2rem)] '

      if (this.hasActionsSlot) {
        classNames += 'py-4 '
      }

      return classNames
    },
  },
  watch: {
    value(newValue) {
      if (newValue) this.focusElement()

      // if (process.client) {
      //   if (newValue) document.body.style.setProperty('overflow', 'hidden')
      //   else document.body.style.removeProperty('overflow')
      // }
    },
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    focusElement() {
      this.$nextTick(() => this.$refs.modal.focus())
    },
  },
}
</script>