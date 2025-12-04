<template>
  <div class="bar-indicator-card | stack" :data="data">
    <h2 v-if="data.period">{{ data.period }}</h2>
    <h2 v-else>{{ data.score }}<span v-if="data.displayScaleLimit"> / {{ data.scale }}</span></h2>
    <h3>{{ data.indicator }}</h3>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.bar-indicator-card {
  background-color: var(--white-color);
  padding: var(--space-m) var(--space-l);
  border-radius: var(--border-radius-l);
  text-align: center;
  @media screen and (min-width: 1024px) {
    max-width: 25%;
  }

  h2 {
    font-weight: 700;
    font-size: calc(var(--size-4) * 1.25);
    letter-spacing: -1%;

    span {
      font-weight: 700;
      font-size: var(--size-2);
      line-height: 120%;
      letter-spacing: -1%;
      color: var(--base-color-40-tint);
    }
  }

  h3 {
    font-weight: 700;
    font-size: var(--size-0);
    text-transform: uppercase;
  }
}
</style>