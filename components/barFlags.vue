<template>
  <div class="flags">
    <div class="reel">
      <div v-for="country in countries" :key="country" class="reel-item">
        <bar-flag :country="country" :title="getCountryName(country)" />
      </div>
    </div>
    <div class="reel-controls">
      <button class="arrow-button"><span class="icon">arrow_back_ios</span></button>
      <bar-button variant="primary" size="l" color="base"><span>Read More</span><span class="icon">arrow_forward</span></bar-button>
      <button class="arrow-button"><span class="icon">arrow_forward_ios</span></button>
    </div>
  </div>
</template>

<script setup>
import { useCountries } from '~/composables/countries'

const { getCountryName } = useCountries()

const countries = [
  'ca',
  'us',
  'gb',
  'de',
  'fr',
  'it',
  'es',
  'nl',
  'be',
  'ch',
  'ca',
  'us',
  'gb',
  'de',
  'fr',
  'it',
  'es',
  'nl',
  'be',
  'ch',
]
</script>

<style scoped>
.reel {
  padding-block: var(--space-m);
}

/* Temp */
.reel-item {
  width: 180px;
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  object-fit: cover;
  transition: all 0.3s ease;


}

.reel-item:hover {
  transform: scale(1.15);
}

.reel-controls {
  display: flex;
  justify-content: center;
  gap: var(--space-xs);
}

.arrow-button {
  background-color: var(--white-color);
  border-radius: 80px;
  padding: var(--space-s) calc(var(--space-m) * .9);
  border: 1px solid var(--white-color);
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  
  box-shadow: var(--box-shadow-l);
  
}


</style>