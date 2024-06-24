<template>
  <div>
    <slot name="content"></slot>
  </div>
</template>

<script>
export default {
  name: 'ContentTabContent',
  data() {
    return {
      active: false,
    }
  },
}
</script>

<style lang="scss" scoped></style>
