<template>
  <bar-hero class="print:hidden">
    <template #column_left>
      <hgroup class="stack">
        <h1>Comparison Tool</h1>

        <div class="stack">
          <h2 class="h5 uppercase">Select two countries</h2>
          <div class="cluster">
            <!-- <bar-button color="white" size="s">Deselect All</bar-button> -->
            <bar-button :style="{ 'opacity': country.active ? '1' : '0.3' }" v-for="country in availableCountries" :color="country.active ? 'white' : 'faded'" variant="primary" size="s" @click="handleSelectedCountry(country.code)" :key="country.code">{{ country.label }}</bar-button>
          </div>

          <h2 class="h5 uppercase">Select one or more topics</h2>
          <div class="cluster">
            <bar-button color="white" size="s" @click="handleSelectAllTopics">Select All</bar-button>
            <bar-button size="s" :color="topic.active ? 'white' : 'faded'" variant="primary" v-for="topic in availableTopics" :key="topic.title" @click="handleSelectedTopic(topic.topicId)">{{ topic.title }} <span class="topic-date">{{ topic.period }}</span> <span class="topic-new" v-if="topic.new">new</span></bar-button>
          </div>
        </div>
      </hgroup>
    </template>
  </bar-hero>

  <bar-section class="margin-top:m print:hidden">
          <div v-if="statements" class="cluster">
        <span split-left>Export Comparison:</span>
        <bar-button variant="secondary" color="base" size="s" @click="handleDownloadPDF" :class="{ 'export-download-btn': !statements.length }"><span class="icon">vertical_align_bottom</span>PDF</bar-button>
        <bar-button variant="secondary" color="base" size="s" @click="handleDownloadCSV" :class="{ 'export-download-btn': !statements.length }"><span class="icon" >vertical_align_bottom</span>CSV</bar-button>
      </div>
    <div v-else>
      <h2 class="h5 uppercase text-align:center">Make a Selection to start</h2>
    </div>
  </bar-section>
  
  <bar-compare-box v-if="statements" class="margin-bottom:l" :dataset="statements" @remove-topic="(pay) => handleRemoveTopic(pay)" />
  
  <bar-section v-if="statements" class="print:hidden">
    <div class="repel">
      <bar-button variant="primary" color="gray" size="s" @click="scrollToTop">Back to Top<span class="icon">arrow_upward</span></bar-button>

              <div class="cluster">
          <span split-left>Export Comparison:</span>
          <bar-button variant="secondary" color="base" size="s" @click="handleDownloadPDF"><span class="icon">vertical_align_bottom</span>PDF</bar-button>
          <bar-button variant="secondary" color="base" size="s" @click="handleDownloadCSV" :class="{ 'export-download-btn': !statements.length }"><span class="icon">vertical_align_bottom</span>CSV</bar-button>
        </div>
    </div>
  </bar-section>

</template>

<script setup>
import { useStatementStore } from '~/stores/statements';
import { statementsToCSV, downloadCSV } from '~/utils/csv';
const { countries, getCountryName } = useCountries();
const availableCountries = ref([])
const availableTopics = ref([])

// Fetch topics based on filters
const { data: topics } = await useAsyncData('topics', () => {
  let query = queryCollection('topics')
  // Always use boolean for isArchived
  query = query.select('title', 'description', 'slug', 'new', 'active', 'topicId', 'period', 'periodWithDay', 'isArchived', 'infographics')
  query = query.where('isArchived', '=', false)
  query = query.order('periodWithDay', 'DESC')
  
  return query.all()

})

const statements = ref(null)
const selectedCountries = ref([])
const selectedTopics = ref([])
const handleSelectedCountry = (code) => {
  // If the country is already selected, do nothing.
  if (selectedCountries.value.includes(code)) {
    return;
  }

  // Replace the oldest selected country with the new one.
  if (selectedCountries.value.length >= 2) {
    selectedCountries.value.shift();
  }
  selectedCountries.value.push(code);

  availableCountries.value = availableCountries.value.map(country => {
    country.active = selectedCountries.value.includes(country.code);
    return country;
  });
  
  if (selectedTopics.value.length && selectedCountries.value.length === 2) {
    handleStatementsFromSelectedCountries();
  }
};

const handleSelectedTopic = (topicId) => {
  availableTopics.value = availableTopics.value.map(topic => {
    if (topic.topicId === topicId) {
      topic.active = !topic.active; // Toggle active state
    }
    return topic;
  });

  selectedTopics.value = availableTopics.value.filter(topic => topic.active);
  handleStatementsFromSelectedCountries();
}

const handleSelectAllTopics = () => {
  const isAll = availableTopics.value.every(topic => topic.active);
  availableTopics.value = availableTopics.value.map(topic => {
    topic.active = !isAll; // Set all topics to active or inactive based on isAll
    return topic;
  });

  selectedTopics.value = availableTopics.value.filter(topic => topic.active);
  handleStatementsFromSelectedCountries();
}

const handleRemoveTopic = (topic) => {
  selectedTopics.value = selectedTopics.value.filter(t => t.topicId !== topic.topicId);
  availableTopics.value = availableTopics.value.map(t => {
    if (t.topicId === topic.topicId) {
      t.active = false; // Set the removed topic as inactive
    }
    return t;
  });

  if (selectedTopics.value.length === 0) {
    statements.value = null;
  }

  if (selectedCountries.value.length >= 2) {
    handleStatementsFromSelectedCountries();
  } else {
    statements.value = null; // Clear statements if less than 2 countries are selected
  }
}

const statementStore = useStatementStore()
const handleStatementsFromSelectedCountries = () => {
  if (selectedCountries.value.length < 2) {
    return;
  }
  
  if (!selectedTopics.value.length) return;
  statements.value = statementStore.getStatementByTopicAndCountryCode(selectedTopics.value, selectedCountries.value);

}

const route = useRoute()
const initComparison = () => {
  const { regions, topics } = route.query;
  let codes = regions ? regions.split(',') : [];
  const topicsIds = topics ? topics.split(',') : [];

  // Ensure there are always exactly two countries selected.
  if (codes.length !== 2) {
    codes = ['eu', 'us']; // Default to EU and US.
  }

  if (topicsIds.length === 0 && availableTopics.value.length > 0) {
    const newTopic = availableTopics.value.find(topic => topic.new);
    if (newTopic) {
      topicsIds.push(newTopic.slug);
    }
  }

  selectedCountries.value = codes;
  availableCountries.value.forEach(item => {
    item.active = codes.includes(item.code);
  });

  selectedTopics.value = [];
  availableTopics.value.forEach(topic => {
    topic.active = topicsIds.includes(topic.slug);
    if (topic.active) {
      selectedTopics.value.push(topic);
    }
  });

  handleStatementsFromSelectedCountries();
};

const updateRouteQuery = () => {
  const regions = selectedCountries.value.join(',');
  const topics = selectedTopics.value.map(topic => topic.slug).join(',');
  // Update the route query: clear query if regions or topics is empty
  const router = useRouter();
  if (!regions && !topics) {
    router.replace({ query: {} });
  } else {
    router.replace({ query: { regions, topics } });
  }
}

watch([selectedCountries, selectedTopics], () => {
  updateRouteQuery();
},{ deep: true });


const handleDownloadCSV = () => {
  if (!statements.value || !statements.value.length) return;

  const csv = statementsToCSV(statements.value)
  downloadCSV(csv);
}

const handleDownloadPDF = () => {
  window.print();
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

onMounted(async () => {
  // Initialize availableCountries with all countries
  availableCountries.value = await Promise.all(countries.value.map(async code => ({
    code: code,
    label: await getCountryName(code),
    active: false
  })));

  availableTopics.value = topics.value.map(topic => ({
    ...topic,
  }));

  initComparison();

});

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

.export-download-btn {
  opacity: 0.1;
  pointer-events: none;
}

@media print {
  h1, h2, h3, h4, h5, h6 {
    color: #000 !important;
    text-shadow: none !important;
  }

 :deep(p) {
    font-size: 12px !important;
  }

  a {
    text-decoration: underline !important;
    color: #000 !important;
  }

  body, html {
    background: #fff !important;
    color: #000 !important;
  }
}
</style>
