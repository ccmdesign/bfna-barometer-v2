// CMS sort values establish order, but can contain gaps after a country is removed.
// Rank only the included countries with data; equal values share a competition rank.
export const getRankedCountries = (countries = []) => {
  const included = countries.filter(country =>
    country.country &&
    (typeof country.val === 'number' || typeof country.val === 'string') &&
    String(country.val).trim() !== '' &&
    Number.isFinite(Number(country.val))
  ).sort((a, b) => Number(a.val) - Number(b.val))

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
