<template>
  <ccm-master-grid>
    <bar-hero id="hero" />
    <slot />
    <bar-footer id="footer" />
  </ccm-master-grid>
</template>

<style>
#topbar {
  grid-row: 1 / 2;
  z-index: 2;
}

#hero {
  grid-row: 1 / 3;
  z-index: 1;
}

</style> 