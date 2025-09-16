<template>
  <div class="ccm-tabs | subgrid" :centered="props.centered">
    <div class="ccm-tabs__tabs | subgrid reel" >
      <button 
        v-for="(tab, index) in props.tabs"
        :key="index"
        :class="['tab-button', { active: activeTab === index }]"
        @click="activeTab = index">
          {{ tab.label }} 
          <span class="tab-button__count" v-if="tab.count">({{ tab.count }})</span>
        </button>
        <div class="ccm-tabs__extra">
          <slot name="extra">
          </slot>
        </div>
    </div>

    <div :class="['ccm-tabs__content | subgrid', props.tabs[activeTab].class]">
      <slot :name="props.tabs[activeTab].slot" :class="props.tabs[activeTab].class">
        <p>No content</p>
      </slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tabs: {
    type: Array,
    default: () => [
      { label: 'Tab 1', slot: 'tab1', count: 0, class: '' },
      { label: 'Tab 2', slot: 'tab2', count: 0, class: '' },
    ]
  },
  centered: {
    type: Boolean,
    default: false
  }
})

const activeTab = ref(0)
</script>

<style scoped>
.ccm-tabs {
  grid-column: full-start / full-end;
  display: grid;
  grid-template-columns: subgrid;
  text-align: center;
}

.ccm-tabs__tabs {
  position: relative;
  cursor: pointer;
  background-color: transparent;
  margin-inline: var(--space-2xs);
  --_reel-gap: var(--space-xl);

  @media (max-width: 768px) {
    flex-wrap: wrap;
    --_reel-gap: var(--space-s);
  }
}

[centered="true"] .ccm-tabs__tabs {
  justify-content: center;
}

.tab-button {
  transition: all 0.2s ease-in-out;
  appearance: none;
  border: none;
  background-color: transparent;
  padding: 0;
  margin: 0;
  text-align: center;
  text-decoration: none;
  line-height: 180%;
  letter-spacing: -1%;
  font-size: var(--size-1);
  padding-bottom: var(--space-xs);
  @media (max-width: 768px) { font-size: var(--size-0); }
}

.tab-button__count {
}

.tab-button.active {
  font-weight: 700;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: var(--accent-color);
  }
}

.ccm-tabs__content {
  grid-column: full-start / full-end;
  display: grid;
  grid-template-columns: subgrid;
  padding-block: var(--space-m);
}

.ccm-tabs__extra {
  position: absolute;
  right: 0;
}
</style>
