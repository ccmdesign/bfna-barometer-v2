<script setup>
const props = defineProps({
  topics: {
    type: Array,
    required: true
  }
})

const selectedTag = ref('all')
const tags = computed(() => {
  return props.topics
    .flatMap(topic => topic.tags && topic.tags.length ? topic.tags : [])
    .map(tag => tag.toUpperCase());
})

const emit = defineEmits(['show-topics'])
const handleFilters = () => {
  emit('show-topics', {
    sort: getSortKeyFromName(sortedBy.value),
    archived: showArchivedTopics.value,
    tags: selectedTag.value === 'all' ? [] : [selectedTag.value]
  })
}

const getSortKeyFromName = (sortName) => {
  switch (sortName) {
    case "Most Recent":
      return "DESC";
    case "Oldest":
      return "ASC";
    default:
      return "Most Recent";
  }
};

const sortedBy = ref('Most Recent')
const handleSort = (val) => {
  sortedBy.value = val === 'Most Recent' ? 'Oldest' : 'Most Recent';
  handleFilters();
}

const showArchivedTopics = ref(false)
const handleArchivedTopics = () => {
  showArchivedTopics.value = !showArchivedTopics.value;
  handleFilters();
}

</script>

<template>
  <bar-section class="topics-section">
    <h1>Topics</h1>
    <div class="topics-section__filters | cluster">
      <select name="topic-filter" id="topic-filter" split-left v-model="selectedTag" @change="handleFilters">
        <option value="all">All Tags</option>
        <option v-for="item of tags" :value="item">{{ item }}</option>
      </select>
      <bar-button variant="secondary" color="base-300" size="s" @click="handleSort(sortedBy)">Sorted by: {{ sortedBy }}</bar-button>
      <bar-button :class="{'archived-active': showArchivedTopics }" variant="secondary" color="base-300" size="s" split-right @click="handleArchivedTopics">View Archived Topics</bar-button>
    </div>

    <div class="topics-grid">
      <div v-for="topic in topics" :key="topic.title" class="topic-card">
        <bar-topic-card :topic="topic" />
      </div>
    </div>
  </bar-section>
</template>

<style scoped>
.topics-section {
  grid-column: content-start / content-end;
}

.topics-section__filters {
  padding-block: var(--space-m);
}

.topics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--base-gutter);
}

.archived-active {
  background-color: var(--accent-color);
  /* background-color: var(--color-base-200); */
  color: var(--color-base-900);
}

</style>