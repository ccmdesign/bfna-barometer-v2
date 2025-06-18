<template>
  <div class="flag" :country="country">
    <img :src="`https://flagcdn.com/${country}.svg`" :alt="countryName">
  </div>
</template>

<script setup>
const props = defineProps({
  country: {
    type: String,
    required: true
  }
})
import { useCountries } from '~/composables/countries'

const { getCountryName } = useCountries()
const countryName = computed(() => getCountryName(props.country))
</script>

<style scoped>
.flag {
  width: auto;
  box-shadow: var(--box-shadow-l);
  border-radius: var(--border-radius-m);
  overflow: hidden;
  padding: var(--space-3xs);
  background-color: var(--white-color);
  
}
</style>