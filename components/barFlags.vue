<script setup>
import { useCountries } from '~/composables/countries'

const { countries, getCountryName } = useCountries()

const controls = ref(false)
const router = useRouter()
const handleCountryFlag = (country) => {
  router.push({
    name: `region-slug`,
    path: country,
    params: { slug: country }
  });
}


</script>


<template>
  <div class="flags" :controls="controls">
    <div class="reel">
      <div v-for="country in countries" :key="country" class="reel-item">
        <bar-flag :country="country" :title="getCountryName(country)" @click="handleCountryFlag(country)" />
        <div class="reel-item-label">{{ getCountryName(country) }}</div>
      </div>
    </div>
    
    <div class="reel-controls" :class="{ 'reel-controls--minimal': controls == 'false' }">
      <button class="arrow-button"><span class="icon">arrow_back_ios</span></button>
      <!-- <bar-button variant="primary" size="l" color="base"><span>Read More</span><span class="icon">arrow_forward</span></bar-button> -->
      <button class="arrow-button"><span class="icon">arrow_forward_ios</span></button>
    </div>
  </div>
</template>

<style scoped>
.reel {
  padding-block: var(--space-xl) var(--space-s);
  padding-inline: var(--space-xl);

  @media (min-width: 768px) {
    --_reel-gap: var(--space-2xl);
    overflow: hidden;
    overflow-x: auto;
  }

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: var(--space-m);
    margin-top: var(--space-l);
    padding-inline: var(--space-s);
  }
}

/* Temp */
.reel-item {
  @media (min-width: 768px) {
    width: 100px;
  }

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  object-fit: cover;
  transition: all 0.3s ease;
  overflow-y: visible;
}

.reel-item-label {
  font-size: var(--size-0);
  font-weight: 600;
  color: var(--base-color-80-shade);
  padding-top: var(--space-xs);
}

.flags {
  position: relative;
  cursor: pointer;
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

  @media (max-width: 768px) { display: none; }
}

.reel-controls--minimal {
  --bg-fade: var(--base-color-07-tint);

  position: absolute;
  top: 0; 
  left: -2px;
  right: -2px;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xs);
  pointer-events: none;
  background: linear-gradient(to right, var(--bg-fade) 2%, transparent 20%, transparent 80%, var(--bg-fade) 98%);


  .arrow-button { 
    pointer-events: auto; 
    margin-top: -2.5rem;
  }
}

.reel-item:hover {
  .flag {
    transform: scale(1.15);
    transform-origin: bottom;
    box-shadow: var(--box-shadow-xl);
  }
}
</style>