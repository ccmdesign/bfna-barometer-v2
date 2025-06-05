<template>
  <div class="tag">
    <slot></slot>
  </div>
</template>

<script setup>

</script>

<style scoped>
.tag {
  background-color: gray;
  padding: var(--space-3xs) var(--space-xs);
  border-radius: 30px;
  border: 1px solid red;
  color: white
}
</style>