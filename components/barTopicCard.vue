<template>
  <div class="topic-card | stack">
    <h3>{{ topic.title }}</h3>
    <p class="margin-bottom:auto">{{ formatedDate }}</p>
    <span v-if="topic.new" class="topic-card__new | topic-new">New</span>
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

  const formatedDate = computed(() => {
    if (!topic.period) return ''
    const date = new Date(topic.period)
    const month = date.toLocaleString('en-US', { month: 'short' })
    const year = String(date.getFullYear()).slice(-2)
    return `${month} '${year}`
  })


</script>

<style scoped lang="scss">
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

  &:hover {
    background-color: var(--base-color);
    box-shadow: var(--box-shadow-m);
    color: var(--white-color);
  }

  cursor: pointer;
}

.topic-card h3 {
  font-weight: 700;
  line-height: 1.3;
  font-size: var(--size-1);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.topic-card__category {
  font-size: var(--size--1);
  color: var(--base-color-50-tint);
}

.topic-new {
  width: 3.5rem;
  text-align: center;
  background-color: var(--accent-color);
  font-size: var(--size--2);
  padding: var(--space-3xs) var(--space-2xs);
  border-radius:  var(--space-xs);
  color: var(--white-color);
}
</style>