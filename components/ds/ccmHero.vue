<template>
  <div class="hero | subgrid">
    <slot>
      <h1>Hero</h1>
    </slot>
  </div>
</template>

<script setup>

</script>

<style scoped>
.hero {
  background-color: yellow;
  display: grid;
  grid-column: full-start / full-end;
}
</style>