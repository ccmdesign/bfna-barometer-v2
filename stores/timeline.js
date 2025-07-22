import { defineStore } from 'pinia'

export const useTimelineStore = defineStore('timeline', {
  // arrow function recommended for full type inference
  state: () => {
    return {
      timelineData: [],
      isMarkerVisible: {},
      isCountryVisible: {},
      timeineMarginLeft: 175,
      timelineHighestLine: false
    }
  },
  actions: {
    setTimeline(data) {
      this.timelineData = data
    },
    setMarkerVisibilities(visibilities) {
      this.isMarkerVisible = visibilities
    },
    toggleMarkerVisibility({ marker, isVisible }) {
      this.isMarkerVisible[marker] = isVisible
    },
    setTimelineMarginLeft(payload) {
      this.timeineMarginLeft = payload
    },
    setTimelineHeightValue(payload) {
      this.timelineHighestLine = payload
    },
    setVisibilities(visibilities) {
      this.isCountryVisible = visibilities
    },
    toggleVisibility({ country, isVisible }) {
      this.isCountryVisible[country] = isVisible
    },

  },
})