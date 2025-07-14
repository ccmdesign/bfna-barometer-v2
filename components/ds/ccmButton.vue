<template>
  <component 
    class="button" 
    :is="componentEl"
    :mobile="mobile"
    :unstyled="unstyled"
    :hidden="hidden"
    :variant="visual"
    :color="color"
    :size="size"
    :icon-before="iconBefore"
    :icon-after="iconAfter"
    :label="label"
    :value="value"
    :fullWidth="fullWidth"
  >
    <slot>{{label}}</slot>
  </component>
</template>

<script setup>
  import { toRefs, computed, defineProps } from 'vue';
  
  const props = defineProps({
    label: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: 'value'
    },
    hidden: {
      type: Boolean,
      default: false
    },
    unstyled: {
      type: Boolean,
      default: false
    },
    fullWidth: {
      type: Boolean,
      default: false
    },
    mobile: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
    },
    visual: {
      type: String,
      default: 'secondary'
    },
    el: {
      type: String,
      default: 'button'
    },
  });

  const { el, value, label, hidden, unstyled, mobile, size, color, visual, iconBefore, iconAfter, fullWidth } = toRefs(props)

const defaultEl = computed(() => {
  if (attrs.href) return 'a'
  if (attrs.disabled) return 'span'
  if (attrs.to) return 'NuxtLink'
  return 'button'
})

const componentEl = computed(() => el.value || defaultEl.value)

</script>

<style>
/* 
  This file contains the structural rules for the button system. 
  Any visual configuration should be made on the button-visuals.css file.
  It is very unlikely that anyone will need to edits file for customization purposes. 
*/

.button {
  /* Structure */
  display: inline-flex;
  align-items: center;
  zoom: 1;
  line-height: 1;
  white-space: nowrap;
  text-align: center;
  cursor: pointer;
  -webkit-user-drag: none;
  user-select: none;
  box-sizing: border-box;
  text-decoration: none;
  align-self: self-start;
  justify-self: flex-start;
  
  font-family: inherit; /* Fallback to sans-serif */
  font-weight: var(--_button-font-weight);
  letter-spacing: var(--_button-letter-spacing);
}

.button {
  padding-top: calc(var(--_button-padding-block) * .9);
  padding-bottom: var(--_button-padding-block);
  padding-left: var(--_button-padding-inline);
  padding-right: var(--_button-padding-inline);
  
  font-weight: var(--_button-font-weight);
  font-size: var(--_button-font-size);
  gap: var(--_button-gutter);
  
  color: var(--_button-text-color);
  border-color: var(--_button-border-color);
  background-color: var(--_button-background-color); 

  border-radius: var(--_button-border-radius);
  border-width: var(--_button-border-width);
  border-style: var(--_button-border-style);
}

/* 
  This file contains the css rules for the button system. 
  Most of the visual configurations can be made through the variables. (Lines 13-21)
  Many of these configurations have fallbacks values. 
*/

.button {
  /* Required Values */
  --_button-text-color: red;        
  --_button-background-color: red;  
  --_button-border-color: red;      
  --_button-icon-color: var(--_button-text-color);

  --_button-padding-block:     var(--base-padding-block);
  --_button-padding-inline:    var(--base-padding-inline);
  --_button-gutter:            var(--button-gutter);

  /* Optional Values */
  --_button-border-radius: var(--button-border-radius, 0);    /* Fallback to 0 */
  --_button-border-width:  var(--base-border-width, 2px);   /* Fallback to 1px */
  --_button-border-style:  var(--base-border-style, solid); /* Fallback to solid */

  --_button-font-weight:   var(--button-font-weight, 400);  /* Fallback to 400 */
  --_button-font-size:     var(--button-font-size, 100%);
}

/* Sizes */
.button[size="xs"] {
  --_button-padding-block: var(--button-padding-block-xs);
  --_button-padding-inline: var(--button-padding-inline-xs);
  --_button-font-size: var(--button-font-size-xs);
}

.button[size="s"] {
  --_button-padding-block: var(--button-padding-block-s);
  --_button-padding-inline: var(--button-padding-inline-s);
  --_button-font-size: var(--button-font-size-s);
}

.button,
.button[size="m"] {
  --_button-padding-block: var(--button-padding-block-m);
  --_button-padding-inline: var(--button-padding-inline-m);
  --_button-font-size: var(--button-font-size-m);
}

.button[size="l"] {
  --_button-padding-block: var(--button-padding-block-l);
  --_button-padding-inline: var(--button-padding-inline-l);
  --_button-font-size: var(--button-font-size-l);
}

.button { --_button-background-color: transparent; }

.button[color="base"] { 
  --_button-text-color: var(--base-color); 
  --_button-border-color: var(--base-color);
}

.button[color="accent"] { 
  --_button-text-color: var(--accent-color); 
  --_button-border-color: var(--accent-color);
}

.button[color="faded"] { 
  --_button-text-color: var(--base-color-07-tint); 
  --_button-border-color: var(--base-color-07-tint);
}

.button[color="white"] { 
  --_button-text-color: var(--white-color); 
  --_button-border-color: var(--white-color);
}

.button[variant="primary"][color="base"] { 
  --_button-text-color: var(--white-color); 
  --_button-border-color: var(--base-color);
  --_button-background-color: var(--base-color);
}

.button[variant="primary"][color="accent"] { 
  --_button-text-color: var(--base-color); 
  --_button-border-color: var(--accent-color);
  --_button-background-color: var(--accent-color);
}

.button[variant="primary"][color="faded"] { 
  --_button-text-color: var(--white-color); 
  --_button-border-color: transparent;
  --_button-background-color: var(--white-color-10-alpha);
}

.button[variant="primary"][color="white"] { 
  --_button-text-color: var(--base-color); 
  --_button-border-color: var(--white-color);
  --_button-background-color: var(--white-color);
}

.button[variant="primary"][color="gray"] { 
  --_button-text-color: var(--base-color); 
  --_button-border-color: transparent;
  --_button-background-color: var(--base-color-05-alpha);
}

.button[variant="link"][color="white"] {
  --_button-text-color: var(--white-color);
  --_button-border-color: transparent;
  --_button-background-color: transparent;
  --_button-font-weight: 600;
}

.button[variant="link"][color="base"] {
  --_button-text-color: var(--base-color);
  --_button-border-color: var(--base-color);
  --_button-background-color: transparent;
  --_button-font-weight: 600;
}

.button .icon {
  color: var(--_button-icon-color);
  line-height: 0;
}

.button:has(.icon:only-child) {
  padding-inline: var(--button-padding-block);
}

.button:has(.icon:first-child) {
  padding-left: calc(var(--_button-padding-inline) * .7);
}

.button:has(.icon:last-child) {
  padding-right: calc(var(--_button-padding-inline) * .7);
}

</style>