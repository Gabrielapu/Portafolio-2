<template>
  <div class="nav-wrapper fixed top-0 left-0 w-full z-10">
    <nav
      class="fixed flex w-full box-border items-center justify-between px-14 h-16 border-b z-30 bg-white border-slate-200 shadow-sm"
    >
      <div class="flex flex-row items-center"></div>
      <div class="user-menu flex flex-row items-center z-20">
        <div
          class="user-icon flex content-center mr-2 p-2 rounded-full bg-blue-500 fill-white"
        >
          <BaseIcon
            v-if="userAvatar === ''"
            name="uil:user"
            size="24"
            class="text-white"
          />
          <img v-else :src="userAvatar" alt="avatar de usuario" />
        </div>
        <p class="mr-2 text-slate-600">{{ username }}</p>
        <button
          class="flex content-center cursor-pointer transition-all ease-in-out duration-50"
          :class="arrowIconClassNames"
          @click="open = !open"
        >
          <BaseIcon name="uil:angle-down" size="32" class="text-slate-600" />
        </button>
      </div>
    </nav>
    <Transition name="fade">
      <NavDropdown :open="open" @close="open = !open" />
    </Transition>
  </div>
</template>

<script>
export default {
  name: 'AppBar',
  data() {
    return {
      userAvatar: '',
      open: false,
    }
  },
  computed: {
    username() {
      return JSON.parse(localStorage.getItem('userEmail'))
    },
    arrowIconClassNames() {
      let iconClass = 'scale-100'
      if (this.open) iconClass = '-scale-100'
      return iconClass
    },
  },
}
</script>

