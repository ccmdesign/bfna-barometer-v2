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
        const statement = state.statements.find(statement => statement.countryCode === slug)
        return statement || null
      }
    },
    getStatementsByCountry: (state) => {
      return (countryCode) => {
        return state.statements.filter(statement => statement.country === countryCode)
      }
    },
    getStatementByTopic: (state) => {
      return (topicId, code) => {
        const statement = state.statements.find(statement => statement.countryCode === code)
        return statement.statements.find(statement => statement.topic === topicId) || null
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
            const countryStatement = state.statements.find(statement => statement.countryCode === code)
            if (countryStatement) {
              // Find the statement for this topic in this country
              const matched = countryStatement.statements.find(s => s.topic === topic.topicId)
              if (matched) {
          topicObj.statements[code] = matched
              } else {
          topicObj.statements[code] = null
              }
            } else {
              topicObj.statements[code] = null
            }
          })
          return topicObj
        })
      }
    }
  }
})