const hasSortValue = country =>
  (typeof country.val === 'number' || typeof country.val === 'string') &&
  String(country.val).trim() !== '' &&
  Number.isFinite(Number(country.val))

// A ranking entry is included even when its CMS sort metadata is missing.
// Incomplete metadata cannot establish a numeric order: preserve the supplied
// list order, as the chart did before, rather than coercing null to zero.
export const getRankedCountries = (countries = []) => {
  const included = countries.filter(country => country.country)
  if (!included.every(hasSortValue)) {
    return included.map((country, index) => ({ ...country, ranking: index + 1 }))
  }

  // Complete sort metadata can contain gaps after removals. Close those gaps
  // while retaining equal values as competition ties.
  included.sort((a, b) => Number(a.val) - Number(b.val))

  let rank = 0
  return included.map((country, index) => {
    if (index === 0 || Number(country.val) !== Number(included[index - 1].val)) {
      rank = index + 1
    }
    return { ...country, ranking: rank }
  })
}

export const getRankingHighlight = (countries, countryCode) => {
  const ranked = getRankedCountries(countries)
  const country = ranked.find(item => item.country === countryCode)
  return country ? { score: country.ranking, scale: ranked.length } : null
}
