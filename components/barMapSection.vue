<template>
  <bar-section class="map-section" size="0">
    <div class="map-section__map">
      <mapSVG />
    </div>
    <bar-flags controls="true" />
  </bar-section>
</template>

<script setup>

</script>

<style scoped>
.map-section {
  grid-column: content-start / content-end;
  display: grid;
  grid-template-columns: subgrid;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.map-section__map {
  position: relative;
  width: 100vw;
  aspect-ratio: 16 / 8;
}

:deep(.flags) {
  position: absolute;
  bottom: var(--space-m);
  width: 100%;
}
</style>