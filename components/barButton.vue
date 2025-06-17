<template>
  <ccm-button class="bar-button">
    <slot />
  </ccm-button>
</template>

<script setup>

</script>

<style scoped>
  .bar-button {
    --button-font-weight: 600;

    --button-padding-block-xs: var(--space-2xs);
    --button-padding-inline-xs: var(--space-xs);
    --button-font-size-xs: var(--size--1);
    
    --button-padding-block-s: var(--space-xs);
    --button-padding-inline-s: var(--space-s);
    --button-font-size-s: var(--size-0);
    
    --button-padding-block-m: var(--space-s);
    --button-padding-inline-m: var(--space-l);
    --button-font-size-m: var(--size-1);
    
    --button-padding-block-l: var(--space-m);
    --button-padding-inline-l: var(--space-xl);
    --button-font-size-l: var(--size-2); 

    --button-padding-block-xl: var(--space-l);
    --button-padding-inline-xl: var(--space-2xl);
    --button-font-size-xl: var(--size-3);   

    --button-gutter: var(--space-2xs);
  }
</style>