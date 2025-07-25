<template>
  <ccm-hero class="hero">
    <bar-topbar id="topbar" />
    <div class="hero-content | padding-block:2xl">
      <div class="hero-content__inner | stack">
        <slot name="column_left">
          <hgroup class="stack">
            <h3 class="h2">Welcome to the</h3>
            <h1>Transatlantic Barometer</h1>
          </hgroup>
          
          <p class="font-size:2 | color:base-40-tint">This interactive multimedia site provides its users with quick facts, visual representations, and reliable information on pressing transatlantic challenges.</p>

          <div class="cluster">
            <bar-button variant="primary" color="white" @click="goDownToMapSection"><span>Start Now</span><span class="icon">arrow_downward</span></bar-button>
            <bar-button variant="primary" color="faded"><span class="icon">play_arrow</span><span>Watch Video</span></bar-button>
          </div>
        </slot>
      </div>
      <div class="hero-content__inner | stack ">
        <slot name="column_right"></slot>
      </div>
    </div>
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
  --hero-gradient-color: var(--white-color);
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
  &::after {
    content: '';
    position: absolute;
    top: 0% ;
    left: -350%;
    right: -350%;
    bottom: -175%;
    z-index: 1;
    background: radial-gradient(ellipse at top, transparent 0%, transparent 25%, var(--hero-gradient-color) 25%, var(--hero-gradient-color) 100%);
  }
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
</style>