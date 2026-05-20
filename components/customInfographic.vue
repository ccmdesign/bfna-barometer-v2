<template>
  <div class="subgrid">
    <div class="custom_infographic-card__wrapper">
      <component
        :is="hasFile ? 'NuxtLink' : 'div'"
        :to="hasFile ? data.customInfographicFile.url : undefined"
        :target="hasFile ? '_blank' : undefined">
        <div class="custom_infographic-card">
          <img
            v-if="hasFile"
            :src="data.customInfographicFile.url"
            :alt="data.title"
            class="custom_infographic-card__image"
            loading="lazy">
          <div class="custom_infographic-card__content | cluster">
            <div class="custom_infographic-card__content-inner | text-align:left" split-right>
              <h3>{{ data.title }}</h3>
              <p>{{ data.infographicDescription }}</p>
            </div>
            <bar-button
              v-if="hasFile"
              visual="primary" size="s" color="accent"
              :to="data.customInfographicFile.url" target="_blank">Download</bar-button>
            <div v-else class="empty-state"><p>No image available for this infographic.</p></div>
          </div>
        </div>
      </component>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    data: {
      type: Object,
      required: true
    }
  })

  const hasFile = computed(() => !!props.data?.customInfographicFile?.url)
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

.empty-state {
  color: var(--base-color-50-tint);
  padding: var(--space-m);
}
</style>