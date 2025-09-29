<template>
  <div class="tag" @click="toggleVisibility" :visible="visible" :country-name="countryName" :country-code="countryCode" :color="color">  
    <slot>
      {{ countryName }}
    </slot>
    <span class="icon" size="xs">{{ icon }}</span>
  </div>
</template>

<script setup>
const emit = defineEmits(['toggleCountryVisibility'])
const props = defineProps({
  countryName: {
    type: String,
    required: true
  },
  countryCode: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: false,
    default: 'base-05'
  },
  visible: {
    type: Boolean,
    required: false,
    default: true
  }
})

const toggleVisibility = () => {
  emit('toggleCountryVisibility', { countryCode: props.countryCode, visible: !props.visible })
}

const icon = computed(() => {
  return props.visible ? 'visibility' : 'visibility_off'
})

</script>

<style scoped>
.tag {
  background-color: var(--base-color-05-tint);
  padding: var(--space-3xs) var(--space-s) var(--space-2xs);
  border-radius: var(--button-border-radius);
  font-weight: 600;
  color: var(--base-color-80-shade);
  cursor: pointer;
  display: flex;
  align-items: flex-end;
  gap: var(--space-3xs);

  .icon {
    color: var(--base-color-40-tint);
  }

  &[visible="false"] {
    opacity: 0.5;
  }
}

.tag[color="base-10"] {
  background-color: var(--base-color-10-tint);
}
</style>