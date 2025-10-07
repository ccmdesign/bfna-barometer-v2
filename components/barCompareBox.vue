
<script setup>
import { useAttrs } from 'vue';
defineOptions({ inheritAttrs: false });
const props = defineProps({
  dataset: {
    type: Array,
    required: true,
  },
});
const emit = defineEmits(['removeTopic', 'all-charts-ready']);
const { getCountryName } = useCountries()
const attrs = useAttrs();

const handleMoreDetails = (code) => {
  navigateTo({
    name: 'region-slug',
    slug: code,
    params: {
      slug: code,
    },
  });
}

const highlightCodes = computed(() =>
  props.dataset.flatMap(topic => Object.keys(topic.statements))
);

const isCountryInInfographic = (codesToCheck, infographic) =>{
  return codesToCheck.some(code => Object.keys(infographic.vizCountries).includes(code));
}

// Track chart rendering status
const chartsReady = ref(0)
const totalCharts = computed(() => {
  let count = 0
  props.dataset.forEach(topic => {
    if (topic.infographics) {
      topic.infographics.forEach(infgc => {
        if (!['customInfographic', 'treemapChart'].includes(infgc.infographicType)) {
          if (infgc.infographicType === 'timelineChart') {
            if (isCountryInInfographic(highlightCodes.value, infgc)) count++
          } else {
            count++
          }
        }
      })
    }
  })
  return count
})

const handleChartReady = () => {
  chartsReady.value++
  // Check if all charts are ready
  if (chartsReady.value >= totalCharts.value) {
    emit('all-charts-ready')
  }
}

</script>

<template>
  <bar-section
    v-for="(topic, index) in props.dataset"
    :key="index"
    class="compare-box | stack | margin-bottom:m"
    v-bind="attrs"
  >
    <div class="cluster | print:cluster">
      <hgroup split-right>
        <h4 class="h6 | print:only">
          Comparison: 
          <template v-if="Object.values(topic.statements).length === 2">
            {{ getCountryName(Object.values(topic.statements)[0].country) }} and {{ getCountryName(Object.values(topic.statements)[1].country) }}
          </template>
        </h4>
        <h2 class="h1">{{ topic.title }}</h2>
        <p>{{ topic.description }}</p>
      </hgroup>
      <bar-button id="print:btn-remove-topic" variant="link" color="base" size="small" @click="emit('removeTopic', topic)" class="print:hidden"><span class="icon">close</span></bar-button>
    </div>
    <div class="switcher ">
      <div v-for="(statement, countryCode) in Object.values(topic.statements)" :key="countryCode" class="section-panel | stack align-items:flex-start">
        <bar-flag :country="statement.country" size="small" class="compare-flag" />
        <div>
          <h3 class="h2">{{ getCountryName(statement.country) }}</h3>
          <p>{{ statement.description }}</p>
        </div>
        <bar-button id="print:btn-more-details" @click="handleMoreDetails(statement.country)" class="print:hidden">More details</bar-button>
      </div>
    </div>

    <!-- <bar-infographic /> -->
    <div class="infographic-container" v-for="(infgc, index) in topic.infographics" :key="infgc.infographicId" :class="{ 'compare-timeline': infgc.infographicType === 'timelineChart' }">
      <div v-if="!['customInfographic', 'treemapChart'].includes(infgc.infographicType)">
        <h3 v-if="isCountryInInfographic(highlightCodes, infgc)" class="h4 padding-block:l text-align:center">{{ infgc.title }}</h3>
        <bar-infographic v-if="infgc.infographicType === 'barChart'" :title="infgc.title" :data="infgc" :highlight="highlightCodes" @chart-ready="handleChartReady" />
        <timeline-infographic v-else-if="infgc.infographicType === 'timelineChart' && isCountryInInfographic(highlightCodes, infgc)" :dataset="infgc" :highlight="highlightCodes" @chart-ready="handleChartReady" />
        <choropleth-infographic v-else-if="infgc.infographicType === 'choroplethChart'" :dataset="infgc" :highlight="highlightCodes" @chart-ready="handleChartReady" />
        <ranking-infographic v-else-if="infgc.infographicType === 'rankingChart'" :dataset="infgc" :highlight="highlightCodes" @chart-ready="handleChartReady" />
      </div>
    </div>
  </bar-section>
</template>

<style scoped>
  .compare-box {
    border: 1px solid var(--base-color-20-tint);
    border-radius: var(--border-radius-m);
    margin-inline: var(--space-l);
    padding-inline: var(--space-xl);

    @media print {
      border: none;
      margin-inline: 0;
      padding-inline: 0;
    }
  }

  .switcher {
    --_switcher-gap: var(--space-xl);
  }

  .cluster {
    flex-wrap: nowrap;
  }

  .compare-timeline {
    display: flex;
    flex-direction: column;
    gap: var(--space-l);
  }

  .infographic-container {
    background-color: var(--base-color-05-tint);
    padding: 0 var(--space-l);
    margin-bottom: var(--space-s);
    border-radius: var(--border-radius-l);
  }

  .infographic-container:has(#choropleth) {
    padding-bottom: var(--space-l);
  }

  .infographic-container:empty {
    display: none;
  }

  .compare-flag {
    @media print { 
      max-width: 80px; 
      border-radius: 0;
    }
  }

  .switcher {
    @media print {
      display: flex;
      flex-direction: column;
      gap: var(--space-l);
    }
  }

</style>