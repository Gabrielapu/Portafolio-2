<template>
  <div
    class="content-card p-6 border rounded bg-white border-slate-200"
    :class="cardClassNames"
  >
    <slot name="content"></slot>
  </div>
</template>

<script>
export default {
  name: 'ContentCard',
  props: {
    direction: {
      type: String,
      default: 'row',
      validator(sizeValue) {
        return ['row', 'col'].includes(sizeValue)
      },
    },
  },
  data() {
    return {
      directions: {
        row: 'flex flex-row',
        col: 'flex flex-col',
      },
    }
  },
  computed: {
    cardClassNames() {
      const classNames = this.directions[this.direction]
      return classNames
    },
  },
}
</script>

<style lang="scss" scoped></style>
