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
  
  font-family: var(--_button-font-family, sans-serif); /* Fallback to sans-serif */
  font-weight: var(--_button-font-weight);
  letter-spacing: var(--_button-letter-spacing);
}

.button:focus { outline: 0; }

/* Firefox: Get rid of the inner focus border */
.button::-moz-focus-inner {
  padding: 0;
  border: 0;
}

.button[disabled],
.button[disabled]:hover,
.button[disabled]:focus,
.button[disabled]:active {
  filter: alpha(opacity=40);
  opacity: 0.4;
  cursor: not-allowed;
  box-shadow: none;
  pointer-events: none;
}

.button[hidden] { display: none; }

.button[unstyled] {
  background-color: transparent;
  border-color: transparent;
}

.button[fullWidth="true"],
.button[data-fullWidth="true"] {
  align-self: stretch;
  justify-self: stretch;
}

/* 
  This file contains the css rules for the button system. 
  Most of the visual configurations can be made through the variables. (Lines 13-21)
  Many of these configurations have fallbacks values. 
*/

.button {
  /* Required Values */
  --_button-color-prop:        v-bind(color);
  --_button-hsl:               var(--_button-color-prop, --base-hsl);
  --_button-text-hsl:          var(--_button-hsl);
  --_button-color:             hsla(var(--_button-hsl), 1);
  --_button-text-color:        hsla(var(--_button-text-hsl), 1);
  --_button-padding-block:     var(--base-padding-block);
  --_button-padding-inline:    var(--base-padding-inline);

  /* Optional Values */
  --_button-border-radius: var(--button-border-radius, --border-radius-m, 0);    /* Fallback to 0 */
  --_button-border-color:  var(--_button-color);            /* Fallback to 1px */
  --_button-border-width:  var(--base-border-width, 2px);   /* Fallback to 1px */
  --_button-border-style:  var(--base-border-style, solid); /* Fallback to solid */
  --_button-font-weight:   var(--button-font-weight, 400);  /* Fallback to 400 */
  --_button-font-size:     var(--button-font-size, 100%);
  --_button-icon-color:    var(--_button-text-color);
  --_button-gutter:        var(--button-gutter);
}

.button[data-color="base"],
.button[color="base"] { 
  --_button-hsl: var(--base-hsl); 
  --_button-text-color: var(--base-color); 
}

.button[data-color="primary"],
.button[color="primary"] { 
  --_button-hsl: var(--primary-hsl); 
  --_button-text-color: var(--primary-color); 
}

.button[data-color="secondary"],
.button[color="secondary"] { 
  --_button-hsl: var(--secondary-hsl); 
  --_button-text-color: var(--secondary-color); 
}

.button[data-color="tertiary"],
.button[color="tertiary"] { 
  --_button-hsl: var(--tertiary-hsl); 
  --_button-text-color: var(--tertiary-color); 
}

.button[data-color="accent"],
.button[color="accent"] { 
  --_button-hsl: var(--accent-hsl);
  --_button-text-color: var(--accent-color);
}

.button[data-color="white"], 
.button[color="white"] { 
  --_button-hsl: var(--white-hsl);
  --_button-text-color: var(--white-color);
}

.button[data-color="faded"],
.button[color="faded"] { 
  --_button-color: var(--base-color-07-tint);
  --_button-text-color: var(--base-color-07-tint);
}

.button[data-color="success"],
.button[color="success"] { 
  --_button-hsl: var(--green-hsl); 
  --_button-text-color: var(--green-color);
}

.button[data-color="cancel"],
.button[data-color="fail"],
.button[color="cancel"],
.button[color="fail"] { 
  --_button-hsl: var(--red-hsl);
  --_button-text-color: var(--red-color);
}

.button[data-color="warning"],
.button[color="warning"] { 
  --_button-hsl: var(--yellow-hsl);
  --_button-text-color: var(--yellow-color);
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

.button[size="xl"] {
  --_button-padding-block: var(--button-padding-block-xl);
  --_button-padding-inline: var(--button-padding-inline-xl);
  --_button-font-size: var(--button-font-size-xl);
}

.button {
  color: var(--_button-text-color);
  background-color: transparent; 

  padding: var(--_button-padding-block) var(--_button-padding-inline);
  
  border-radius: var(--_button-border-radius, 0);
  border-width: var(--_button-border-width, 1px);
  border-style: var(--_button-border-style, solid);
  border-color: var(--_button-border-color);
  
  font-family: var(--_button-font-family);
  font-weight: var(--_button-font-weight, 400);
  font-size: var(--_button-font-size, 100%);
}

.button:hover { background-image: linear-gradient(hsla(var(--_button-hsl), 0.05), hsla(var(--_button-hsl), 0.05)); }

.button:active {
  background-image: linear-gradient(hsla(var(--_button-hsl), 0.15), hsla(var(--_button-hsl), 0.15));
  border-color: hsla(var(--_button-color), 1);
}
  
.button:focus { box-shadow: var(--_button-focus-effect); }

.button[data-variant="primary"],
.button[variant="primary"] {
    color: white;
    border-width: var(--_button-border-width, 0);
    border-style: var(--_button-border-style, solid);
    border-color: hsla(var(--_button-hsl), 1);
    background-color: hsla(var(--_button-hsl), 1);
}

.button[data-variant="primary"]:hover,
.button[data-variant="primary"]:focus,
.button[variant="primary"]:hover,
.button[variant="primary"]:focus { background-image: linear-gradient(hsla(0,0%,0%, 0.15), hsla(0,0%,0%, 0.25)); }

.button[data-variant="secondary"],
.button[variant="secondary"] {
  background-color: transparent;
  color: var(--_button-text-color);
  border-width: var(--_button-border-width, 1px);
  border-style: var(--_button-border-style, solid);
  border-color: hsla(var(--_button-hsl), 1);
}

.button[data-variant="secondary"]:hover,
.button[data-variant="secondary"]:focus,
.button[variant="secondary"]:hover,
.button[variant="secondary"]:focus { background-image: linear-gradient(hsla(var(--_button-hsl), 0.1), hsla(var(--_button-hsl), 0.1)); }

.button[data-variant="unstyled"],
.button[variant="unstyled"],
.button[data-variant="ghost"],
.button[variant="ghost"] { 
  color: hsla(var(--_button-hsl), 1); 
  border-width: var(--_button-border-width, 0);
  border-style: var(--_button-border-style, solid);
  border-color: transparent;
}

.button[data-variant="link"],
.button[variant="link"] { 
  color: hsla(var(--_button-hsl), 1); 
  border-width: var(--_button-border-width, 0);
  border-style: var(--_button-border-style, solid);
  border-color: transparent;
  padding-inline: var(--space-xs);
}

@media (max-width: 36em) {
  .button[mobile="wide"] { width: 100%; }
}
</style>