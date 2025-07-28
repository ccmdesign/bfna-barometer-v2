<script setup>
import { useStatementStore } from '~/stores/statements';
definePageMeta({
  name: 'region-slug',
})

const route = useRoute()
const { getCountryName } = useCountries()
const showArchivedTopics = ref(false)
const statementStore = useStatementStore()
const statement = ref(null)
const activeTopic = ref(null)
statement.value = statementStore.getStatementBySlug(route.params.slug)

// Fetch topics based on filters
const { data: topics } = await useAsyncData('topics', () => {
  let query = queryCollection('topics')
  // Always use boolean for isArchived
  query = query.select('title', 'slug', 'new', 'active', 'topicId', 'period', 'periodWithDay', 'isArchived', 'infographics')
  const archived = typeof showArchivedTopics.value === 'boolean' ? showArchivedTopics.value : false
  query = query.where('isArchived', '=', archived)
  query = query.order('periodWithDay', 'DESC')
  
  return query.all()

}, { watch: [showArchivedTopics] })

const handleSelectedTopic = (topicId) => {
  topics.value = topics.value.map(topic => {
    if (topic.topicId === topicId) {
      topic.active = true
    } else {
      topic.active = false
    }
    return topic
  })

  handleActiveTopic();
  
}

const infographicsByCountry = ref([])
const data_cards = ref([])
const handleActiveTopic = async () => {
  infographicsByCountry.value = []
  activeTopic.value = topics.value.find(topic => topic.active)
  statement.value = statementStore.getStatementByTopic(activeTopic.value.topicId, route.params.slug)
  
  data_cards.value = (activeTopic.value.infographics?.map(infographic => {
    if (infographic.infographicType !== 'customInfographic') {
      const country = infographic.countries.find(item => item.country === statement.value.country)
      const scale = infographic.countries.reduce((max, item) => {
        const val = Number(item.val);
        return val > max ? val : max;
      }, 0) + (infographic.infographicType === 'rankingChart' ? 1 : 0); // Ensure scale is at least 1 for ranking charts, because the value problably the first country is 0

      if (!country?.val) {
        return undefined;
      } else {
        infographicsByCountry.value.unshift({...infographic, highlight: statement.value.country})
      }

      if (infographic.infographicType === 'timelineChart' && country) {
        return {
          indicator: infographic.title,
          score: country?.val,
          period: formatedDate(country),
          type: infographic.infographicType,
        }
      }

      return {
        indicator: infographic.title,
        score: country?.val,
        scale: scale,
        type: infographic.infographicType,
      }
    } else {
      infographicsByCountry.value.push(infographic)
    }
    return undefined;
  }) || []).filter(Boolean)

  const infographicsTabs = infographicsByCountry.value.map(card => {
    return {
      title: card.title,
      infographicType: card.infographicType,
    };
  });
  
  await nextTick(() => {
    handleTabs(infographicsTabs);
  })
}

const handleArchivedTopics = () => {
  showArchivedTopics.value = !showArchivedTopics.value;
}

const tabs = ref(null)
const handleTabs = (infographics) => {
  tabs.value = infographics?.map((infographic, index) => ({
    label: infographic.title,
    slot: `tab${index}`,
    infographicType: infographic.infographicType,
  })) || [];

}

const data = reactive({
  showRegionSelector: false
})

onMounted(() => {
  handleActiveTopic();
})

</script>

<template v-if="statement">
  <bar-hero>
    <template #column_left>
      <hgroup class="stack">
        <bar-back-button />
        <bar-flag v-if=statement.country :country="statement.country" size="small" />        
        <h1>{{ getCountryName(statement.country) }}</h1>
      </hgroup>
    </template>
    <template #column_right>
      <bar-button el="button" @click="data.showRegionSelector = !data.showRegionSelector" class="align-self:end justify-self:end" color="faded" variant="primary">Change Region <span class="icon" v-if="!data.showRegionSelector">arrow_downward</span><span class="icon" v-else>cancel</span></bar-button>
    </template>
  </bar-hero>

  <bar-section v-if="data.showRegionSelector" color="faded">
    <h2 class="h4">Change the country</h2>
    <bar-flags />
  </bar-section>

  <bar-section  color="faded">
    <h2 class="h4">Change the topic</h2>
    <div class="topic-selector | flex | justify-content:center | padding-top:s">
      <bar-button size="xs" color="gray" variant="primary" @click="handleArchivedTopics"><span class="icon">inventory_2</span> View Archived Topics</bar-button>
    </div>
    <div class="topic-selector | flex gap:xs | justify-content:center | padding-top:s">
      <bar-button size="xs" :color="topic.active ? 'base' : 'white'" variant="primary" v-for="topic in topics" :key="topic.title" @click="handleSelectedTopic(topic.topicId)">{{ topic.title }} <span class="topic-date">{{ topic.period }}</span> <span class="topic-new" v-if="topic.new">new</span></bar-button>
    </div>
  </bar-section>

  <bar-section color="faded">
    <div class="with-sidebar">
      <div class="main-content">
        <h2>{{ getCountryName(statement.country) }} on {{ activeTopic?.title }}</h2>
        <p>{{ statement.description }}</p>  
      </div>
      <aside class="sidebar">
        <h2>Sources</h2>
        <ul class="stack | margin-top:s">
          <li v-for="(link, index) in statement.links" :key="link.label + index">
            <a :href="link.url">{{ link.label }}</a> <span class="icon" size="xs">open_in_new</span>
          </li>
          </ul>
        </aside>
    </div>
  </bar-section>

  <bar-section color="faded">
    <div class="switcher">
      <bar-indicator-card v-for="card in data_cards" :key="card.indicator" :data="card" />
    </div>
  </bar-section>

  <bar-section v-if="tabs && tabs.length">
    <h2 class="section-title">infographics</h2>

    <ccm-tabs :tabs="tabs" class="infographics-tabs | padding-top:s">
      <template v-for="(infgc, index) in infographicsByCountry" :key="infgc.infographicId" v-slot:[`tab${index}`]>
        <bar-infographic v-if="infgc.infographicType === 'barChart'" :title="infgc.title" :data="infgc" :highlight="infgc.highlight" />
        <treemap-infographic v-else-if="infgc.infographicType === 'treemapChart'" :dataset="infgc" />
        <custom-infographic v-else-if="infgc.infographicType === 'customInfographic'" :data="infgc" />
        <timeline-infographic v-else-if="infgc.infographicType === 'timelineChart'" :dataset="infgc" :highlight="infgc.highlight" />
        <choropleth-infographic v-else-if="infgc.infographicType === 'choroplethChart'" :dataset="infgc" :highlight="infgc.highlight" />
        <ranking-infographic v-else-if="infgc.infographicType === 'rankingChart'" :dataset="infgc" :highlight="infgc.highlight" />
      </template>
    </ccm-tabs>
  </bar-section>

</template>

<style scoped>

.hero {
  --hero-gradient-color: var(--base-color-07-tint);
}
 :deep(.hero-content__inner) {
  justify-content: flex-end;
 }

 .h4 {
  width: 100%;
  text-align: center;
  text-transform: uppercase;
 }

 .topic-date {
  font-weight: 300;
 }

 .topic-new {
  background-color: var(--accent-color);
  font-size: var(--size--2);
  padding: var(--space-3xs) var(--space-2xs);
  border-radius:  var(--space-xs);
  color: var(--white-color);
 }
</style>