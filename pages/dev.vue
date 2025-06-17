<template>
  <bar-hero id="hero" />
  
  <bar-section>
    <div class="stack">
      <div class="cluster">
        <bar-button color="base">Base</bar-button>  
        <bar-button color="primary">Primary</bar-button>  
        <bar-button color="accent">Accent</bar-button>  
        <bar-button color="cancel">Cancel</bar-button>  
        <bar-button color="warning">Warning</bar-button>
      </div>
      <div class="cluster">
        <bar-button variant="primary" color="base">Base</bar-button>  
        <bar-button variant="primary" color="primary">Primary</bar-button>  
        <bar-button variant="primary" color="accent">Accent</bar-button>  
        <bar-button variant="primary" color="cancel">Cancel</bar-button>  
        <bar-button variant="primary" color="warning">Warning</bar-button>
      </div>

      <div class="cluster">
        <bar-button  size="s" variant="primary" icon-after="close" color="base">Base</bar-button>  
        <bar-button  size="s" variant="primary" icon-before="close" color="primary">Primary</bar-button>  
        <bar-button  size="s" variant="primary" icon-before="close" color="accent"></bar-button>  
      </div>

      <section class="stack padding-top:3xl">
        <bar-button size="xs">Button</bar-button>  
        <bar-button size="s">Button</bar-button>
        <bar-button>Button</bar-button>
        <bar-button size="l">Button</bar-button>
        <bar-button size="xl">Button</bar-button>
        
        <bar-button size="s" mobile-full-width>Button</bar-button>
        <bar-button size="full-width">Button</bar-button> <!-- TODO: this is not working -->  
      </section>
      
      
    </div>
  </bar-section>
</template>

<script setup>

</script>

<style scoped>

</style>