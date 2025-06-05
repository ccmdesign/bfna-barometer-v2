<template>
  <ccm-hero class="hero">
    <bar-topbar id="topbar" />
    <div class="hero-content">
      
      <h3>Welcome to the</h3>
      <h1>Transatlantic Barometer</h1>
      
      <p>This interactive multimedia site provides its users with quick facts, visual representations, and reliable information on pressing transatlantic challenges.</p>

      <div class="cluster">
        <bar-button variant="primary" color="white">Start Now</bar-button>
        <bar-button variant="secondary" color="white-alpha-10">Watch Video</bar-button>
      </div>
    </div>
  </ccm-hero>
</template>

<script setup>

</script>

<style lang="scss" scoped>
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
}
</style>