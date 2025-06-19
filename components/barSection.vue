<template>
  <section class="bar-section | subgrid" :size="size">
    <slot>
      <h1>Bar Section</h1>
    </slot>
    
  </section>
</template>

<script setup>
const props = defineProps({
  size: {
    type: String,
    default: 'm',
  },
});
</script>

<style scoped>
.bar-section {
  grid-column: full-start / full-end; /* Grid template columns are defined by the .subgrid class, and grid-column attr. */
  display: grid;
  grid-template-columns: subgrid;
}

.bar-section > * {
  grid-column: content-start / content-end; /* Grid template columns are defined by the .subgrid class, and grid-column attr. */
}


/*
@TODO: Não consegui fazer essa sidebar com subgrid funcionar. 
       Estou revertendo pata a sidebar do everylayout por conta do prazo. 
.bar-section[sidebar] > :first-child { grid-column: content-start / 9; }
.bar-section[sidebar] > :last-child { grid-column: 10 / content-end; }
*/


/* Configs and Variants */
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