<template>
  <!-- <ApexCharts
    width="100%"
    :height="chartHeight"
    type="bar"
    :options="options"
    :series="series"
  /> -->
</template>

<script>
export default {
  name: 'ContentGraph',
  props: {
    fullScreen: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object,
      default: () => {},
    },
    series: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    chartHeight() {
      let height = '100%'
      if (!this.fullScreen) height = '320px'
      return height
    },
  },
}
</script>

<style lang="scss" scoped></style>
