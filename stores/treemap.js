import { defineStore } from 'pinia'

export const useTreemapStore = defineStore('treemap', {
  // arrow function recommended for full type inference
  state: () => {
    return {
      // all these properties will have their type inferred automatically
      treeMapColors: [],
      treeMapData: [],
    }
  },
  actions: {
    setTremap(data) {
      this.treeMapData = data
    },
      
    setTreeMapColors(payload) {
      this.treeMapColors = payload ? [...this.treeMapColors, payload] : []
    },

    updateTreeMapColorCount(payload) {
      const groupIndex = this.treeMapColors.findIndex(group => group.index === payload.index)
      if (groupIndex !== -1) {
        this.treeMapColors[groupIndex].count += payload.count
      }
    }

  },
})