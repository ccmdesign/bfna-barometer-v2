import { describe, expect, it } from 'vitest'
import hosted from '../fixtures/hosted-rankings.json'
import { getRankedCountries, getRankingHighlight } from '../../utils/ranking.js'

const countryCodes = ['eu', 'us', 'ca', 'gb', 'at', 'be', 'bg', 'hr', 'cy', 'cz', 'dk', 'ee', 'fi', 'fr', 'de', 'gr', 'hu', 'ie', 'it', 'lv', 'lt', 'mt', 'nl', 'pl', 'pt', 'ro', 'sk', 'si', 'es', 'se', 'lu']
const fullRanking = countryCodes.map((country, val) => ({ country, val }))

describe('ranking charts and country highlights', () => {
  it.each([true, false])('uses the same population with EU included=%s', includeEU => {
    const countries = fullRanking.filter(row => includeEU || row.country !== 'eu')
    const ranked = getRankedCountries(countries)
    const scale = includeEU ? 31 : 30
    expect(getRankingHighlight(countries, 'us')).toEqual({ score: includeEU ? 2 : 1, scale })
    expect(getRankingHighlight(countries, 'lu')).toEqual({ score: scale, scale })
    expect(getRankingHighlight(countries, 'eu')).toEqual(includeEU ? { score: 1, scale } : null)
    for (const row of ranked) {
      expect(getRankingHighlight(countries, row.country)).toEqual({ score: row.ranking, scale })
    }
  })

  it('closes interior gaps and sorts numeric strings without mutating the dataset', () => {
    const countries = [{ country: 'lu', val: '30' }, { country: 'us', val: '1' }, { country: 'ca', val: '10' }]
    expect(getRankedCountries(countries).map(row => [row.country, row.ranking])).toEqual([['us', 1], ['ca', 2], ['lu', 3]])
    expect(countries.map(row => row.val)).toEqual(['30', '1', '10'])
  })

  it('preserves ties with competition ranks after removing a leading country', () => {
    const countries = [{ country: 'us', val: 1 }, { country: 'ca', val: '1' }, { country: 'lu', val: 4 }]
    expect(getRankedCountries(countries).map(row => row.ranking)).toEqual([1, 1, 3])
    expect(getRankingHighlight(countries, 'ca')).toEqual({ score: 1, scale: 3 })
  })

  it('preserves included entries with missing sort metadata without coercion', () => {
    const missing = [null, undefined, '', ' ', 'N/A', NaN, Infinity, false]
    const countries = [{ country: 'us', val: 0 }, ...missing.map((val, i) => ({ country: `missing-${i}`, val })), { country: '', val: 1 }]
    expect(getRankedCountries(countries).map(row => row.country)).toEqual(countries.slice(0, -1).map(row => row.country))
    expect(getRankingHighlight(countries, 'us')).toEqual({ score: 1, scale: 9 })
    expect(getRankingHighlight(countries, 'missing-0')).toEqual({ score: 2, scale: 9 })
    expect(getRankedCountries()).toEqual([])
    expect(getRankingHighlight([], 'us')).toBeNull()
  })

  it('retains the actual hosted CCPI list when every sort value is null', () => {
    const { countries } = hosted.rankings.find(row => row.slug === 'energy-and-emissions')
    expect(countries).toHaveLength(30)
    expect(countries.every(row => row.val === null)).toBe(true)
    const ranked = getRankedCountries(countries)
    expect(ranked.map(row => row.country)).toEqual(countries.map(row => row.country))
    expect(ranked.map(row => row.ranking)).toEqual(Array.from({ length: 30 }, (_, i) => i + 1))
    expect(getRankingHighlight(countries, 'us')).toEqual({ score: 27, scale: 30 })
    expect(getRankingHighlight(countries, 'lu')).toEqual({ score: 21, scale: 30 })
    expect(getRankingHighlight(countries, 'eu')).toBeNull()
  })

  it.each([true, false])('preserves the whole supplied order for partial metadata, EU included=%s', includeEU => {
    // Numeric values deliberately disagree with list order: partial metadata
    // must not move null entries to the front or sort only the known subset.
    const countries = [
      { country: 'eu', val: 0 }, { country: 'us', val: 30 },
      { country: 'ca', val: null }, { country: 'lu', val: 1 },
    ].filter(row => includeEU || row.country !== 'eu')
    const before = structuredClone(countries)
    const ranked = getRankedCountries(countries)
    expect(ranked.map(row => row.country)).toEqual(countries.map(row => row.country))
    for (const [index, row] of ranked.entries()) {
      expect(getRankingHighlight(countries, row.country)).toEqual({ score: index + 1, scale: countries.length })
    }
    expect(countries).toEqual(before)
  })

  it('matches the reported ASEAN examples in actual hosted CMS data', () => {
    const { countries } = hosted.rankings.find(row => row.slug === 'engagement-with-asean')
    expect(getRankingHighlight(countries, 'us')).toEqual({ score: 1, scale: 30 })
    expect(getRankingHighlight(countries, 'lu')).toEqual({ score: 30, scale: 30 })
    expect(getRankingHighlight(countries, 'eu')).toBeNull()
  })

  it('retains the actual EU-included military expenditure population', () => {
    const { countries } = hosted.rankings.find(row => row.slug === 'security-and-defense')
    expect(getRankedCountries(countries)).toHaveLength(31)
    expect(getRankingHighlight(countries, 'us')).toEqual({ score: 1, scale: 31 })
    expect(getRankingHighlight(countries, 'lu')).toEqual({ score: 29, scale: 31 })
    expect(getRankingHighlight(countries, 'eu')).toEqual({ score: 27, scale: 31 })
  })

  it.each(hosted.rankings)('keeps chart and highlight populations identical for $title', ({ countries }) => {
    const ranked = getRankedCountries(countries)
    expect(ranked).toHaveLength(countries.length)
    for (const row of ranked) {
      expect(getRankingHighlight(countries, row.country)).toEqual({ score: row.ranking, scale: ranked.length })
    }
  })
})
