<script setup>
const props = defineProps({
  dataset: {
    type: Object,
    required: true,
  },
  highlight: {
    type: Array,
    default: null,
  }
});

const { getCountryName } = useCountries()
const rankingList = ref(null);

const chartData = ref([]);
const years = ref([]);
const months = ref({});

const countries = computed(() => props.dataset.countries);
const hiddenCountries = ref([])

const isMarkerVisible = computed(() => props.dataset.vizMarkers);
const isBarVisible = (countryCode) => !hiddenCountries.value.includes(countryCode);

const handleCountryVisibility = ({ countryCode, visible }) => {

  if (!visible) {
    if (!hiddenCountries.value.includes(countryCode)) {
      hiddenCountries.value.push(countryCode)
    }
  } else {
    hiddenCountries.value = hiddenCountries.value.filter(c => c !== countryCode)
  }
}

function renderTimelineHeights() {
  const ranking = rankingList.value;
  if (!ranking) return;
  const items = ranking.querySelectorAll(".ranking__item");
  if (!items.length) return;

  // get the largest ranking value (should be 1, but let's generalize)
  const rankings = Array.from(items).map(item => {
    const rank = parseInt(item.querySelector('.country__ranking')?.textContent, 10);
    return isNaN(rank) ? 0 : rank;
  });
  const maxRanking = Math.max(...rankings);

  items.forEach((item, idx) => {
    const rank = rankings[idx];
    // invert so 1st place is 100%, last is lowest
    let percent = maxRanking === 1 ? 100 : ((maxRanking - rank + 1) / maxRanking) * 100;
    percent = Number(percent.toFixed(2));
    item.style.setProperty("--height", `${percent}%`);
    item.style.setProperty("--width", `${percent}%`);
  });
}

const scrollCards = (direction) => {
  const carousel = rankingList.value;
  if (!carousel) return;
  const width = carousel.offsetWidth - 50;
  const scrollAmount = direction === 'left' ? -width : width;
  carousel.scrollBy({
    top: 0,
    left: scrollAmount,
    behavior: 'smooth'
  });
}

onMounted(() => {
  // Build chartData
  chartData.value = props.dataset.countries.map((c, i) => ({
    country: c.country.toUpperCase(),
    ranking: i + 1
  }));
  nextTick(renderTimelineHeights);
  window.addEventListener('resize', renderTimelineHeights);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', renderTimelineHeights);
});

watch(chartData, () => {
  nextTick(renderTimelineHeights);
});

</script>

<template>
    <div class="subgrid">
      <div class="ranking-infographic__chart-wrapper">
        <ul ref="rankingList" class="ranking">
          <li 
            v-for="(i, index) in chartData"
            :key="index"
            class="ranking__item | country"
            :class="{'hidden': !isBarVisible(i.country.toLowerCase())}"
            :title="`${i.ranking} - ${getCountryName(i.country.toLowerCase())}`"
          >
            <p class="country__ranking">{{ i.ranking }}</p>
            <bar-flag :country="i.country.toLowerCase()" size="small" :style="{maxWidth: '42px'}"></bar-flag>
            <div class="country__spacer" :style="{'background-color': highlight.includes(i.country.toLowerCase()) ? 'var(--base-color)' : 'var(--accent-color)' }"></div>
            <p class="country__country">{{ i.country }}</p>
          </li>
          <a class="scroll-button scroll-button--left | desktop-only" @click.prevent="scrollCards('left')" aria-hidden="true">
            <i class="material-icons">keyboard_arrow_left</i>
          </a>
          
          <a class="scroll-button scroll-button--right | desktop-only" @click.prevent="scrollCards('right')" aria-hidden="true">
            <i class="material-icons">keyboard_arrow_right</i>
          </a>
        </ul>
      </div>
      <div class="tags | cluster" centered>
        <bar-tag
          v-for="item in countries"
          :key="item.country"
          :country-name="getCountryName(item.country)"
          :country-code="item.country"
          :visible="!hiddenCountries.includes(item.country)"
          @toggleCountryVisibility="(pay) => handleCountryVisibility(pay)"
        />
      </div>
    </div>
    

</template>

<style scoped lang="scss">
.ranking-infographic__chart-wrapper {

  --legend-height: 45px;
  --gap: var(--space-xs);

  display: flex;
  flex-direction: column;

  @media (min-width: 1024px) { flex-direction: row; }

  align-items: center;
  justify-content: center;
  aspect-ratio: 16/6;
  position: relative;
  gap: var(--gap);
  padding-inline: var(--space-s);
  padding-top: calc(var(--space-xs) + var(--legend-height));

}

.label {
  min-width: 26ch;
  overflow: hidden;
  white-space: pre-wrap;
}

  .ranking {
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-end;
    justify-content: center;
    gap: var(--space-3xs);
    height: 35vh;
    margin-top: -10vh;
    width: 50%;
    @media (min-width: 36em) {
      justify-content: flex-start;
      padding-inline: 0;
      width: 50%;
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    @media (max-width: 36em) {
      flex-flow: column nowrap;
      height: auto;
      margin-top: 0;
      align-items: flex-start;
    }

  }

  .ranking__item {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    text-align: center;
    gap: var(--space-3xs);
    height: var(--height);
    scroll-snap-align: start;
    @media (max-width: 36em) {
      flex-flow: row-reverse nowrap;
      justify-content: flex-start;
      height: auto;
      width: var(--width);
    }
  }

    .country__ranking {
      font-weight: 700;
    }

    .country__spacer {
      width: 1px;
      background-color: var(--accent-color);
      flex-grow: 1;
      @media (max-width: 36em) {
        height: 1px;
        width: auto;
      }
    }

    .country__country {
      color: hsla(var(--base-hsl),0.9);
    }

    .hidden {
      display: none;
    }


  

.scroll-button {
  position: absolute;
  height: 32px;
  width: 32px;
  cursor: pointer;
  
  top: 70%;
  z-index: 12;
  transform: translateY(-50%);
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  border-radius: 50%;
  background-color: var(--white-color);
  box-shadow: 0 0 16px hsla(var(--base-hsl), .2);
  transition: all 0.2s ease-out;
  @media (max-width: 36em) {
    display: none;
  }
}
  .scroll-button .material-icons {
    color: var(--base-color);
    flex: 0 0 auto;
  }
  .scroll-button:hover { transform: translateY(-50%) scale(1.2); }
  .scroll-button--left { left: 20%; }
  .scroll-button--right { right: 20%; }
  
  .ini .scroll-button--left,
  .end .scroll-button--right {
    display: none;
  }
</style>
