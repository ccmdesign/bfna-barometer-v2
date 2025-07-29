<script setup>
const props = defineProps({
  dataset: {
    type: Array,
    required: true,
  },
});
const emit = defineEmits(['removeTopic']);
const { getCountryName } = useCountries()

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

</script>

<template>
  <bar-section v-for="(topic, index) in props.dataset" :key="index" class="compare-box | stack">
    <div class="cluster">
      <hgroup split-right>
        <h2 class="h1">{{ topic.title }}</h2>
        <p>{{ topic.description }}</p>
      </hgroup>
      <bar-button color="base" size="small" @click="emit('removeTopic', topic)">Close</bar-button>
    </div>
    <div class="switcher">
      <div v-for="(statement, countryCode) in Object.values(topic.statements)" :key="countryCode" class="section-panel | stack">
        <bar-flag :country="statement.country" size="small" />
        <div>
          <h3 class="h2">{{ getCountryName(statement.country) }}</h3>
          <p>{{ statement.description }}</p>
        </div>
        <bar-button @click="handleMoreDetails(statement.country)">More details</bar-button>
      </div>
    </div>

    <!-- <bar-infographic /> -->
    <div v-for="(infgc, index) in topic.infographics" :key="infgc.infographicId">
      <h3 v-if="!['customInfographic', 'treemapChart'].includes(infgc.infographicType)" class="h2" style="padding: 2rem 0">{{ infgc.title }}</h3>
      <bar-infographic v-if="infgc.infographicType === 'barChart'" :title="infgc.title" :data="infgc" :highlight="highlightCodes" />
      <timeline-infographic v-else-if="infgc.infographicType === 'timelineChart'" :dataset="infgc" :highlight="highlightCodes" />
      <choropleth-infographic v-else-if="infgc.infographicType === 'choroplethChart'" :dataset="infgc" :highlight="highlightCodes" />
      <ranking-infographic v-else-if="infgc.infographicType === 'rankingChart'" :dataset="infgc" :highlight="highlightCodes" />
    </div>

  </bar-section>
</template>

<style scoped>
  .compare-box {
    border: 1px solid var(--base-color-20-tint);
    border-radius: var(--border-radius-m);
    margin-inline: var(--space-l);
    padding-inline: var(--space-m);
  
  }

  .cluster {
    flex-wrap: nowrap;
  }
</style>