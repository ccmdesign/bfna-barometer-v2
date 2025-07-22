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
      handleTabs(topic);
    } else {
      topic.active = false
    }
    return topic
  })

  handleActiveTopic();
  
}

const handleActiveTopic = async () => {
  activeTopic.value = topics.value.find(topic => topic.active)
  statement.value = statementStore.getStatementByTopic(activeTopic.value.topicId, route.params.slug)
  
  await nextTick()
  handleTabs(activeTopic.value);
}

const handleArchivedTopics = () => {
  showArchivedTopics.value = !showArchivedTopics.value;
}

const tabs = ref(null)
const handleTabs = (topic) => {
  tabs.value = topic.infographics?.map((infographic, index) => ({
    label: infographic.title,
    slot: `tab${index}`,
    infographicType: infographic.infographicType,
  })) || [];

}

const data = reactive({
  showRegionSelector: false
})

const data_cards = [
  {
    "indicator": "Liberal Democracy",
    "score": 0.74,
    "scale": 1
  },
  {
    "indicator": "Electoral Democracy",
    "score": 0.84,
    "scale": 1
  },
  {
    "indicator": "World Press Freedom",
    "score": 78.75,
    "scale": 100
  },
  {
    "indicator": "Judicial Independence",
    "score": 0.74,
    "scale": 1
  }
]


onMounted(() => {
  handleActiveTopic();
})

</script>

<template v-if="statement">
  <bar-hero>
    <template #column_left>
      <hgroup class="stack">
        <bar-back-button />
        <bar-flag :country="statement.country" size="small" />        
        <h1>{{ getCountryName(statement.country) }}</h1>
      </hgroup>
    </template>
    <template #column_right>
      <bar-button el="button" @click="data.showRegionSelector = !data.showRegionSelector" class="align-self:end justify-self:end" color="faded" variant="primary" size="s">Change Region <span class="icon" v-if="!data.showRegionSelector">arrow_downward</span><span class="icon" v-else>cancel</span></bar-button>
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
        <h2>{{ getCountryName(statement.country) }} on Democracy</h2>
        <p>{{ statement.description }}</p>  
      </div>
      <aside class="sidebar">
        <h2>Sources</h2>
        <ul class="stack | margin-top:s">
          <li v-for="link in statement.links" :key="link.label">
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

  <bar-section v-if="tabs">
    <h2 class="section-title">infographics</h2>

    <ccm-tabs :tabs="tabs" class="infographics-tabs | padding-top:s">
      <template v-for="(infgc, index) in activeTopic.infographics" :key="infgc.infographicId" #['tab'+index]>
        <bar-infographic v-if="infgc.infographicType === 'barChart'" :title="infgc.title" :data="infgc" />
        <treemap-infographic v-else-if="infgc.infographicType === 'treemapChart'" :dataset="infgc" />
        <custom-infographic v-else-if="infgc.infographicType === 'customInfographic'" :data="infgc" />
        <timeline-infographic v-else-if="infgc.infographicType === 'timelineChart'" :dataset="infgc" />
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