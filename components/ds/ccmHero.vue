<template>
  <ccm-base-section class="hero | subgrid">
    <slot>
      <h1>Hero</h1>
    </slot>
  </ccm-base-section>
</template>

<script setup>

</script>

<style scoped>
.hero {
  display: grid;
  grid-column: full-start / full-end;
  
  background-color: var(--base-color) !important;
}
</style>