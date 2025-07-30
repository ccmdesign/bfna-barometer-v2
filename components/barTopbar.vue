<template>
  <ccm-topbar class="topbar">
    <h1 unstyled><nuxt-link to="/" title="Transatlantic Barometer"><img src="/assets/barometer-logo.svg" alt="Transatlantic Barometer" /></nuxt-link></h1>
    <nav split-left>
      <ul class="topbar__nav | cluster">
        <li><bar-button el="a" href="/" color="white" size="s" variant="link">Home</bar-button></li>
        <li><bar-button el="a" @click.prevent="scrollToAbout" color="white" size="s" variant="link">About</bar-button></li>
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
const router = useRouter()
const route = useRoute()

const scrollToAbout = async () => {
  if (route.path === '/') {
    // If we're already on the homepage, just scroll
    const aboutSection = document.getElementById('about')
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' })
    }
  } else {
    // If we're on another page, navigate to homepage with query parameter
    await router.push('/?scrollTo=about')
  }
}
</script>

<style scoped>
.topbar {
  color: var(--white-color);
}

.topbar {
  /* Aux styles */
  li {
    margin-bottom: 0;
  }
}
</style>