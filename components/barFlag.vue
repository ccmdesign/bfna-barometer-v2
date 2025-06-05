<template>
  <div class="flag" :country="country">
    <img :src="`https://flagcdn.com/${country}.svg`" width="100" :alt="countryName">
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
  width: 100px;
  height: auto;
}
</style>