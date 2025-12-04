<script setup>
import { useStatementStore } from '~/stores/statements';
definePageMeta({
  name: 'region-slug',
})

useSeoMeta({
  description: 'An interactive digital platform providing up-to-date information on pressing issues shaping the transatlantic relationship.',
  ogTitle: 'Transatlantic Barometer - Interactive Policy Platform',
  ogDescription: 'An interactive digital platform providing up-to-date information on pressing issues shaping the transatlantic relationship.',
  ogImage: '/assets/logo.png',
  ogUrl: 'https://transatlanticbarometer.org',
  twitterTitle: 'Transatlantic Barometer - Interactive Policy Platform',
  twitterDescription: 'An interactive digital platform providing up-to-date information on pressing issues shaping the transatlantic relationship.',
  twitterImage: '/assets/logo.png',
  twitterCard: 'summary'
})

const route = useRoute()
const archived = route.query?.archived === 'true'
const { getCountryName } = useCountries()
const showArchivedTopics = ref(archived)
const statementStore = useStatementStore()
const statement = ref(null)
const activeTopic = ref(null)

statement.value = statementStore.getStatementBySlug(route.params.slug)

watch(() => statementStore.isLoaded, (loaded) => {
  if (loaded && !statement.value) {
    statement.value = statementStore.getStatementBySlug(route.params.slug)
  }
}, { immediate: true })

// Fetch topics based on filters
const { data: topics, refresh: refreshTopics, pending } = await useAsyncData('detail-topics', () => {
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

  const addPercentageSymbol = (infographic, value) => {
    return infographic.infographicValuesAsPercentage ? `${value}%` : value
  }

  activeTopic.value = topics.value.find(topic => topic.active)
  statement.value = statementStore.getStatementByTopic(activeTopic.value.topicId, route.params.slug)
  
  if (!statement.value) {
    // Try to fetch if not found in store
    const { data: statements } = await useAsyncData('statements', () => queryCollection('statements').all())
    statementStore.setStatements(statements.value);
    statement.value = statementStore.getStatementByTopic(activeTopic.value.topicId, route.params.slug)
  }

  if (!statement.value) return;

  data_cards.value = (activeTopic.value.infographics?.map(infographic => {
    if (infographic.infographicType !== 'customInfographic' && infographic.infographicType !== 'treemapChart') {
      const country = infographic.countries.find(item => item.country === statement.value.country)
      const scale = infographic.countries.reduce((max, item) => {
        const val = Number(item.val);
        return val > max ? val : max;
      }, 0) + (infographic.infographicType === 'rankingChart' ? 1 : 0); // Ensure scale is at least 1 for ranking charts, because the value problably the first country is 0

      if (country?.val === undefined || country?.val === null) {
        return undefined;
      } else {
        infographicsByCountry.value.unshift({...infographic, highlight: statement.value.country})
      }

      if (infographic.infographicType === 'timelineChart' && country) {
        return {
          indicator: infographic.title,
          score: infographic.infographicValuesAsPercentage ? country?.val + `%` : country?.val,
          period: formatedDate(country),
          type: infographic.infographicType,
        }
      }

      let highestCountryValueAsScaleLimit = infographic.highestCountryValueAsScaleLimit;
      if(highestCountryValueAsScaleLimit === undefined) {
        highestCountryValueAsScaleLimit = null;
      }

      return {
        indicator: infographic.title,
        score: infographic.infographicValuesAsPercentage ? country?.val + `%` : infographic.infographicType === 'rankingChart' ? country?.val + 1: country?.val,
        scale: infographic.scaleLimit ? addPercentageSymbol(infographic, infographic.scaleLimit) : addPercentageSymbol(infographic, scale),
        displayScaleLimit: infographic.infographicType === 'barChart' && highestCountryValueAsScaleLimit !== null ? highestCountryValueAsScaleLimit : true,
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

const handleArchivedTopics = async () => {
  showArchivedTopics.value = !showArchivedTopics.value;
  await refreshTopics()
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
  // Ensure topics are loaded first
  if (topics.value && topics.value.length > 0) {
    const selected = topics.value.find(topic => topic.slug === route.query.topic)
    if (selected) {
      handleSelectedTopic(selected.topicId)
    }
    handleActiveTopic();
  }
})

// Watch for topics to load and initialize active topic
watch(topics, (newTopics) => {
  if (newTopics && newTopics.length > 0 && !activeTopic.value) {
    handleActiveTopic();
  }
}, { immediate: true })

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
      <bar-button el="button" @click="data.showRegionSelector = !data.showRegionSelector" class="align-self:end justify-self:end" color="faded" variant="primary">Change Country <span class="icon" v-if="!data.showRegionSelector">arrow_downward</span><span class="icon" v-else>cancel</span></bar-button>
    </template>
  </bar-hero>

  <bar-section v-if="data.showRegionSelector" color="faded">
    <h2 class="h4">Change country</h2>
    <bar-flags />
  </bar-section>

  <bar-section  color="faded">
    <h2 class="h4">Change topic</h2>
    <div class="topic-selector | flex | justify-content:center | padding-top:s">
      <bar-button size="xs" color="gray" variant="primary" :disabled="pending" @click="handleArchivedTopics"><span class="icon">inventory_2</span> View Archived Topics</bar-button>
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
            <a :href="link.url" target="_blank">{{ link.label }}</a> <span class="icon" size="xs">open_in_new</span>
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

  <bar-section id="infographics" v-if="tabs && tabs.length">
    <h2 class="section-title ">infographics</h2>

    <ccm-tabs :tabs="tabs" class="infographics-tabs | padding-top:s">
      <template v-for="(infgc, index) in infographicsByCountry" :key="infgc.infographicId" v-slot:[`tab${index}`]>
        <bar-infographic v-if="infgc.infographicType === 'barChart'" :title="infgc.title" :data="infgc" :highlight="[infgc.highlight]" />
        <treemap-infographic v-else-if="infgc.infographicType === 'treemapChart'" :dataset="infgc" />
        <custom-infographic v-else-if="infgc.infographicType === 'customInfographic'" :data="infgc" />
        <timeline-infographic v-else-if="infgc.infographicType === 'timelineChart'" :dataset="infgc" :highlight="[infgc.highlight]" />
        <choropleth-infographic v-else-if="infgc.infographicType === 'choroplethChart'" :dataset="infgc" :highlight="[infgc.highlight]" />
        <ranking-infographic v-else-if="infgc.infographicType === 'rankingChart'" :dataset="infgc" :highlight="[infgc.highlight]" />
      </template>
    </ccm-tabs>
  </bar-section>
  <bar-footer id="footer" />

</template>

<style scoped>

.hero {
  --bar-curve-color: var(--base-color-07-tint);
}

.bar-footer {
  --bar-curve-color: var(--white-color);
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

.infographics-tabs > * {
  grid-column: content-start / content-end;
}


.infographics-tabs :deep(.ccm-tabs__tabs) {
  text-align: center;
  justify-content: start;
}

#infographics .section-title {
text-align: center;
}

:deep(.tab-button) {
  @media (max-width: 1300px) {
    font-size: var(--size-0);
  }
  @media (max-width: 1024px) {
    font-size: var(--size--1);
  }
}
</style>
