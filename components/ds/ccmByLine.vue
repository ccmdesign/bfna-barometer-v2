<template>
  <div class="by-line | subgrid | cluster">
    <span>© {{ new Date().getFullYear() }} {{ siteName }}</span>
    <slot></slot>
    <a href="#" split-left>by ccm.design</a>
  </div>
</template>

<script setup>
const props = defineProps({
  siteName: {
    type: String,
    default: 'Project Name'
  }
})
</script>

<style scoped>

/* By Line Layout - SubGrid */

.by-line {
  grid-column: content-start / content-end;
  font-size: var(--size--2);
  padding-block: var(--space-l) var(--space-s);
  --_cluster-space: var(--space-xs);
}
</style>
