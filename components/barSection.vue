<template>
  <ccm-base-section class="bar-section" :size="size">
    <slot>
      <h1>Bar Section</h1>
    </slot>
    
  </ccm-base-section>
</template>

<script setup>
const props = defineProps({
  size: {
    type: String,
    default: 'm',
  },
});
</script>

<style lang="scss" scoped>
.bar-section[size="l"] {
  padding-block: var(--space-2xl);
}

.bar-section[size="m"] {
  padding-block: var(--space-l);
}

.bar-section[size="s"] {
  padding-block: var(--space-m);
}


.bar-section[color="base"] {
  background-color: var(--base-color);
}

.bar-section[color="accent"] {
  background-color: var(--accent-color);
}

.bar-section[color="faded"] {
  background-color: var(--base-color-07-tint);
}
</style>