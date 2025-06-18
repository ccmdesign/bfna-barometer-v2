<template>
  <ccm-hero class="hero">
    <bar-topbar id="topbar" />
    <div class="hero-content | padding-block:2xl">
      <div class="hero-content__inner | stack">
        <slot name="column_left">
          <hgroup class="stack">
            <h3>Welcome to the</h3>
            <h1>Transatlantic Barometer</h1>
          </hgroup>
          
          <p class="color:base-40-tint">This interactive multimedia site provides its users with quick facts, visual representations, and reliable information on pressing transatlantic challenges.</p>

          <div class="cluster">
            <bar-button variant="primary" color="white"><span>Start Now</span><span class="icon">download</span></bar-button>
            <bar-button variant="primary" color="faded"><span class="icon">play_arrow</span><span>Watch Video</span></bar-button>
          </div>
        </slot>
      </div>
      <div class="hero-content__inner | stack">
        <slot name="column_right"></slot>
      </div>
    </div>
  </ccm-hero>
</template>

<script setup>

</script>

<style scoped>
.hero {
  background-color: var(--base-color);
  display: grid;
  grid-template-columns: subgrid;
  grid-template-rows: auto 1fr auto;
}

.hero-content {
  grid-column: content-start / content-end;
  grid-row: 2 / 3;
  color: var(--white-color);

  @media (min-width: 768px) {
  display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-m);
  }

  --_stack-space: var(--space-m);

  hgroup {
    --_stack-space: var(--space-3xs);
  }
}

.hero {
  padding-block: var(--space-xs) var(--space-2xl);
}
</style>