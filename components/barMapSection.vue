<template>
  <bar-section class="map-section">
    <h1>Map</h1>

    <bar-flags />
  </bar-section>
</template>

<script setup>

</script>

<style scoped>
.map-section {
  grid-column: content-start / content-end;
  display: grid;
  grid-template-columns: subgrid;
}
</style>