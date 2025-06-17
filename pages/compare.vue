<template>
  <bar-hero>
    <h1>Compare</h1>

    <div class="stack">
      <h3>Select two countries</h3>
      <div class="cluster">
        <bar-button color="white">Deselect All</bar-button>
        <bar-button color="white">Canada</bar-button>
        <bar-button color="white">United States</bar-button>
        <bar-button color="white">United Kingdom</bar-button>
        <bar-button color="white">France</bar-button>
        <bar-button color="white">Germany</bar-button>
        <bar-button color="white">Italy</bar-button>
        <bar-button color="white">Spain</bar-button>
        <bar-button color="white">Netherlands</bar-button>
        <bar-button color="white">Belgium</bar-button>
      </div>

      <h3>Select one or more topics</h3>
      <div class="cluster">
        <bar-button>Select All</bar-button>
        <bar-button>Democracy</bar-button>
        <bar-button>Economy</bar-button>
        <bar-button>Environment</bar-button>
        <bar-button>Health</bar-button>
        <bar-button>Education</bar-button>
        <bar-button>Technology</bar-button>
        <bar-button>Culture</bar-button>
      </div>
    </div>
  </bar-hero>

  <bar-section>
    <div class="cluster">
      <span split-left>Export Comparison</span>
      <bar-button variant="primary" color="base" size="small">PDF</bar-button>
      <bar-button variant="primary" color="base" size="small">CSV</bar-button>
    </div>
  </bar-section>
  
  <bar-compare-box size="l" />
  <bar-compare-box size="l" />
  
</template>

<script setup>

</script>

<style scoped>

</style>