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

function getColor(group) {
  for (let i = 0 ; i < colorsMap.value.length; i++) {
    const color = colorsMap.value[i]
    if(color.group === group) {
      store.updateTreeMapColorCount({group, count: 1})
      return [i + 1, color.count]
    }
  }
  store.setTreeMapColors({group, count: 1})
  return [colorsMap.value.length, 1]
}

function createTreemap() {
  const formatText = (text) => {
    if(text.length > 1) {
      return [text[0], text.slice(1).join(' ')]
    }
    return text
  }

  const chartCells = [...treemap.value.cells].map((cell) => {
    const list = []
    if(cell.multipleValues) {
      cell.multipleValues.forEach((mv, index) => {
        if(index === cell.multipleValues.length - 1) {
          list.push({
            name: cell.name + mv.key,
            value: mv.value,
          })
        } else{
          list.push({
            name: mv.key,
            value: mv.value,
          })
        }
      })
    } else {
      list.push({
        name: cell.name,
        value: cell.value,
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

  const treemapLayout = d3.treemap().size([`${width}`, `${height}`])

  const root = d3
    .hierarchy(data)
    .sum((d) => d.value)
    .sort((a, b) => b.value - a.value)

  treemapLayout(root)

  const container = d3.select(chartRef.value)

  const cell = container
    .selectAll("div")
    .data(root.leaves())
    .enter()
    .append("div")
    .attr("class", "treemap-group")
    .style("left", (d) => `${d.x0}% `)
    .style("top", (d) => `${d.y0}%`)
    .style("width", (d) => `${d.x1 - d.x0}%`)
    .style("height", (d) => `${d.y1 - d.y0}%`)
    .attr("treemap-name", (d) => d.data.name)
    .attr("treemap-color", d => { 
      while (d.depth > 1) d = d.parent
      const [x, y] = getColor(d.data.name)
      return `${x}_${y}` 
    })

  cell
    .append("div")
    .attr("class", "treemap-text")
    .selectAll("p")
    .data(d => formatText(d.data.name.split(/(?=[A-Z][a-z])|\s+/g)))
    .join("p")
    .text(d => d)
}

onMounted(() => {
  store.setTreeMapColors(null)
  createTreemap()
})
</script>


<template>
  <div class="subgrid">
    <div class="treemap-infographic__chart-wrapper">
      <div class="treemap-wrapper">
        <h4 class="title">{{ dataset.title }}</h4>
        <div ref="chartRef" class="treemap-container"></div>
        <div class="treemap__legend">
          <span class="treemap__label" v-for="item in treemap.cells" :treemap-color="(colorsMap.indexOf(colorsMap.filter(x => x.group === item.name)[0]) + 1)">{{
            item.name
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.treemap-infographic__chart-wrapper {

  --legend-height: 45px;
  --gap: var(--space-xs);

  display: flex;
  flex-direction: column;

  @media (min-width: 1024px) { flex-direction: row; }

  align-items: center;
  justify-content: center;
  aspect-ratio: 16/6;
  position: relative;
  gap: var(--gap);
  padding-inline: var(--space-s);
  padding-top: calc(var(--space-xs) + var(--legend-height));

}

.treemap-wrapper {
  padding-inline: 1rem;
  width: 60vw;
  height: 40svh;
  margin-top: 6rem;

  @media screen and (min-width: 960px) {
    transform: translateY(-100px);
  }

  @media screen and (max-height: 720px) {
    margin-top: 60px;
    height: 30svh;
  }
}

.treemap-container {
  margin-top: var(--space-s);
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.3);
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  max-width: 100%;
}

.treemap__legend {
  display: flex;
  gap: var(--space-2xs);
  justify-content: center;
  margin-top: var(--space-s);
}

.treemap__label {
  display: inline-block;
  font-family: sans-serif;
  font-weight: bold;
  border-radius: 4px;
  color: color-mix(in srgb, var(--_color) 30%, var(--white-color));
  background-color: var(--_color);
  border: 2px solid var(--_color, black);
  padding: var(--space-s) 1rem;
}

.treemap-group {
  position: absolute;
  box-sizing: border-box;
  background-color: color-mix(in srgb, var(--_color) var(--_percentage), var(--white-color));
}

.treemap-item {
  width: 100%;
  height: 100%;
  background-color: var(--_color);
  border: 1px solid var(--_color);
}

.treemap-text {
  font-family: sans-serif;
  font-size: 16px;
  font-weight: var(--_weight-normal, bold);
  color: color-mix(in srgb, var(--_color) 30%, var(--white-color));
  position: absolute;
  top: 1rem;
  left: 1rem;

  & :not(:first-child) {
    font-weight: normal;
  }
}

[treemap-color$="_1"] {
  --_percentage: 100%
}
[treemap-color$="_2"] {
  --_percentage: 90%
}
[treemap-color$="_2"] {
  --_weight-normal: normal
}
[treemap-color$="_3"] {
  --_percentage: 80%
}
[treemap-color$="_3"] {
  --_weight-normal: normal
}
[treemap-color$="_4"] {
  --_percentage: 70%
}
[treemap-color$="_4"] {
  --_weight-normal: normal
}
[treemap-color$="_5"] {
  --_percentage: 60%
}
[treemap-color$="_5"] {
  --_weight-normal: normal
}
[treemap-color$="_6"] {
  --_percentage: 50%
}
[treemap-color$="_6"] {
  --_weight-normal: normal
}
[treemap-color$="_7"] {
  --_percentage: 30%
}
[treemap-color$="_8"] {
  --_percentage: 20%
}
[treemap-color$="_9"] {
  --_percentage: 10%
}

[treemap-color^="1"] {
  --_color: hsl(199, 84%, 20%);
}

[treemap-color^="2"] {
  --_color: hsl(33, 100%, 49%);
}

[treemap-color^="3"] {
  --_color: #3d405b;
}

[treemap-color^="4"] {
  --_color: #81b29a;
}

[treemap-color^="5"] {
  --_color: #f2cc8f;
}
</style>

