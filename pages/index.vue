<template>
  <bar-hero id="hero" />
  
  <bar-section>
    <p class="highlight | text-align:center">The site will spotlight trending transatlantic topics and find potential alignment between the United States, Canada, the United Kingdom, and the European Union as well as its 27 member states.</p>
  </bar-section>
  
  <ccm-tabs :tabs="tabs" centered> <!-- TODO: had to use the ccmTabs components because the barTabs didn't properly inherit the slots and functionality-->
    <template #regions>
      <bar-map-section id="map" />
    </template>
    <template #topics>
      <bar-topics-section :topics="topics" @show-topics="(pay) => handleFilters(pay)" />
    </template>
  </ccm-tabs>

  <bar-section id="about" size="l" color="faded" class="homepage__about">
    <div class="switcher">
      <div class="section-panel | stack">
        <h2 class="h5">About</h2>
        <p>There is no closer geopolitical relationship than the transatlantic alliance. Yet, it is often difficult to know how individual actors are engaging on important issues impacting the larger community. With that challenge in mind, the Bertelsmann Foundation has developed the Transatlantic Barometer, an interactive digital platform that provides up-to-date information on pressing issues shaping the transatlantic relationship.</p>
        <p>The Transatlantic Barometer’s main fixture is a website that provides users with a synopsis of the policy positions and engagement of 31 key transatlantic actors: the United States, Canada, the United Kingdom, and the European Union as well as its 27 member states. The Barometer provides users with two ways of accessing information. First, users can click on featured topics, generating a carousel of all transatlantic stakeholder positions. Alternatively, users can click on individual actors, revealing a carousel connecting the stakeholder to all featured topics. The Barometer also offers explanatory animations, written analyses, and infographics to highlight the factors driving country-specific policy.</p>
      </div>
      <div class="section-panel | stack">
        <h2 class="h5">Methodology</h2>
        <p>The project team regularly identifies pressing topics shaping the transatlantic relationship. The team then engages with subject matter experts on both sides of the Atlantic to determine the best approach to encapsulate each topic. All information is reviewed by a comprehensive list of knowledge partners including diplomats, think tank experts, and academic institutions.</p>
        
        <h2 class="h5">Related Projects</h2>
        <ul class="homepage__related-projects | stack">
          <li>
            <a href="https://transatlanticperiscope.org/" target="_blank" rel="noopener">
              Transatlantic Periscope
              <span class="icon" size="xs">open_in_new</span>
            </a>
          </li>
          <li>
            <a href="https://www.bfna.org/archives/transatlantic-trends-2022/" target="_blank" rel="noopener">
              Transatlantic Trends 2022
              <span class="icon" size="xs">open_in_new</span>
            </a>
          </li>
          <li>
            <a href="https://www.rangeforecasting.org/" target="_blank" rel="noopener">
              RANGE - Transatlantic Forecasting Platform
              <span class="icon" size="xs">open_in_new</span>
            </a>
          </li>
          <li>
            <a href="https://www.bertelsmann-stiftung.de/en/our-projects/sustainable-governance-indicators-sgi" target="_blank" rel="noopener">
              Sustainable Governance Indicators (SGI)
              <span class="icon" size="xs">open_in_new</span>
            </a>
          </li>
          <li>
            <a href="https://www.bertelsmann-stiftung.de/en/our-projects/eupinions" target="_blank" rel="noopener">
              Eupinions
              <span class="icon" size="xs">open_in_new</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </bar-section>
  <bar-footer id="footer" />
</template>

<script setup>
const tabs = [
  { label: 'Regions', slot: 'regions', count: 0, class: '' },
  { label: 'Topics', slot: 'topics', count: 0, class: '' },
]

// Reactive filter state
const filters = ref({})

// Fetch topics based on filters
const { data: topics } = await useAsyncData('topics', () => {
  let query = queryCollection('topics')
  // Always use boolean for isArchived
  const archived = typeof filters.value.archived === 'boolean' ? filters.value.archived : false
  query = query.where('isArchived', '=', archived)
  
  if (filters.value.tag && filters.value.tag !== 'all') {
    query = query.where('tagsAsString', 'LIKE', `%${filters.value.tag.toUpperCase()}%`)
  }

  if (filters.value.sort) {
    query = query.order('periodWithDay', filters.value.sort)
  } else {
    // fallback to default sorting
    query = query.order('periodWithDay', 'DESC')
  }

  return query.all()

}, { watch: [filters] })

// Update filters and refetch data
const handleFilters = (payload) => {
  filters.value = { ...filters.value, ...payload }
}

</script>

<style scoped>
.homepage__about {
  --_switcher-gap: var(--space-l);
}

.section-panel {
  --_stack-space: var(--space-s);
}
.homepage__related-projects {
  margin-block-start: var(--space-s);
  --_stack-space: var(--space-2xs);
}

.highlight {
  font-size: var(--size-1);
  line-height: 150%;
  letter-spacing: -0.01em;
  font-weight: 300;
  max-width: 75ch;
  margin-inline: auto;
}

:deep(.ccm-tabs__content) {
  padding-block: 0;
  margin-bottom: -1px;
} 
</style>