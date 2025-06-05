<template>
  <div class="subgrid" :title="title">
    <div class="aux-card">
      <h3>{{ title }}</h3>
    </div>
    <div class="tags | cluster" centered>
      <bar-tag v-for="i in 33" :key="i">Tag</bar-tag>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>

<style scoped>
.tags {
  padding-block: var(--space-s);
}

.aux-card {
  width: 100%;
  aspect-ratio: 16/9;
}
</style>