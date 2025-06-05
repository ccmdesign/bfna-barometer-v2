<template>
  <div class="topbar | subgrid | cluster">
    <slot></slot>
  </div>
</template>

<script setup>

</script>

<style scoped>
.topbar {
  padding-block: var(--space-xs);
  grid-column: content-start / content-end; /* Grid template columns are defined by the .subgrid class, and grid-column attr. */
}

.topbar {
  /* Aux styles */
}
</style>