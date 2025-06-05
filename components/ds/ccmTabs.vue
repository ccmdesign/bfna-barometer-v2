<template>
  <div class="ccm-tabs | subgrid" :centered="props.centered">
    <div class="ccm-tabs__tabs | subgrid cluster" >
      <button 
        v-for="(tab, index) in props.tabs"
        :key="index"
        :class="['tab-button', { active: activeTab === index }]"
        @click="activeTab = index">
          {{ tab.label }} 
          <span class="tab-button__count" v-if="tab.count">({{ tab.count }})</span>
        </button>
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
  grid-column: content-start / content-end;
  display: grid;
  grid-template-columns: subgrid;
  text-align: center;
}

.ccm-tabs__tabs {
  cursor: pointer;
  background-color: transparent;
  margin-inline: var(--space-2xs);
  --_cluster-space: var(--space-m);
}

[centered] .ccm-tabs__tabs {
  justify-content: center;
}

.tab-button {
  transition: all 0.2s ease-in-out;
}

.tab-button__count {
}

.tab-button.active {
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: var(--white-color);
  }
}

.ccm-tabs__content {
  grid-column: content-start / content-end;
  display: grid;
  grid-template-columns: subgrid;
  padding-block: var(--space-m);
}
</style>
