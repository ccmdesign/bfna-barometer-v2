<template>
  <bar-section class="topics-section">
    <h1>Topics</h1>
    <div class="topics-section__filters | cluster">
      <select name="topic-filter" id="topic-filter">
        <option value="all">All</option>
        <option value="topic1">Topic 1</option>
        <option value="topic2">Topic 2</option>
        <option value="topic3">Topic 3</option>
      </select>
      <bar-button variant="secondary" color="base-300" size="s">Sorted by: Most Recent</bar-button>
      <bar-button variant="secondary" color="base-300" size="s">View Archived Topics</bar-button>
    </div>

    <div class="grid">
      <div v-for="i in 15" :key="i" class="grid-item">
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
</style>