import { defineStore } from 'pinia'

export const useStatementStore = defineStore('statements', {
  // arrow function recommended for full type inference
  state: () => {
    return {
      // all these properties will have their type inferred automatically
      statements: [],
      isLoaded: false
    }
  },
  actions: {
    setStatements(statements) {
      this.statements = statements
      this.isLoaded = true
    },
  },
  getters: {
    getStatementBySlug: (state) => {
      return (slug) => {
        const item = state.statements.find(s => {
          const code = s.countryCode ?? s.meta?.countryCode
          const slugVal = s.slug ?? s.meta?.slug
          return code === slug || slugVal === slug
        })
        return item ? (item.meta ?? item) : null
      }
    },
    getStatementsByCountry: (state) => {
      return (countryCode) => {
        return state.statements.filter(item => {
          const code = item.countryCode ?? item.meta?.countryCode
          return code === countryCode
        })
      }
    },
    getStatementByTopic: (state) => {
      return (topicId, code) => {
        const item = state.statements.find(s => {
          const c = s.countryCode ?? s.meta?.countryCode
          const slug = s.slug ?? s.meta?.slug
          return c === code || slug === code
        })
        if (!item) return null
        const data = item.meta ?? item
        const list = data?.statements
        if (!list || !Array.isArray(list)) return null
        return list.find(s => s.topic === topicId || String(s.topic) === String(topicId)) ?? null
      }
    },
    getStatementByTopicAndCountryCode: (state) => {
      return (topics, countryCodes) => {

        // result = [
        //  topicId: {
        //  title: 'democracy',
        //  description: 'Governance & Democracy, May ‘25',
        //  statements:[
        //  us: statement,
        //  ca: statement,
        //]
        //  }]



        // Returns an object mapping each countryCode to its matching statements for the given topics
        // Build a result array where each item is a topic object with its statements per country code
        return topics.map(topic => {

          const topicObj = {
            topicId: topic.topicId,
            title: topic.title,
            description: topic.description,
            infographics: topic.infographics,
            statements: {}
          }
          countryCodes.forEach(code => {
            const item = state.statements.find(s => {
              const c = s.countryCode ?? s.meta?.countryCode
              const slug = s.slug ?? s.meta?.slug
              return c === code || slug === code
            })
            if (!item) {
              topicObj.statements[code] = null
              return
            }
            const data = item.meta ?? item
            const list = data?.statements
            if (!list || !Array.isArray(list)) {
              topicObj.statements[code] = null
              return
            }
            const matched = list.find(s => s.topic === topic.topicId || String(s.topic) === String(topic.topicId))
            topicObj.statements[code] = matched ?? null
          })
          return topicObj
        })
      }
    }
  }
})