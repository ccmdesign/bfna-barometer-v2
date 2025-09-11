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
    <barCurve />
  </ccm-footer>
</template>

<script setup>

</script>

<style scoped lang="scss">
.bar-footer {
  --bar-curve-color: var(--base-color-07-tint);
  background-color: var(--base-color);
  background-image: url(/assets/barometer-footer.svg);
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: bottom left;
  color: var(--white-color);
  padding-block: var(--space-2xl) var(--space-xs);
  position: relative;
  overflow: hidden;
  & > * {
    position: relative;
    z-index: 3;
  }
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--bar-curve-color);
  }
}

.footer-content {
  p {
  }
  @media (min-width: 768px) {
    grid-column: 5 / 11;
  }
}

:deep(.bar-curve) {
  position: absolute;
  top: 0;
  grid-column: full-start / full-end;
  transform: rotate(180deg);
}
</style>