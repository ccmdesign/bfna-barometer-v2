<script setup>
import { useTreemapStore } from '@/stores/treemap'
import * as d3 from "d3"

const props = defineProps({
  dataset: Object,
})

const chartRef = ref(null)
const store = useTreemapStore()

const treemap = computed(() => props.dataset)
const colorsMap = computed(() => store.treeMapColors)

// Default color palette
const defaultColors = [
  '#2E2E3A', // Dark Blue (Base)
  '#F2CC8F', // Gold/Yellow
  '#81B29A', // Green
  '#E07A5F', // Terra Cotta
  '#3D405B', // Slate Blue
  '#F4F1DE', // Off White
  '#D4A373', // Tan
  '#6D597A', // Purple
  '#B56576', // Rose
  '#E56B6F', // Salmon
  '#EAAC8B', // Peach
]

function assignColors() {
  store.setTreeMapColors(null) // Reset colors
  
  // Sort cells by value to match Treemap layout logic (usually largest to smallest)
  // This ensures the largest blocks get the first colors in the palette
  const sortedCells = [...treemap.value.cells].sort((a, b) => b.value - a.value)
  
  sortedCells.forEach(cell => {
    // Check if group already has a color (in case of duplicates, though unlikely for top level)
    const existing = store.treeMapColors.find(c => c.group === cell.name)
    if (!existing) {
      store.setTreeMapColors({ group: cell.name, count: 1 })
    }
  })
}

function getColor(group) {
  const index = store.treeMapColors.findIndex(c => c.group === group)
  if (index !== -1) {
    return defaultColors[index % defaultColors.length]
  }
  return defaultColors[0] // Fallback
}

// Helper to calculate contrast color (black or white) based on background hex
function getContrastColor(hexcolor) {
  // If color is not hex (e.g. hsl), default to white for safety or implement conversion
  if (!hexcolor || !hexcolor.startsWith('#')) return '#FFFFFF'

  // Convert hex to RGB
  const r = parseInt(hexcolor.substr(1, 2), 16)
  const g = parseInt(hexcolor.substr(3, 2), 16)
  const b = parseInt(hexcolor.substr(5, 2), 16)
  
  // Calculate YIQ ratio
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000
  
  // Return black for bright colors, white for dark colors
  return (yiq >= 128) ? '#000000' : '#FFFFFF'
}

function createTreemap() {
  // Simplified text formatting: just split by spaces to allow natural wrapping
  // or don't split at all and let CSS handle it. 
  // D3 text wrapping usually requires manual tspans or a foreignObject (div).
  // Since we are using divs (HTML), we can just let the browser wrap the text.
  // We'll return the full string and let CSS handle the wrapping.
  const formatText = (text) => {
    return [text] 
  }

  const chartCells = [...treemap.value.cells].map((cell) => {
    const list = []
    if (cell.multipleValues) {
      cell.multipleValues.forEach((mv, index) => {
        if (index === cell.multipleValues.length - 1) {
          list.push({
            name: cell.name + mv.key,
            value: mv.value,
            group: cell.name
          })
        } else {
          list.push({
            name: mv.key,
            value: mv.value,
            group: cell.name
          })
        }
      })
    } else {
      list.push({
        name: cell.name,
        value: cell.value,
        group: cell.name
      })
    }
    return {
      name: cell.name,
      children: list
    }
  })

  const data = {
    name: "root",
    children: chartCells,
  }

  const width = 100
  const height = 100

  const treemapLayout = d3.treemap().size([width, height]).padding(0)

  const root = d3
    .hierarchy(data)
    .sum((d) => d.value)
    .sort((a, b) => b.value - a.value)

  treemapLayout(root)

  const container = d3.select(chartRef.value)
  container.selectAll("*").remove()

  const cell = container
    .selectAll("div")
    .data(root.leaves())
    .enter()
    .append("div")
    .attr("class", "treemap-group")
    .style("left", (d) => `${d.x0}%`)
    .style("top", (d) => `${d.y0}%`)
    .style("width", (d) => `${d.x1 - d.x0}%`)
    .style("height", (d) => `${d.y1 - d.y0}%`)
    .style("background-color", (d) => {
      return getColor(d.parent.data.name)
    })
    .attr("title", (d) => `${d.data.name}: ${d.data.value}`)

  cell
    .append("div")
    .attr("class", "treemap-text")
    .style("color", (d) => {
      const bgColor = getColor(d.parent.data.name)
      return getContrastColor(bgColor)
    })
    .selectAll("p")
    .data(d => formatText(d.data.name))
    .join("p")
    .text(d => d)
}

onMounted(() => {
  assignColors()
  createTreemap()
})

watch(() => props.dataset, () => {
  assignColors()
  createTreemap()
}, { deep: true })
</script>


<template>
  <div class="subgrid">
    <div class="treemap-infographic__chart-wrapper">
      <div class="treemap-wrapper">
        <h4 class="title">{{ dataset.title }}</h4>
        <div ref="chartRef" class="treemap-container"></div>
        
        <div class="treemap__legend">
          <div 
            class="treemap__legend-item" 
            v-for="(item, index) in treemap.cells" 
            :key="item.name"
          >
            <span 
              class="treemap__legend-swatch" 
              :style="{ backgroundColor: getColor(item.name) }"
            ></span>
            <span class="treemap__legend-label">{{ item.name }}</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.treemap-infographic__chart-wrapper {
  --gap: var(--space-xs);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  gap: var(--gap);
  padding-inline: var(--space-s);
  padding-top: var(--space-m);
  width: 100%;
}

.treemap-wrapper {
  width: 100%;
  max-width: 1024px;
  display: flex;
  flex-direction: column;
  gap: var(--space-m);
}

.title {
  text-align: center;
  margin-bottom: var(--space-s);
}

.treemap-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  background-color: var(--base-color-05-tint);
  box-shadow: var(--box-shadow-m);
  border-radius: var(--border-radius-m);
  overflow: hidden;
}

/* Legend Styles */
.treemap__legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-s);
  margin-top: var(--space-s);
}

.treemap__legend-item {
  display: flex;
  align-items: center;
  gap: var(--space-2xs);
  font-size: var(--size--1);
  color: var(--base-color);
}

.treemap__legend-swatch {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.treemap__legend-label {
  font-weight: 500;
  line-height: 1.2;
}

/* D3 Chart Styles (Global within component) */
:deep(.treemap-group) {
  position: absolute;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  overflow: hidden;
}

:deep(.treemap-group:hover) {
  z-index: 1;
  box-shadow: 0 0 10px rgba(0,0,0,0.2);
  filter: brightness(1.1);
}

:deep(.treemap-text) {
  font-family: sans-serif;
  font-size: 12px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.9);
  position: absolute;
  top: 4px;
  left: 4px;
  pointer-events: none;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  
  /* Allow wrapping but limit overflow */
  max-width: calc(100% - 8px);
  max-height: calc(100% - 8px);
  overflow: hidden;
  white-space: normal; /* Allow wrapping */
  word-wrap: break-word;
  
  /* Limit to 3 lines to prevent overflow in small cells */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}

:deep(.treemap-text p) {
  margin: 0;
  line-height: 1.2;
}

@media (min-width: 768px) {
  :deep(.treemap-text) {
    font-size: 14px;
    top: 8px;
    left: 8px;
  }
}
</style>

