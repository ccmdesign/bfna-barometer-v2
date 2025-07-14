<template>
  <div class="flag" :class="{ 'flag--small': size === 'small' }" :country="country">
    <img :src="`https://flagcdn.com/${country}.svg`" :alt="countryName">
  </div>
</template>

<script setup>
const props = defineProps({
  country: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'medium'
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
  transition: all 0.3s ease;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.flag--small {
  width: 200px;
  aspect-ratio: 16/9;
}

.flag:not(.flag--small):hover {
  transform: scale(1.25);
  transform-origin: bottom;
  box-shadow: var(--box-shadow-xl);
}
</style>