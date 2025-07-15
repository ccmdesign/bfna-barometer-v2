<template>
  <bar-hero>
    <template #column_left>
      <hgroup class="stack">
        <bar-back-button />
        <bar-flag :country="getCountryCode(country.country)" size="small" />        
        <h1>{{ country.country }}</h1>
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
      <bar-button size="xs" color="gray" variant="primary"><span class="icon">inventory_2</span> View Archived Topics</bar-button>
    </div>
    <div class="topic-selector | flex gap:xs | justify-content:center | padding-top:s">
      <bar-button size="xs" :color="topic.active ? 'base' : 'white'" variant="primary" v-for="topic in topics" :key="topic.title">{{ topic.title }} <span class="topic-date">{{ topic.date }}</span> <span class="topic-new" v-if="topic.new">new</span></bar-button>
    </div>
  </bar-section>

  <bar-section color="faded">
    <div class="with-sidebar">
      <div class="main-content">
        <h2>Canada on Democracy</h2>
        <p>Canada is classified as an electoral democracy in the Varieties of Democracy (V-Dem) Institute’s 2025 Democracy Report. This means that elections are free and fair and protection of civil liberties is “satisfactory”, but not as robust as in liberal democracies.</p>
        <p>Canada, along with Spain, is in 17th place among the 30 Transatlantic Barometer countries on V-Dem’s Liberal Democracy Index. Canada scored 0.84/1.00 on the V-Dem Electoral Democracy Index in 2024, above the Barometer average of 0.80 and down slightly from its 0.85 in 2018. On the World Press Freedom Index, Canada scored 78.75/100 in 2025, down from its 2018 score of 84.72 but above the Barometer average of 76.07. Its Global State of Democracy Judiciary Independence score was 0.74/1.00 in 2023, a notable decline from its 0.81 score in 2018 and the same as the 0.74 Barometer average. Canada has declined on judicial independence since 2018, primarily over increasing criticism of the judiciary by political leaders and a lengthy judicial complaints process that did not provide accused judges with extensive opportunities to defend themselves.</p>
        <p>Parliament passed changes to the judicial complaints process in 2023, but these changes are not yet reflected in the data. The Organization for Security and Cooperation in Europe noted “full confidence in the electoral process” in its report on the 2021 Canadian snap elections.</p>  
      </div>
      <aside class="sidebar">
        <h2>Sources</h2>
        <ul class="stack | margin-top:s">
          <li v-for="link in sidebar_links" :key="link.title">
            <a :href="link.url">{{ link.title }}</a> <span class="icon" size="xs">open_in_new</span>
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

  <bar-section>
    <h2 class="section-title">infographics</h2>

    <ccm-tabs :tabs="tabs" class="infographics-tabs | padding-top:s">
      <template #tab1>
        <bar-infographic title="Liberal Democracy" />
      </template>
      <template #tab2>
        <bar-infographic title="Electoral Democracy" />
      </template>
      <template #tab3>
        <bar-infographic title="World Press Freedom" />
      </template>
      <template #tab4>
        <bar-infographic title="Judicial Independence" />
      </template>
    </ccm-tabs>
  </bar-section>

</template>

<script setup>
import { reactive } from 'vue';
const route = useRoute()
const { getCountryCode } = useCountries()
const { data: country } = await useAsyncData('country', () => queryCollection('statements')
  .where('slug', '=', route.params?.slug)
  .first())

const data = reactive({
  showRegionSelector: false
})

const tabs = [
  { label: 'Liberal Democracy', slot: 'tab1' },
  { label: 'Electoral Democracy', slot: 'tab2' },
  { label: 'World Press Freedom', slot: 'tab3' },
  { label: 'Judicial Independence', slot: 'tab4' },
]

const sidebar_links = [
  {
    "title": "V-Dem Democracy Report 2025",
    "type": "report"
  },
  {
    "title": "V-Dem Datasets 2025",
    "type": "dataset"
  },
  {
    "title": "V-Dem Datasets Archive",
    "type": "dataset"
  },
  {
    "title": "World Press Freedom Index 2025",
    "type": "index"
  },
  {
    "title": "Global State of Democracy Indices",
    "type": "index"
  },
  {
    "title": "Global State of Democracy Tracker: Canada",
    "type": "tracker"
  },
  {
    "title": "OSCE Report Canadian Elections 2021",
    "type": "report"
  },
  {
    "title": "Legal Scholars on Judicial Independence",
    "type": "analysis"
  }
]

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

const topics = [
  {
    "title": "Democracy",
    "active": true,
    "new": true,
    date: 'May `25'
  },
  {
    "title": "Security & Defense",
    "active": false,
    "new": false,
    date: 'May `25'
  },
  {
    "title": "Elections & Vote Turnout",
    "active": false,
    "new": false,
    date: 'May `25'
  },
  {
    "title": "E-Governance",
    "active": false,
    "new": false,
    date: 'May `25'
  },
  {
    "title": "Foreign Direct Investment",
    "active": false,
    "new": false,
    date: 'May `25'
  },
  {
    "title": "Migration",
    "active": false,
    "new": false,
    date: 'May `25'
  },
  {
    "title": "Artificial Intelligence",
    "active": false,
    "new": false,
    date: 'May `25'
  }
]
</script>

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