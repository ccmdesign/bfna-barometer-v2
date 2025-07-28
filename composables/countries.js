import { useAsyncData } from 'nuxt/app'

export const useCountries = () => {
  // Fetch all country JSON files from content/countries/
  const europeanUnion = reactive({
    'name': 'European Union',
    'members': ['at', 'be', 'bg', 'hr', 'cy', 'cz', 'dk', 'ee', 'fi', 'fr', 'de', 'gr', 'hu', 'ie', 'it', 'lv', 'lt', 'lu', 'mt', 'nl', 'pl', 'pt', 'ro', 'sk', 'si', 'es', 'se' ]
  })
  
  const { data: countriesData } = useAsyncData('countries', async () => {
    const data = await queryCollection('countries').all()

    return data.map(item => ({
      code: item.code,
      name: item.name,
    }))
  })

  const countriesWithEU = computed(() => {
    if (!countriesData.value) {
      return []
    }
    const otherCountries = countriesData.value.filter(c => c.code.toLowerCase() !== 'eu')
    return [{ code: 'eu', name: 'European Union' }, ...otherCountries]
  })

  const countriesCode = computed(() => countriesWithEU.value.map(c => c.code))

  function getCountryName(code) {
    return countriesWithEU.value?.find(country => country.code === code)?.name || code
  }

  function getCountryCode(name) {
    if (!countriesWithEU.value) return undefined
    const country = countriesWithEU.value.find(
      country => country.name.toLowerCase() === name.toLowerCase()
    )
    return country ? country.code : undefined
  }

  return {
    countries: countriesCode,
    europeanUnion,
    getCountryName,
    getCountryCode,
  }
}