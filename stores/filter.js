import { defineStore } from 'pinia'

export const useFilterTags = defineStore('filterTags', {
  // arrow function recommended for full type inference
  state: () => {
    return {
      tags: [],
      archivedTags: [],
    }
  },
  actions: {
    setTags(topics) {
      const tagSet = new Set();
      const archivedTagSet = new Set();
      topics.forEach(topic => {
        if (topic.isArchived) {
          (topic.tags || []).forEach(tag => archivedTagSet.add(tag.toUpperCase()));
          return;
        } else {
          (topic.tags || []).forEach(tag => tagSet.add(tag.toUpperCase()));
        }
      });
      this.tags = Array.from(tagSet);
      this.archivedTags = Array.from(archivedTagSet);
    },
  },
})