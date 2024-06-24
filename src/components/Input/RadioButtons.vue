<template>
  <div class="radio-wrapper">
    <label class="text-slate-400" :class="labelClassNames">{{ label }}</label>
    <div class="options" :class="wrapperClassNames">
      <div
        v-for="(option, i) in options"
        :key="i"
        class="radio-option"
        :class="optionClassNames"
      >
        <label class="grid gap-2 cursor-pointer">
          <input
            :name="name"
            :value="option.id"
            type="radio"
            class="grid place-content-center mt-1 appearance-none w-4 h-4 
              border rounded-full translate-y-[-0.075rem] transition-all 
              ease-in-out duration-150 border-slate-400"
            :class="inputBeforeClassNames"
            :checked="i === modelValue ? true : false"
            @click="updateValue(i)"
          />
          {{ option.label }}
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InputRadioButtons',
  props: {
    modelValue: {
      type: Number,
      default: 0,
    },
    size: {
      type: String,
      default: 'md',
      validator(sizeValue) {
        return ['md', 'sm'].includes(sizeValue)
      },
    },
    color: {
      type: String,
      default: 'primary',
      validator(colorValue) {
        return [
          'default',
          'primary',
          'success',
          'warning',
          'danger',
        ].includes(colorValue)
      },
    },
    label: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      default: () => [],
    },
    direction: {
      type: String,
      default: 'row',
      validator(direction) {
        return ['row', 'col'].includes(direction)
      },
    },
  },
  data() {
    return {
      labelSizes: {
        sm: 'label-sm ',
        md: 'label-md ',
      },
    }
  },
  computed: {
    labelClassNames() {
      const classNames = this.labelSizes[this.size]
      return classNames
    },
    optionClassNames() {
      let classNames = ''
      if (this.direction === 'row') {
        classNames += 'mr-2'
      }
      return classNames
    },
    wrapperClassNames() {
      let classNames = ''
      if (this.direction === 'row') {
        classNames += 'flex flex-row'
      } else {
        classNames += 'flex flex-col'
      }
      return classNames
    },
    inputBeforeClassNames() {
      let classNames =
        'before:w-2.5 before:h-2.5 before:rounded-full before:scale-0 before:shadow-radio '
      switch (this.color) {
        case 'deafult':
          classNames += 'before:shadow-slate-400'
          break
        case 'primary':
          classNames += 'before:shadow-blue-500'
          break
        case 'success':
          classNames += 'before:shadow-green-500'
          break
        case 'warning':
          classNames += 'before:shadow-orange-500'
          break
        case 'danger':
          classNames += 'before:shadow-red-500'
          break
      }
      return classNames
    },
  },
  methods: {
    updateValue(event) {
      this.$emit('update:modelValue', event)
    },
  },
}
</script>

<style scoped>
label {
  grid-template-columns: 1em auto;
}

input[type='radio']:checked::before {
  transform: scale(1);
}
</style>
