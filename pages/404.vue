<template>
  <bar-hero>
    <template #column_left>
      <hgroup class="stack">
        <h1>404 - Page Not Found</h1>
        <p>Sorry, the page you're looking for doesn't exist.</p>
        <div class="button-group | cluster">
          <bar-button el="button" color="base" variant="primary" @click="goHome">
            <span class="icon">home</span>
            Go Home
          </bar-button>
          <bar-button el="button" @click="goBack" color="faded" variant="primary">
            <span class="icon">arrow_back</span>
            Go Back
          </bar-button>
        </div>
      </hgroup>
    </template>
  </bar-hero>

  <bar-section color="faded">
    <div class="error-content">
      <div class="error-illustration">
        <span class="error-code">404</span>
      </div>
      <div class="error-details">
        <p>The page you're looking for might have been moved, deleted, or doesn't exist.</p>
      </div>
    </div>
  </bar-section>

  <bar-footer />
</template>

<script setup lang="ts">
const nuxtError = useError();
const router = useRouter();

const goHome = () => {
  if (nuxtError.value) {
    clearError({ redirect: '/' });
    return;
  }
  router.push('/');
};

const goBack = () => {
  if (nuxtError.value) {
    clearError();
  }
  router.back();
};

useHead({
  title: '404 - Page Not Found - Transatlantic Barometer',
  meta: [
    { name: 'description', content: 'The page you are looking for could not be found.' },
    { property: 'og:title', content: '404 - Page Not Found - Transatlantic Barometer' },
    { property: 'og:description', content: 'The page you are looking for could not be found.' },
    { property: 'og:image', content: '/assets/abstract.webp' },
    { name: 'twitter:title', content: '404 - Page Not Found - Transatlantic Barometer' },
    { name: 'twitter:description', content: 'The page you are looking for could not be found.' },
    { name: 'twitter:image', content: '/assets/abstract.webp' }
  ]
})
</script>

<style scoped>
.hero {
  background-image: url(/assets/abstract.webp);
  background-position: bottom right;
  background-size: 140% auto;
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-l);
}

.error-illustration {
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-code {
  font-size: clamp(6rem, 12vw, 12rem);
  font-weight: 700;
  color: var(--base-color-07);
  opacity: 0.2;
  line-height: 1;
}

.error-details p {
  font-size: var(--size-1);
  color: var(--base-color-07);
  max-width: 60ch;
  margin: 0 auto;
}

.button-group {
  --cluster-space: var(--space-s);
  margin-top: var(--space-m);
}

hgroup {
  --stack-space: var(--space-s);
}
</style>
