<template>
  <section class="map-section | subgrid">
    <mapSVG class="map-section__map | subgrid" :hovered-country="hoveredCountry" />
    <bar-flags 
      class="map-section__flags | subgrid" 
      controls="true" 
      @flag-hover="handleFlagHover"
      @flag-leave="handleFlagLeave"
    />
  </section>
</template>

<script setup>
const hoveredCountry = ref('')

const handleFlagHover = (country) => {
  hoveredCountry.value = country
}

const handleFlagLeave = () => {
  hoveredCountry.value = ''
}
</script>

<style scoped>
.map-section {
  border-top: 1px solid var(--base-color-10-alpha);
  border-bottom: 1px solid var(--base-color-20-alpha);
  
}

.map-section,
.map-section__map { 
  position: relative;
}

.map-section__map {
  max-width: 100%;
  margin-bottom: -4px;
  overflow: hidden;
  @media (max-width: 768px) { display: none; }
}

.map-section__flags {
  @media (min-width: 768px) { position: absolute; } 
  bottom: var(--space-m);
  max-width: 100%;
}
</style>


