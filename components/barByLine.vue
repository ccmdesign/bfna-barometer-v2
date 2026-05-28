<template>
  <ccm-by-line site-name="Transatlantic Barometer">
    <a href="/assets/Privacy-Policy.pdf" target="_blank" rel="noopener noreferrer">Privacy</a>
    <a href="#" @click.prevent="openCookieModal">Cookies</a>
  </ccm-by-line>
</template>

<script setup>
const { openCookieModal } = useCookieControl();
</script>

<style scoped>
:deep(a) {
  color: var(--base-color-70-tint);
}

:deep(a:hover) {
  color: var(--white-color);
}
</style>