<template>
  <bar-section class="topics-section">
    <h1>Topics</h1>
    <div class="topics-section__filters | cluster">
      <select name="topic-filter" id="topic-filter" split-left>
        <option value="all">All</option>
        <option value="topic1">Topic 1</option>
        <option value="topic2">Topic 2</option>
        <option value="topic3">Topic 3</option>
      </select>
      <bar-button variant="secondary" color="base-300" size="s">Sorted by: Most Recent</bar-button>
      <bar-button variant="secondary" color="base-300" size="s" split-right>View Archived Topics</bar-button>
    </div>

    <div class="topics-grid">
      <div v-for="i in 15" :key="i" class="topic-card">
        <div class="aux-card">
          <h3>Topic</h3>
        </div>
      </div>
    </div>
  </bar-section>
</template>

<script setup>

</script>

<style lang="scss" scoped>
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

.topic-card {

  &:hover {
  }
}
</style>