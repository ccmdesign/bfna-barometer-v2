<template>
  <ccm-footer>
    <div class="footer-content | subgrid | stack | text-align:center">
      <h2 class="h2">Subscribe to our Newsletter</h2>
      <p>Each month, we will spotlight trending transatlantic topics and find potential alignment between the U.S., the U.K., and the European Union. Sign up here for updates!</p>
      <div class="switcher">
        <input type="text" placeholder="Name" class="input" />
        <input type="email" placeholder="Email" class="input" />
      </div>
      <bar-button color="accent" variant="primary">Submit Now</bar-button>
    </div>
    <bar-by-line />
  </ccm-footer>
</template>

<script setup>

</script>

<style scoped>
.footer-content {
  
  @media (min-width: 768px) {
    grid-column: narrow-start / narrow-end;
  }
}
</style>