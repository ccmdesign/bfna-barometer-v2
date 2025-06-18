<template>
  <bar-section class="map-section">
    <div class="map-section__map">
      <h1 class="color:base-20-tint" style="font-size: 8rem">Map</h1>
    </div>
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

.map-section__map {
  background-color: var(--base-color-10-tint);
  border-radius: var(--border-radius-l);
  padding: var(--space-m);
  aspect-ratio: 16 / 9;
}
</style>