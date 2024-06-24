<template>
  <div class="tab-panel border rounded bg-white border-slate-200 shadow-sm">
    <div class="panel-header flex">
      <TabOption
        v-for="(option, i) in options"
        ref="options"
        :key="i"
        :name="option.name"
        :icon="option.icon"
        :color="option.color"
        @click.native="toogleActivePanel(option.tabId)"
      />
      <div class="filler grow border-b border-slate-200"></div>
    </div>
    <div class="panel-content">
      <slot name="content" :active="activePanelId"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContentTabPanel',
  props: {
    options: { type: Array,  default: () => [] },
  },
  data() {
    return {
      activePanelId: '',
      activeOption: 0
    }
  },
  mounted() {
    this.setInitialActiveOption()
  },
  methods: {
    setInitialActiveOption() {
      if (this.$refs.options.length > 0) {
        this.$refs.options[this.activeOption].setActive()
        this.activePanelId = this.options[this.activeOption].tabId
      }
    },
    toogleActivePanel(tabId) {
      for (let i = 0; i < this.$refs.options.length; i++) {
        if (tabId === this.options[i].tabId) {
          this.$refs.options[i].setActive()
          this.activePanelId = tabId
        } else {
          this.$refs.options[i].setInactive()
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
