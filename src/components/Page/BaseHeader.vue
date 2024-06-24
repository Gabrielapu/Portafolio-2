<template>
  <header>
    <div class="flex flex-row">
      <div>
        <h1 class="text-slate-700">{{ title }}</h1>
        <h2 v-if="subtitle !== ''" class="text-slate-600">{{ subtitle }}</h2>
      </div>
      <div
        v-if="hasActionsSlot"
        class="flex flex-row items-center justify-end grow"
      >
        <slot name="actions"></slot>
      </div>
    </div>
    <Divider v-if="hasDivider" class="mt-2" />
  </header>
</template>

<script setup>
  const props = defineProps({
    title: { type: String, default: '', required: true },
    subtitle: { type: String, default: '', required: false },
    hasDivider: { type: Boolean, default: true, required: false },
  })

  const slots = useSlots()
  
  const hasActionsSlot = computed(() =>  {
    return !!slots.actions
  })

</script>
