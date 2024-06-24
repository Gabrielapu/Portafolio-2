<template>
  <div
    v-click-outside="closeOptions"
    class="input-select w-full relative inline-block"
  >
    <label
      v-if="labelText !== ''"
      class="text-slate-600"
      :class="labelClassNames"
    >
      {{ labelText }}
    </label>
    <div
      class="selection-field w-full min-w-fit flex flex-row items-center justify-between px-2 border shadow-sm bg-white border-slate-200 text-slate-500 cursor-pointer"
      :class="selectClassNames"
      @click="open = !open"
    >
      <div class="left-content flex flex-row items-center">
        <BaseIcon
          v-if="startIcon"
          :name="startIcon"
          class="mr-2 fill-slate-600"
        />
        <span class="text-slate-500">
          {{ value }}
        </span>
        <ContentBadge
          v-if="multipleCounter > 1"
          size="sm"
          color="default"
          :label="`+${multipleCounter - 1}`"
          class="ml-2"
        />
      </div>
      <button
        class="transition-all ease-in-out duration-50"
        :class="arrowIconClassNames"
      >
        <BaseIcon name="angle-down" size="32" class="fill-slate-600" />
      </button>
    </div>
    <transition name="fade">
      <div
        v-if="open"
        class="select-options absolute w-full rounded-b border-x border-b border-slate-200 bg-white shadow-md z-10"
      >
        <InputSelectOption
          v-for="(option, i) in options"
          :key="i"
          v-model="option.state"
          :name="option.name"
          :start-icon="option.icon"
          @click.native="optionSelection(i)"
        />
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'InputAutoSelect',
  props: {
    size: {
      type: String,
      default: 'md',
      validator(sizeValue) {
        return ['md', 'sm'].includes(sizeValue)
      },
    },
    labelText: {
      type: String,
      default: '',
    },
    startIcon: {
      type: String,
      default: 'circle',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      labelSizes: {
        sm: 'label-sm',
        md: 'label-md',
      },
      selectSizes: {
        sm: 'field-sm h-8 ',
        md: 'field-md h-11 ',
      },
      open: false,
    }
  },
  computed: {
    hasSelection() {
      let state = false
      this.options.forEach((option) => {
        if (option.state) {
          state = true
        }
      })
      return state
    },
    value() {
      let currentValue = ''
      if (this.hasSelection) {
        this.options.forEach((option) => {
          if (option.state) {
            currentValue = option.name
          }
        })
      } else {
        currentValue = this.labelText
      }
      return currentValue
    },
    multipleCounter() {
      let counter = 0

      this.options.forEach((option) => {
        if (option.state) {
          counter++
        }
      })

      return counter
    },
    labelClassNames() {
      const classNames = this.labelSizes[this.size]
      return classNames
    },
    selectClassNames() {
      let classNames = this.selectSizes[this.size]

      if (this.labelText !== '') {
        classNames += 'mt-1 '
      }

      if (this.open) {
        classNames += 'rounded-t '
      } else {
        classNames += 'rounded '
      }

      return classNames
    },
    arrowIconClassNames() {
      let iconClass = 'scale-100'
      if (this.open) iconClass = '-scale-100'
      return iconClass
    },
  },
  methods: {
    closeOptions() {
      if (this.open) this.open = !this.open
    },
    optionSelection(id) {
      const currentOption = this.options.find((option) => option.value === id)

      currentOption.state ? this.deselectOption(id) : this.selectOption(id)
    },
    selectOption(id) {
      if (!this.multiple) {
        // comportamiento si es que el campo de selección
        // solo permite una alternativa
        this.options.forEach((option) => {
          option.state = false
        })
      }

      const currentOption = this.options.find((option) => option.value === id)
      currentOption.state = true
    },
    deselectOption(id) {
      const currentOption = this.options.find((option) => option.value === id)
      currentOption.state = false
    },
  },
}
</script>
