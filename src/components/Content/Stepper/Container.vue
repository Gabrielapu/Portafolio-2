<template>
  <ContentCard>
    <template #content>
      <div class="stepper-container w-full">
        <div ref="stepsContainer" class="steps-container">
          <slot name="steps"></slot>
        </div>
        <Divider class="my-4" />
        <div class="step-counter flex items-center justify-between">
          <button
            class="flex"
            :class="backwardDisable ? 'text-slate-300' : 'hover:text-blue-500'"
            :disabled="backwardDisable"
            @click="stepBackward"
          >
            <BaseIcon
              name="fe:arrow-left"
              size="24"
              @click.stop="removeFile(file.name)"
              @click="stepBackward"
            />
            <p class="uppercase">atras</p>
          </button>
          <div class="flex">
            <div v-for="i in amountOfSteps + 1" :key="i" class="mr-2">
              <div class="px-4 py-2 rounded" :class="activeNumberClassNames(i)">
                {{ i }}
              </div>
            </div>
          </div>
          <button
            class="flex text-slate-500"
            :class="forwardDisable ? 'text-slate-300' : 'hover:text-blue-500'"
            :disabled="forwardDisable"
            @click="stepForward"
          >
            <p class="uppercase">siguiente</p>
            <BaseIcon
              name="fe:arrow-right"
              size="24"
              @click.stop="removeFile(file.name)"
              @click="stepBackward"
            />
          </button>
        </div>
      </div>
    </template>
  </ContentCard>
</template>

<script>
export default {
  name: 'ContentStepperContainer',
  data() {
    return {
      activeStep: 0,
      amountOfSteps: 0,
      variants: {
        inactive: 'bg-slate-100 text-slate-400',
        active: 'bg-blue-50 text-blue-500',
      },
    }
  },
  computed: {
    forwardDisable() {
      return this.activeStep >= this.amountOfSteps
    },
    backwardDisable() {
      return this.activeStep <= 0
    },
  },
  watch: {
    activeStep: {
      handler(newActiveStep) {
        const steps = this.$refs.stepsContainer.children
        for (let i = 0; i < steps.length; i++) {
          if (i !== newActiveStep) {
            steps[i].classList.add('hidden')
          } else {
            steps[i].classList.remove('hidden')
          }
        }
      },
    },
  },
  mounted() {
    this.getAmountOfSteps()
    this.setActiveStep()
  },
  methods: {
    activeNumberClassNames(num) {
      let classNames = this.variants.inactive
      if (num === this.activeStep + 1) classNames = this.variants.active
      return classNames
    },
    setActiveStep() {
      const steps = this.$refs.stepsContainer.children
      for (let i = 0; i < steps.length; i++) {
        let active = false

        if (i !== this.activeStep) {
          steps[i].classList.add('hidden')
        }
      }
    },
    getAmountOfSteps() {
      this.amountOfSteps = this.$refs.stepsContainer.children.length - 1
    },
    stepForward() {
      if (this.activeStep < this.amountOfSteps) {
        this.activeStep++
      }
    },
    stepBackward() {
      if (this.activeStep > 0) {
        this.activeStep--
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
