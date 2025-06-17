<template>
  <ccm-topbar class="topbar">
    <h1 class="h2"><nuxt-link to="/">Transatlantic Barometer</nuxt-link></h1>
    <nav split-left>
      <ul class="topbar__nav | cluster">
        <li><ccm-button el="a" href="/topic" color="white" variant="link">Topic</ccm-button></li>
        <li><ccm-button el="a" href="/region" color="white" variant="link">Region</ccm-button></li>
        <li><ccm-button el="a" href="/compare" color="base" variant="primary">Compare</ccm-button></li>
      </ul>
    </nav>
    <h2><nuxt-link to="/">BFNA Logo</nuxt-link></h2>
  </ccm-topbar>
</template>

<script setup>

</script>

<style scoped>
.topbar {
  color: var(--white-color);
}

.topbar {
  /* Aux styles */
}
</style>