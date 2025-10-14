<template>
  <section class="map-section | subgrid">
    <mapSVG 
      v-if="!isMobile" 
      class="map-section__map | subgrid" 
      :hovered-country="hoveredCountry" 
    />
    <bar-flags :topic="topic" :archived="archived"
      class="map-section__flags | subgrid" 
      controls="true" 
      @flag-hover="handleFlagHover"
      @flag-leave="handleFlagLeave"
    />
  </section>
</template>

<script setup>
const props = defineProps({
  topic: {
    type: String
  },
  archived: {
    type: Boolean,
    default: false
  }
})

const { isMobile } = useDevice()
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

  /* @media (min-width: 769px) and (max-width: 1340px) {
    height: 55vh;
  } */
  
}

.map-section,
.map-section__map { 
  position: relative;
}

.map-section__map {
  max-width: 100%;
  margin-bottom: -4px;
  overflow: hidden;
}

.map-section__flags {
  max-width: 100%;
  
  @media (min-width: 1340px) {
    position: absolute;
    bottom: var(--space-m);
  }
}
</style>
