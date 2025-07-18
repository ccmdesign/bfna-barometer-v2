<template>
  <div class="custom_infographic-card__wrapper">
    <NuxtLink 
      :to="data.customInfographicFile.url"
      target="_blank">
      <div class="custom_infographic-card | stack">
        <h3>{{ data.title }}</h3>
        <p>{{ data.infographicDescription }}</p>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup>
  const { data } = defineProps({
    data: {
      type: Object,
      required: true
    }
  })

</script>

<style scoped lang="scss">

.custom_infographic-card__wrapper {
  width: max-content;
}

a {text-decoration: none;}

.custom_infographic-card {
  display: flex;
  justify-content: center;
  
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
  }
}

.custom_infographic-card h3 {
  font-weight: 700;
  line-height: 1.3;
  font-size: var(--size-1);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.custom_infographic-card__category {
  font-size: var(--size--1);
  color: var(--base-color-50-tint);
}
</style>