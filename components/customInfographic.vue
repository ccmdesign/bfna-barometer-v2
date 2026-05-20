<template>
  <div v-if="data?.customInfographicFile?.url" class="subgrid">
    <div class="custom_infographic-card__wrapper">
      <NuxtLink
        :to="data.customInfographicFile?.url"
        target="_blank">
        <div class="custom_infographic-card">
          <div v-if="isPdf" class="custom_infographic-card__fallback" aria-hidden="true">
            <span class="custom_infographic-card__fallback-bar" style="--h: 38%"></span>
            <span class="custom_infographic-card__fallback-bar" style="--h: 62%"></span>
            <span class="custom_infographic-card__fallback-bar" style="--h: 46%"></span>
            <span class="custom_infographic-card__fallback-bar" style="--h: 78%"></span>
            <span class="custom_infographic-card__fallback-bar" style="--h: 30%"></span>
            <span class="custom_infographic-card__fallback-bar" style="--h: 56%"></span>
            <span class="custom_infographic-card__fallback-bar" style="--h: 42%"></span>
          </div>
          <img v-else :src="data.customInfographicFile?.url" :alt="data.title" class="custom_infographic-card__image" loading="lazy">
          <div class="custom_infographic-card__content | cluster">
            <div class="custom_infographic-card__content-inner | text-align:left" split-right>
              <h3>{{ data.title }}</h3>
              <p>{{ data.infographicDescription }}</p>
            </div>
            <bar-button visual="primary" size="s" color="accent" :to="data.customInfographicFile?.url" target="_blank">Open new tab</bar-button>
            <a visual="primary" size="s" color="accent" :href="data.customInfographicFile?.url+'?download'" download>Download</a>
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

  const isPdf = computed(() => {
    const file = data?.customInfographicFile
    return file?.type === 'application/pdf' || /\.pdf(\?|$)/i.test(file?.url ?? '')
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

.custom_infographic-card__fallback {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  background-color: #EDEFF0;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  gap: 2%;
  padding: 12% 8% 10%;
  filter: blur(10px);
}

.custom_infographic-card__fallback::after {
  content: '';
  position: absolute;
  left: 8%;
  right: 8%;
  bottom: 10%;
  height: 2px;
  background-color: #031A26;
  opacity: 0.25;
  filter: blur(2px);
}

.custom_infographic-card__fallback-bar {
  flex: 1;
  height: var(--h);
  border-radius: 4px 4px 0 0;
  background-color: #FF9933;
}

.custom_infographic-card__fallback-bar:nth-child(4n+2) {
  background-color: #031A26;
  opacity: 0.85;
}

.custom_infographic-card__content {
  padding: var(--space-m);
}
</style>