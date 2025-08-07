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
    item.style.setProperty("--val", `${percent}`);
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
        </ul>
      </div>
      <div class="tags | cluster | margin-top:m padding-bottom:l print:hidden" centered>
        <bar-tag
          color="base-10"
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
  --scale: 5px;
}

.label {
  min-width: 26ch;
  overflow: hidden;
  white-space: pre-wrap;
}

.ranking {
  display: flex;
  flex-flow: row nowrap;
  @media (min-width: 1440px) {
    height: 600px;
    align-items: flex-end;
  }
  @media (max-width: 1440px) {
    flex-flow: column nowrap;
    align-items: flex-start;
  }
  
  justify-content: center;
  gap: var(--space-3xs);
  
}

.ranking__item {
  --extras: 65px + (var(--space-3xs) * 2);
  display: flex;
  align-items: center;
  text-align: center;


  @media (max-width: 1440px) { 
    flex-flow: row-reverse nowrap; 
    justify-content: flex-end;
    gap: var(--space-3xs);
    width: 100%;
  }

  @media (min-width: 1440px) { flex-flow: column nowrap; }
}

.country__ranking { 
  font-weight: 700; 
  margin: 0;;
}

.country__spacer {
  background-color: var(--accent-color);

  @media (max-width: 1440px) {
    --scale: 1%;
    width: calc(var(--val) * var(--scale) - var(--extras));
    height: 1px;
  }

  @media (min-width: 1440px) {
    width: 1px;
    height: calc(var(--val) * var(--scale));
  }
}

.country__country { 
  color: hsla(var(--base-hsl),0.9); 
  margin: 0;
}

.hidden { display: none; }
</style>
