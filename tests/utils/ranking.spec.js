import { describe, expect, it } from 'vitest'
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

  it('does not turn missing values into first place or count unranked countries', () => {
    const missing = [null, undefined, '', ' ', 'N/A', NaN, Infinity, false]
    const countries = [{ country: 'us', val: 0 }, ...missing.map((val, i) => ({ country: `missing-${i}`, val })), { country: '', val: 1 }]
    expect(getRankedCountries(countries)).toEqual([{ country: 'us', val: 0, ranking: 1 }])
    expect(getRankingHighlight(countries, 'us')).toEqual({ score: 1, scale: 1 })
    expect(getRankingHighlight(countries, 'missing-0')).toBeNull()
    expect(getRankedCountries()).toEqual([])
    expect(getRankingHighlight([], 'us')).toBeNull()
  })
})
