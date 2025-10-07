<script setup>
import { useFilterTags } from '~/stores/filter';

const props = defineProps({
  topics: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})


const { tags, archivedTags } = useFilterTags();
const selectedTag = ref('all')
const currenttags = computed(() => {
  return showArchivedTopics.value ? archivedTags : tags;
});

const emit = defineEmits(['show-topics'])
const handleFilters = () => {
  emit('show-topics', {
    sort: getSortKeyFromName(sortedBy.value),
    archived: showArchivedTopics.value,
    tag: selectedTag.value === 'all' ? null : selectedTag.value
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
  selectedTag.value = 'all'; // Reset tag filter when toggling archived topics
  showArchivedTopics.value = !showArchivedTopics.value;
  handleFilters();
}

watch(
  () => [props.topics, showArchivedTopics.value],
  () => {
    // Reset selectedTag if current tag is not present
    if (selectedTag.value !== 'all' && !currenttags.value.includes(selectedTag.value)) {
      selectedTag.value = 'all';
    }
  },
);

</script>

<template>
  <bar-section class="topics-section">
    <div class="topics-section__filters | cluster">
      <select class="bar-select" name="topic-filter" id="topic-filter" split-left v-model="selectedTag" @change="handleFilters" :disabled="loading">
        <option value="all">All Categories</option>
        <option v-for="item of currenttags" :value="item">{{ item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() }}</option>
      </select>
      <bar-button class="filter-button" variant="primary" color="base-faded" size="s" :disabled="loading" @click="handleSort(sortedBy)">
        <span class="icon" size="xs">sort</span>
        Sorted by: {{ sortedBy }}
      </bar-button>
      <bar-button class="filter-button" :class="{'archived-active': showArchivedTopics }" variant="primary" color="base-faded" size="s" split-right :disabled="loading" @click="handleArchivedTopics">
        <span class="icon" size="xs">archive</span>
        View Archived Topics
      </bar-button>
    </div>

    <div class="topics-grid">
      <div v-for="topic in topics" :key="topic.title" class="topic-card">
        <bar-topic-card :topic="topic" />
      </div>
    </div>
  </bar-section>
</template>

<style scoped>
/* @TODO: Se você achar tranquilo, o ideal seria criar um componente para o select, mas não quis complicar a manipulação dos dados. */
.bar-select {
  border-radius: var(--space-l);
  padding-block: calc(var(--space-2xs) * .85);
  padding-inline: var(--space-s) var(--space-l);
  font-size: var(--size-0);
  background-color: var(--base-color-05-tint);
  border: 1px solid var(--base-color-05-tint);
  color: var(--base-color);
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20height%3D%2224px%22%20viewBox%3D%220%20-960%20960%20960%22%20width%3D%2224px%22%20fill%3D%22%23080808%22%3E%3Cpath%20d%3D%22M480-344%20240-584l56-56%20184%20184%20184-184%2056%2056-240%20240Z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 0.7em top 50%, 0 0;
  background-size: 1.5rem auto, 100%;
  font-weight: 600;

  option {
    text-transform: capitalize;
  }
  @media (max-width: 36em) {
    width: 100%;
  }
  @media (max-width: 1024px) {
    flex-grow: 1;
  }

}

.topic-card {
  min-height: 9rem;
}

.filter-button {
  @media (max-width: 36em) {
    flex-grow: 1;
  }
}

.topics-section {
  grid-column: content-start / content-end;
  border-top: 1px solid var(--base-color-10-alpha);
  border-bottom: 1px solid var(--base-color-20-alpha);
}

.topics-section__filters {
  padding-block: var(--space-m);
}

.topics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--base-gutter);
  
  @media (max-width: 768px) { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));}
}

.archived-active {
  background-color: var(--accent-color);
  /* background-color: var(--color-base-200); */
  color: var(--color-base-900);
}


/* .button[size="xs"] {
  --_button-padding-block: var(--button-padding-block-xs);
  --_button-padding-inline: var(--button-padding-inline-xs);
  --_button-font-size: var(--button-font-size-xs);
}

.button[size="s"] {
  --_button-padding-block: var(--button-padding-block-s);
  --_button-padding-inline: var(--button-padding-inline-s);
  --_button-font-size: var(--button-font-size-s);
}

.button,
.button[size="m"] {
  --_button-padding-block: var(--button-padding-block-m);
  --_button-padding-inline: var(--button-padding-inline-m);
  --_button-font-size: var(--button-font-size-m);
}

.button[size="l"] {
  --_button-padding-block: var(--button-padding-block-l);
  --_button-padding-inline: var(--button-padding-inline-l);
  --_button-font-size: var(--button-font-size-l);
} */

</style>
