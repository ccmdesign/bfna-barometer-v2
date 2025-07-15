<template>
  <div class="topic-card | stack">
    <h3>{{ topic.topic }}</h3>
    <p class="margin-bottom:auto">{{ topic.period }}</p>
    <span v-if="topic.new" class="topic-card__new" >New</span>
    <span class="topic-card__category">{{ tags }}</span>
  </div>
</template>

<script setup>
  const { topic } = defineProps({
    topic: {
      type: Object,
      required: true
    }
  })

  const tags = computed(() => {
    return topic.tags ? topic.tags.join(', ').toUpperCase() : ''
  })


</script>

<style scoped>
.topic-card {
  border-radius: var(--border-radius-l);
  border: 1px solid var(--base-color-20-tint);
  padding-inline: var(--space-m);
  padding-block: var(--space-s);
  background-color: var(--base-color-05-tint);
  box-shadow: var(--box-shadow-s);
  text-align: left;
  aspect-ratio: 1 / 1;
  --_stack-space: var(--space-3xs);
}

.topic-card h3 {
  font-weight: 700;
  line-height: 1.3;
  font-size: var(--size-1);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.topic-card__category {
  font-size: var(--size--1);
  color: var(--base-color-50-tint);
}
</style>