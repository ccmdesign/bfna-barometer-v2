<template>
  <div class="footer | subgrid">
    <slot>
      <h1>Footer</h1>
    </slot>
  </div>
</template>

<script setup>

</script>

<style scoped>
.footer {
  background-color: green;
  display: grid;
  grid-column: full-start / full-end;
  z-index: 1;
}
</style>