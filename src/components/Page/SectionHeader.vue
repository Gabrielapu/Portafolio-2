<template>
  <div class="section-header">
    <div class="flex flex-row">
      <div class="flex flex-row">
        <BaseIcon v-if="icon !== ''" class="mr-2" :name="icon" />
        <h3 class="text-slate-600">{{ title }}</h3>
      </div>
      <div
        v-if="hasActionsSlot"
        class="flex flex-row items-center justify-end grow"
      >
        <slot name="actions"></slot>
      </div>
    </div>
    <Divider v-if="hasDivider" class="mt-2" />
  </div>
</template>

<script>
export default {
  name: 'PageSectionHeader',
  props: {
    title: {
      type: String,
      default: '',
      required: true,
    },
    icon: {
      type: String,
      default: '',
      required: false,
    },
    hasDivider: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
  computed: {
    hasActionsSlot() {
      return !!this.$slots.actions
    },
  },
}
</script>