<template>
  <bar-hero>
    <template #column_left>
      <hgroup class="stack">
        <bar-back-button />
        <p class="font-weight:700">Governance & Democracy</p>
        <h1>{{ topic.title }}</h1>
        <p class="margin-bottom:m">Statements compiled in {{ topic.period }}</p>
        <p>{{ topic.description }}</p>
      </hgroup>
    </template>
    <template #column_right v-if="topic.video">
      <div class="video-block">
        <h4 class="video-block__title">Expert Interview</h4>
        <youtube-player
          :video-url="topic.video"
          :title="topic.title"
          class="video"
        />
      </div>
    </template>
  </bar-hero>


  <bar-section>
    <h2 class="h4">Select the country</h2>
  </bar-section>

  <bar-section>
    <bar-map-section id="map" :topic="topic.slug" :archived="topic.isArchived" />
  </bar-section>

  <bar-footer id="footer" />
</template>

<script setup>
const route = useRoute()
const { data: topic } = await useAsyncData('topic', () => queryCollection('topics')
  .where('slug', '=', route.params?.slug)
  .first())


</script>

<style scoped lang="scss">
hgroup {
  --_stack-space: var(--space-2xs);
}

.with-sidebar {
  aside { min-width: 23%; /* @TODO: Magic number to align with the subgrid. O ideal seria termos essa sidebar definida no subgrid. */ }
}

.topic-page__sidebar {
  --_stack-space: var(--space-2xs);
}

.infographics-tabs :deep(.ccm-tabs__tabs) {
  --_cluster-space: var(--space-xl);
}

.hero {
  background-image: url(/assets/abstract.webp);
  background-position: bottom right;
  background-size: 140% auto;
}

.bar-footer {
  --bar-curve-color: var(--white-color);
}

.video-block {
  display: grid;
  gap: var(--space-s);
  justify-items: start;
  margin-inline: auto;
  width: min(100%, 1024px);
}

.video-block__title {
  margin: 0;
}

.video {
  display: flex;
  justify-self: stretch;
  width: 100%;
  margin: 0;
  aspect-ratio: 16/9;
  max-width: 1024px;
  object-fit: cover;
  border-radius: var(--border-radius-s);
  box-shadow: var(--box-shadow-l);
  border: 3px solid var(--white-color);
}

:deep(.map-section) {
  grid-column: full-start / full-end;
}
</style>
