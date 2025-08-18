<script setup>
import { useCountries } from '~/composables/countries'

const props = defineProps({
  topic: {
    type: String
  }
})

const { countries, getCountryName } = useCountries()

const controls = ref(false)
const router = useRouter()
const reelRef = ref(null)

const emit = defineEmits(['flag-hover', 'flag-leave'])

const handleCountryFlag = (country) => {
  if(props.topic) {
    router.push({
      name: `region-slug`,
      path: country,
      params: { slug: country },
      query: { topic: props.topic }
    });
  } else {
    router.push({
      name: `region-slug`,
      path: country,
      params: { slug: country }
    });
  }
}

const handleFlagHover = (country) => {
  emit('flag-hover', country)
}

const handleFlagLeave = () => {
  emit('flag-leave')
}


const scrollLeft = () => {
  if (!reelRef.value) return
  
  const reel = reelRef.value
  const itemWidth = 100 // largura de cada item
  const gap = 32 // gap entre itens (--space-2xl)
  const totalItemWidth = itemWidth + gap
  
  const scrollLeft = reel.scrollLeft
  const containerWidth = reel.clientWidth
  
  const visibleItems = Math.floor(containerWidth / totalItemWidth)
  const currentItemIndex = Math.floor(scrollLeft / totalItemWidth)
  const targetItemIndex = Math.max(0, currentItemIndex - visibleItems)
  
  const targetScrollLeft = targetItemIndex * totalItemWidth
  reel.scrollTo({
    left: targetScrollLeft,
    behavior: 'smooth'
  })
}

const scrollRight = () => {
  if (!reelRef.value) return
  
  const reel = reelRef.value
  const itemWidth = 100 // largura de cada item
  const gap = 32 // gap entre itens (--space-2xl)
  const totalItemWidth = itemWidth + gap
  
  
  const scrollLeft = reel.scrollLeft
  const containerWidth = reel.clientWidth
  const maxScrollLeft = reel.scrollWidth - containerWidth
  
  
  const visibleItems = Math.floor(containerWidth / totalItemWidth)
  
  
  const currentItemIndex = Math.floor(scrollLeft / totalItemWidth)
  const targetItemIndex = Math.min(
    Math.floor(maxScrollLeft / totalItemWidth),
    currentItemIndex + visibleItems
  )
  
 
  const targetScrollLeft = targetItemIndex * totalItemWidth
  reel.scrollTo({
    left: targetScrollLeft,
    behavior: 'smooth'
  })
}
</script>

<template>
  <div class="flags" :controls="controls">
    <div class="reel" ref="reelRef">
      <div v-for="country in countries" :key="country" class="reel-item">
        <bar-flag 
          :country="country" 
          :title="getCountryName(country)" 
          @click="handleCountryFlag(country)"
          @flag-hover="handleFlagHover"
          @flag-leave="handleFlagLeave"
        />
        <div class="reel-item-label">{{ getCountryName(country) }}</div>
      </div>
    </div>
    
    <div class="reel-controls" :class="{ 'reel-controls--minimal': controls == 'false' }">
      <button class="arrow-button arrow-button--left" @click="scrollLeft" aria-label="Scroll left through countries"><span class="icon">arrow_back_ios</span></button>
      <!-- <bar-button variant="primary" size="l" color="base"><span>Read More</span><span class="icon">arrow_forward</span></bar-button> -->
      <button class="arrow-button" @click="scrollRight" aria-label="Scroll right through countries"><span class="icon">arrow_forward_ios</span></button>
    </div>
  </div>
</template>

<style scoped>
.reel {
  padding-block: var(--space-xl) var(--space-s);
  padding-inline: var(--space-xl);

  @media (min-width: 768px) {
    --_reel-gap: var(--space-xl);
    overflow: hidden;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    scrollbar-width: none; 
    -ms-overflow-style: none; 
  }

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: var(--space-m);
    margin-top: var(--space-l);
    padding-inline: var(--space-s);
  }
}

.reel::-webkit-scrollbar {
  display: none;
}

/* Temp */
.reel-item {
  @media (min-width: 768px) {
    width: 100px;
    scroll-snap-align: center;
    flex-shrink: 0;
    /* margin-inline: var(--space-s); */
    
    box-sizing: content-box;
  }

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  object-fit: cover;
  transition: all 0.3s ease;
  overflow-y: visible;
}

.reel-item:first-child {
  @media (min-width: 768px) { 
    border-right: 1px solid var(--base-color-30-alpha);
    padding-inline: var(--space-xl); 
  }
}

.reel-item:last-child {
  margin-right: var(--space-xl);
}

.reel-item-label {
  font-size: var(--size-0);
  font-weight: 600;
  color: var(--base-color-80-shade);
  padding-top: var(--space-xs);
  white-space: nowrap;
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
  aspect-ratio: 1/1;
  height: 64px;
  /* padding: var(--space-xs) var(--space-xs); */
  border: 1px solid var(--white-color);
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: var(--box-shadow-l);

  @media (max-width: 768px) { display: none; }
}

.arrow-button--left span {
  position: relative;
  left: 4px;
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