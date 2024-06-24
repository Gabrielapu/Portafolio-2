<template>
  <div
    class="nav-dropdown w-60 max-h-20 absolute top-16 right-8 ease-in-out transition-all duration-300 z-20 rounded-b border-x border-b bg-white"
    :class="open ? 'translate-y-0 shadow-md' : '-translate-y-full'"
  >
    <div class="flex flex-col w-full p-3">
      <div
        class="flex flex-row items-center cursor-pointer fill-slate-600 hover:fill-blue-500 text-slate-600 hover:text-blue-500"
        @click="logout"
      >
        <BaseIcon name="fe:logout" size="16" class="mr-2" />
        <p>Cerrar sesión</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavDropdown',
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const sStore = useSessionStore()

    return { sStore }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    goToUserMaintainer() {
      this.$router.push('/users')
      this.closeDropdown()
    },
    closeDropdown() {
      if (this.open) this.$emit('close')
    },
    async logout() {
      await this.sStore.logout()
      this.$router.push('/login')
    },
  },
}
</script>
