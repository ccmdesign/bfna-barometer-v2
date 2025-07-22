<template>
  <section class="map-section | subgrid">
    <mapSVG class="map-section__map | subgrid" />
    <bar-flags class="map-section__flags | subgrid" controls="true" />
  </section>
</template>

<script setup>

</script>

<style scoped>
.map-section {
  position: relative;
  aspect-ratio: 16 / 9;
  
}

.map-section__map {
  
}

.map-section__flags {
  position: absolute;
  bottom: 0;
  padding-block: var(--space-m);
  max-width: 100%;
}
</style>