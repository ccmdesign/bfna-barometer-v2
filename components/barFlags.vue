<template>
  <div class="reel">
    <div v-for="country in countries" :key="country" class="reel-item aux-card">
      <bar-flag :country="country" :title="getCountryName(country)" />
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
]
</script>

<style scoped>
.reel {
  padding-block: var(--space-m);
}

/* Temp */
.reel-item {
  width: 200px;
  aspect-ratio: 16/9;
}


</style>