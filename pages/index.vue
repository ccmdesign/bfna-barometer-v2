<template>
  <bar-hero id="hero" />
  
  <bar-section>
    <p class="highlight | text-align:center">The site will spotlight trending transatlantic topics and find potential alignment between the United States, Canada, the United Kingdom, and the European Union as well as its 27 member states.</p>
  </bar-section>
  <ccm-tabs :tabs="tabs" centered> <!-- TODO: had to use the ccmTabs components because the barTabs didn't properly inherit the slots and functionality-->
    <template #extra>
      <bar-button el="a" href="/compare" color="gray" size="s" variant="primary">Compare</bar-button>
    </template>
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
        <p>There is no closer geopolitical relationship than the transatlantic alliance. Yet, it is often difficult to know how individual countries are engaging on important issues impacting the larger community. With that challenge in mind, the Bertelsmann Foundation has developed the Transatlantic Barometer, an interactive digital platform that provides up-to-date information on pressing issues shaping the transatlantic relationship.</p>
        <p>The Transatlantic Barometer provides users with a synopsis of policy positions and engagement for 31 key actors: the United States, Canada, the United Kingdom, and the European Union as well as its 27 member states. The Barometer provides users with two ways of accessing information. First, users can click on featured topics, generating a carousel of each stakeholder’s position on a common issue. Alternatively, users can click on individual countries, which will provide that actor’s position on all Barometer topics. The Barometer also offers expert interviews, explanatory animations, written analyses, and infographics to further contextualize these complex issues for the benefit of policy experts and the public alike.</p>
      </div>
      <div class="section-panel | stack">
        <h2 class="h5">Methodology</h2>
        <p>The Barometer team regularly identifies pressing topics shaping the transatlantic relationship, in conversations with experts on both sides of the Atlantic. The team then drafts policy entries centered around statistical data, official government documents, multilateral reports, and current legislation. The primary sources for all referenced information are transparently cited next to each policy overview. When additional clarification on a country’s position is needed, the Barometer team contacts subject matter experts from that country. All information goes through an extensive peer review process, and the Barometer team regularly solicits feedback from the diplomatic, policy, and academic community.</p>
        
        <h2 class="h5">Related Projects</h2>
        <ul class="homepage__related-projects | stack">
          <li>
            <a href="https://www.bfna.org/" target="_blank" rel="noopener">
              Bertelsmann Foundation North America
              <span class="icon" size="xs">open_in_new</span>
            </a>
          </li>
          <li>
            <a href="https://transatlanticperiscope.org/" target="_blank" rel="noopener">
              Transatlantic Periscope
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
            <a href="http://eupinions.eu" target="_blank" rel="noopener">
              Eupinions
              <span class="icon" size="xs">open_in_new</span>
            </a>
          </li>
          <li>
            <a href="http://bti-project.org" target="_blank" rel="noopener">
              Bertelsmann Transformation Index (BTI)
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
  { label: 'Countries', slot: 'regions', count: 0, class: '' },
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