import { defineStore } from 'pinia'

export const useStatementStore = defineStore('statements', {
  // arrow function recommended for full type inference
  state: () => {
    return {
      // all these properties will have their type inferred automatically
      statements: []
    }
  },
  actions: {
    setStatements(statements) {
      this.statements = statements
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
    }
  }
})