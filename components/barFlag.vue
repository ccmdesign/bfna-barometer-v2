<template>
  <div 
    class="flag" 
    :class="{ 'flag--small': size === 'small' }" 
    :country="country"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <img :src="`https://flagcdn.com/${country}.svg`" :alt="countryName" loading="lazy">
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

const emit = defineEmits(['flag-hover', 'flag-leave'])

import { useCountries } from '~/composables/countries'

const { getCountryName } = useCountries()
const countryName = computed(() => getCountryName(props.country))

const handleMouseEnter = () => {
  emit('flag-hover', props.country)
}

const handleMouseLeave = () => {
  emit('flag-leave')
}
</script>

<style scoped>
.flag {
  width: auto;
  box-shadow: var(--box-shadow-l);
  border-radius: var(--border-radius-s);
  overflow: hidden;
  background-color: var(--white-color);
  transition: all 0.3s ease;
  outline: 3px solid var(--white-color);
  
  img {
    width: auto;
    height: 70px;
    object-fit: cover;
  }
}

.flag--small {
  height: 60px;
}

.flag:not(.flag--small):hover {
  transform: scale(1.25);
  transform-origin: bottom;
  box-shadow: var(--box-shadow-xl);
}
</style>