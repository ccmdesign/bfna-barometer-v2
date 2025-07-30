<template>
  <div class="tag" @click="toggleVisibility" :visible="isVisible" :country-name="countryName" :country-code="countryCode" :color="color">
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
  }
})

const isVisible = ref(true)

const toggleVisibility = () => {
  isVisible.value = !isVisible.value
  emit('toggleCountryVisibility', { countryCode: props.countryCode, visible: isVisible.value })
}

const icon = computed(() => {
  return isVisible.value ? 'visibility' : 'visibility_off'
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