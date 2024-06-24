<template>
  <div
    class="tab-option px-4 py-2 flex border-b 
      cursor-pointer transition-all duration-75 font-medium"
    :class="tabOptionClassNames"
  >
    <BaseIcon v-if="icon !== ''" :name="icon" class="mr-2" />
    <p>{{ name }}</p>
  </div>
</template>

<script>
export default {
  name: 'ContentTabOption',
  props: {
    name: { type: String, default: '' },
    icon: { type: String, default: '' },
  },
  data() {
    return {
      active: false,
    }
  },
  computed: {
    tabOptionClassNames() {
      return {
        'fill-slate-600 text-slate-600 border-slate-200': !this.active,
        'hover:text-company-secondary hover:border-company-secondary': !this.active,
        'text-company-secondary border-b-company-secondary': this.active
      }
    },
  },
  methods: {
    setActive() {
      this.active = true
    },
    setInactive() {
      this.active = false
    },
  },
}
</script>

<style lang="scss" scoped></style>
