<template>
  <nuxt-link :to="`/topic/${topic.slug}`" class="topic-card fx-flip-3d">
    <div class="topic-card__face topic-card__face--front fx-flip-3d__face | stack">
      <h3>{{ topic.title }}</h3>
      <p class="margin-bottom:auto">{{ formatedDate }}</p>
      <span v-if="topic.new" class="topic-card__new | topic-new">New</span>
      <span class="topic-card__category">{{ tags }}</span>
    </div>
    <div class="topic-card__face topic-card__face--back fx-flip-3d__face fx-flip-3d__face--back | stack" aria-hidden="true">
      <h3>{{ topic.title }}</h3>
      <p class="margin-bottom:auto">{{ formatedDate }}</p>
      <span v-if="topic.new" class="topic-card__new | topic-new">New</span>
      <span class="topic-card__category">{{ tags }}</span>
    </div>
  </nuxt-link>
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
  @media (min-width: 768px) { aspect-ratio: 1 / 1; }
  @media (max-width: 768px) { height: 100%; }

  display: block;
  border-radius: var(--border-radius-l);
  text-align: left;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.6s ease;

  &:hover,
  &:focus-visible {
    transform: rotateY(180deg);
  }
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
  color: var(--base-color);
}

.topic-card__face {
  border-radius: inherit;
  border: 1px solid var(--base-color-20-tint);
  padding-inline: var(--space-m);
  padding-block: var(--space-s);
  box-shadow: var(--box-shadow-s);
  background-color: var(--base-color-05-tint);
  color: inherit;
  display: flex;
  flex-direction: column;
  height: 100%;
  --_stack-space: var(--space-3xs);
}

.topic-card__face--front p {
  color: var(--base-color);
}

.topic-card__face--back {
  background-color: var(--base-color);
  box-shadow: var(--box-shadow-m);
  color: var(--white-color);

  h3,
  p,
  .topic-card__category {
    color: var(--white-color);
  }
}

.topic-card__category {
  font-size: var(--size--1);
  color: var(--base-color-50-tint);
}

.topic-card__face--back .topic-card__category {
  color: var(--white-color);
}

.topic-new {
  width: 3.5rem;
  text-align: center;
  background-color: var(--accent-color);
  font-size: var(--size--2);
  padding: var(--space-3xs) var(--space-2xs);
  border-radius: var(--space-xs);
  color: var(--white-color);
}
</style>
