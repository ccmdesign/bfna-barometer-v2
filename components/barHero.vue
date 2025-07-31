<template>
  <ccm-hero class="hero">
    <bar-topbar id="topbar" />
    <div class="hero-content | padding-block:2xl">
      <div class="hero-content__inner | stack">
        <slot name="column_left">
          <hgroup class="stack">
            <p class="h2">Welcome to the</p>
            <h1>Transatlantic Barometer</h1>
          </hgroup>
          
          <p class="font-size:1 | color:base-40-tint">This interactive multimedia site provides its users with quick facts, visual representations, and reliable information on pressing transatlantic challenges.</p>

          <div class="cluster">
            <bar-button variant="primary" color="white" @click="goDownToMapSection"><span>Start Now</span><span class="icon">arrow_downward</span></bar-button>
            <bar-button variant="primary" color="faded"><span class="icon">play_arrow</span><span>Watch Video</span></bar-button>
          </div>
        </slot>
      </div>
      <div class="hero-content__inner | stack">
        <slot name="column_right">
          <iframe v-if="useRouter().currentRoute.value.name === 'index'"
            class="hero__video" 
            src="https://www.youtube.com/embed/ervofXVlR_w" 
            title="YouTube video player" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerpolicy="strict-origin-when-cross-origin" 
            allowfullscreen>
          </iframe>
        </slot>
      </div>
    </div>
    <barCurve />
  </ccm-hero>
</template>

<script setup>

const goDownToMapSection = () => {
  const mapSection = document.getElementById('map');
  if (mapSection) {
    mapSection.scrollIntoView({ behavior: 'smooth' });
  }
}
  
</script>

<style scoped lang="scss">
.hero {
  --bar-curve-color: var(--white-color);
  background-color: var(--base-color);
  display: grid;
  grid-template-columns: subgrid;
  grid-template-rows: auto 1fr auto;
  position: relative;
  overflow: hidden;
  & > * {
    position: relative;
    z-index: 3;
  }
  .h2, h1 {
    font-weight: 700;
  }
}

.hero-content__inner {
  @media (max-width: 1024px) {
    padding-top: var(--space-m);
  }
}

.hero__video {
  display: flex;
  justify-self: center;
  margin: auto;
  aspect-ratio: 16/9;
  max-width: 800px;
  object-fit: cover;
  border-radius: var(--border-radius-s);
  box-shadow: var(--box-shadow-l);
  border: 3px solid var(--white-color);
}

.hero-content {
  grid-column: content-start / content-end;
  grid-row: 2 / 3;
  color: var(--white-color);

  /* --_stack-space: var(--space-m); */

  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-m);
  }

  
}

:deep(hgroup) {
    --_stack-space: var(--space-2xs);
  }

.hero {
  padding-block: var(--space-xs) var(--space-2xl);
}

:deep(.bar-curve) {
  position: absolute;
  bottom: 0;
  grid-column: full-start / full-end;
}
</style>