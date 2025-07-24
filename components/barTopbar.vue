<template>
  <ccm-topbar class="topbar">
    <h1 unstyled><nuxt-link to="/" title="Transatlantic Barometer"><img src="/assets/barometer-logo.svg" alt="Transatlantic Barometer" /></nuxt-link></h1>
    <nav split-left>
      <ul class="topbar__nav | cluster">
        <li><bar-button el="a" href="/" color="white" size="s" variant="link">Home</bar-button></li>
        <li><bar-button el="a" href="/#about" color="white" size="s" variant="link">About</bar-button></li>
        <li><bar-button el="a" href="/compare" color="white" size="s" variant="primary">Compare</bar-button></li>
      </ul>
    </nav>
    <h2 unstyled class="hide-on-mobile">
      <a href="https://www.bfna.org" target="_blank" title="Bertelsmann Foundation" class="topbar__logo">
        <img src="/assets/bfna-logo.svg" alt="Bertelsmann Foundation" />
      </a>
    </h2>
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