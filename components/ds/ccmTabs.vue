<template>
  <div class="ccm-tabs | subgrid" :centered="props.centered">
    <div class="ccm-tabs__tabs | subgrid reel" >
      <template v-for="(tab, index) in props.tabs" :key="index">
        <NuxtLink
          v-if="isLinkTab(tab)"
          :to="tab.to"
          :external="tab.external"
          :target="tab.target"
          :rel="tab.rel"
          :class="tabClasses(index, tab)">
          {{ tab.label }}
          <span class="tab-button__count" v-if="tab.count">({{ tab.count }})</span>
        </NuxtLink>
        <button
          v-else
          type="button"
          :class="tabClasses(index, tab)"
          @click="setActiveTab(index)">
          {{ tab.label }}
          <span class="tab-button__count" v-if="tab.count">({{ tab.count }})</span>
        </button>
      </template>
        <div class="ccm-tabs__extra">
          <slot name="extra">
          </slot>
        </div>
    </div>

    <div :class="['ccm-tabs__content | subgrid', activeTabData.class]">
      <slot :name="activeTabData.slot" :class="activeTabData.class">
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
      { label: 'Tab 1', slot: 'tab1', count: 0, class: '', type: 'tab' },
      { label: 'Tab 2', slot: 'tab2', count: 0, class: '', type: 'tab' },
    ]
  },
  centered: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()
const router = useRouter()

const isLinkTab = (tab) => {
  if (!tab) return false
  if (tab.type) {
    if (tab.type === 'link') {
      return typeof tab.to === 'string'
    }
    return false
  }
  return typeof tab.to === 'string'
}

const findFirstContentTabIndex = () => {
  const idx = props.tabs.findIndex(tab => !isLinkTab(tab))
  return idx === -1 ? 0 : idx
}

const activeTab = ref(findFirstContentTabIndex())

const activeTabData = computed(() => props.tabs[activeTab.value] || {})

const tabClasses = (index, tab) => [
  'tab-button',
  { active: activeTab.value === index && !isLinkTab(tab) }
]

const syncFromQuery = () => {
  const q = route.query.activeTab
  const raw = Array.isArray(q) ? q[0] : q
  const idx = parseInt(raw ?? '', 10)
  if (!Number.isNaN(idx) && idx >= 0 && idx < props.tabs.length && !isLinkTab(props.tabs[idx])) {
    activeTab.value = idx
    return
  }

  activeTab.value = findFirstContentTabIndex()
}

syncFromQuery()

watch(() => route.query.activeTab, () => {
  syncFromQuery()
})

watch(() => props.tabs, () => {
  if (activeTab.value >= props.tabs.length || isLinkTab(props.tabs[activeTab.value])) {
    activeTab.value = findFirstContentTabIndex()
  }
}, { deep: true })

const setActiveTab = (index) => {
  if (index === activeTab.value || isLinkTab(props.tabs[index])) return
  activeTab.value = index;
  router.replace({ query: { ...route.query, activeTab: String(index) } })
}

// Clean up query param when component unmounts to avoid pollution
onUnmounted(() => {
  const { activeTab, ...rest } = route.query
  if (activeTab !== undefined) {
    router.replace({ query: rest })
  }
})
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
  color: inherit;
  text-align: center;
  text-decoration: none;
  line-height: 180%;
  letter-spacing: -1%;
  font-size: var(--size-0);
  padding-bottom: var(--space-xs);
}

.tab-button:visited {
  color: inherit;
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
