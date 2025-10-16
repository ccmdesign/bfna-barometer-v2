<template>
  <NuxtLayout name="default">
    <Error404Page v-if="is404" />
    <div v-else class="error-wrapper">
      <h1>{{ statusCode }}</h1>
      <p>{{ statusMessage }}</p>
      <bar-button el="button" color="base" variant="primary" @click="handleNavigateHome">
        <span class="icon">home</span>
        Go Home
      </bar-button>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Error404Page from '~/pages/404.vue';

const nuxtError = useError();

const is404 = computed(() => (nuxtError.value?.statusCode ?? nuxtError.value?.status) === 404);
const statusCode = computed(() => nuxtError.value?.statusCode ?? nuxtError.value?.status ?? 500);
const statusMessage = computed(() => nuxtError.value?.statusMessage ?? 'Something went wrong.');

const handleNavigateHome = () => {
  clearError({ redirect: '/' });
};
</script>

<style scoped>
.error-wrapper {
  display: grid;
  place-content: center;
  text-align: center;
  gap: var(--space-m);
  min-height: 100vh;
  padding: var(--space-xl);
}

h1 {
  font-size: clamp(3rem, 8vw, 6rem);
  margin: 0;
}

p {
  font-size: var(--size-1);
  color: var(--base-color-07);
  margin: 0;
}
</style>
