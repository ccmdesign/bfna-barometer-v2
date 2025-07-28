<template>
  <div class="subgrid">
    <div class="custom_infographic-card__wrapper">
      <NuxtLink 
        :to="data.customInfographicFile.url"
        target="_blank">
        <div class="custom_infographic-card">
          <img :src="data.customInfographicFile.url" :alt="data.title" class="custom_infographic-card__image">
          <div class="custom_infographic-card__content | cluster">
            <div class="custom_infographic-card__content-inner | text-align:left" split-right>
              <h3>{{ data.title }}</h3>
              <p>{{ data.infographicDescription }}</p>
            </div>
            <bar-button visual="primary" size="s" color="accent" :to="data.customInfographicFile.url" target="_blank">Download</bar-button>
          </div>
        </div>
      </NuxtLink>
    </div>
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

.custom_infographic-card {
  border-radius: var(--border-radius-l);
  border: 1px solid var(--base-color-20-tint);
  background-color: var(--base-color-05-tint);
  box-shadow: var(--box-shadow-s);
  overflow: hidden;
}

.custom_infographic-card__image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.custom_infographic-card__content {
  padding: var(--space-m);
}
</style>