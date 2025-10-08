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
    <template #column_right v-if="topic.video || topic.deepDive">
      <youtube-player
        v-if="topic.video"
        :video-url="topic.video"
        :title="topic.title"
        class="video"
      />
      <youtube-player
        v-if="topic.deepDive.includes('youtube')"
        :video-url="topic.deepDive"
        :title="topic.title"
        class="video"
      />
      <a v-if="!topic.deepDive.includes('youtube')" :href="topic.deepDive" target="_blank" rel="noopener">
        <bar-button visual="primary" size="s" color="accent">Deep Dive</bar-button>
      </a>
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


.video {
  display: flex;
  justify-self: center;
  margin: auto;
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