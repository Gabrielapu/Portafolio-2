<template>
  <div>
    <TransitionGroup name="fade" appear>
      <slot name="content"></slot>
    </TransitionGroup>
  </div>
</template>

<script>
export default {
  name: 'ContentStepperStep',
}
</script>

<style lang="scss" scoped></style>
