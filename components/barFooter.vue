<template>
  <ccm-footer class="bar-footer">
    <div class="footer-content | subgrid | stack | text-align:center">
      <h2 class="h2">Subscribe to our Newsletter</h2>
      <p>Each month, we will spotlight trending transatlantic topics and find potential alignment between the U.S., the U.K., and the European Union. Sign up here for updates!</p>
      <div class="switcher">
        <input type="text" placeholder="Name" class="input" />
        <input type="email" placeholder="Email" class="input" />
      </div>
      <bar-button class="align-self:center justify-self:center" color="accent" variant="primary">Submit Now <span class="icon">arrow_forward</span></bar-button>
    </div>
    <bar-by-line />
  </ccm-footer>
</template>

<script setup>

</script>

<style scoped lang="scss">
.bar-footer {
  --footer-gradient-color: var(--base-color-07-tint);
  background-color: var(--base-color);
  color: var(--white-color);
  padding-block: var(--space-2xl) var(--space-xs);
  position: relative;
  overflow: hidden;
  & > * {
    position: relative;
    z-index: 3;
  }
  &::after {
    content: '';
    position: absolute;
    bottom: 0% ;
    left: -350%;
    right: -350%;
    top: -175%;
    z-index: 1;
    background: radial-gradient(ellipse at bottom, transparent 0%, transparent 25%, var(--footer-gradient-color) 25%, var(--footer-gradient-color) 100%);
  }
}

.footer-content {
  p {
  }
  @media (min-width: 768px) {
    grid-column: 5 / 11;
  }
}
</style>