<template>
  <bar-hero>
    <template #column_left>
      <hgroup class="stack">
        <h1>Comparison Tool</h1>

        <div class="stack">
          <h2 class="h5 uppercase">Select two countries</h2>
          <div class="cluster">
            <bar-button color="white" size="s">Deselect All</bar-button>
            <bar-button v-for="country in countries" :color="country.active ? 'white' : 'faded'" variant="primary" size="s">{{ country.label }}</bar-button>
          </div>

          <h2 class="h5 uppercase">Select one or more topics</h2>
          <div class="cluster">
            <bar-button color="white" size="s">Select All</bar-button>
            <bar-button size="s" :color="topic.active ? 'white' : 'faded'" variant="primary" v-for="topic in topics" :key="topic.title">{{ topic.title }} <span class="topic-date">{{ topic.date }}</span> <span class="topic-new" v-if="topic.new">new</span></bar-button>
          </div>
        </div>
      </hgroup>
    </template>
  </bar-hero>

  <bar-section>
    <div class="cluster">
      <span split-left>Export Comparison:</span>
      <bar-button variant="primary" color="base" size="s"><span class="icon">vertical_align_bottom</span>PDF</bar-button>
      <bar-button variant="primary" color="base" size="s"><span class="icon">vertical_align_bottom</span>CSV</bar-button>
    </div>
  </bar-section>
    <bar-compare-box class="margin-bottom:l" />
    <bar-compare-box class="margin-bottom:l" />
  <bar-section>
  <div class="repel">
    <bar-button variant="primary" color="gray" size="s">Back to Top<span class="icon">arrow_upward</span></bar-button>

    <div class="cluster">
      <span split-left>Export Comparison:</span>
      <bar-button variant="primary" color="base" size="s"><span class="icon">vertical_align_bottom</span>PDF</bar-button>
      <bar-button variant="primary" color="base" size="s"><span class="icon">vertical_align_bottom</span>CSV</bar-button>
    </div>
  </div>
</bar-section>
</template>

<script setup>
const countries = [
  {
    label: 'Austria',
    active: false,
  },
  {
    label: 'Belgium',
    active: false,
  },
  {
    label: 'Bulgaria',
    active: false,
  },
  {
    label: 'Canada',
    active: true,
  },
  {
    label: 'Croatia',
    active: false,
  },
  {
    label: 'Cyprus',
    active: false,
  },
  {
    label: 'Czech Republic',
    active: false,
  },
  {
    label: 'Denmark',
    active: false,
  },
  {
    label: 'Luxembourg',
    active: true,
  },

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
 :deep(.hero-content) {
  grid-template-columns: 1fr;
 }

 hgroup {
  --_stack-space: var(--space-m)
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