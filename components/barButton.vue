<template>
  <ccm-button class="bar-button">
    <slot />
  </ccm-button>
</template>

<script setup>

</script>

<style scoped>
  .bar-button {
    --_button-border-radius: var(--_input-border-radius);
  }
</style>