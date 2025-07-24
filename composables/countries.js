import { useAsyncData } from 'nuxt/app'

export const useCountries = () => {
  // Fetch all country JSON files from content/countries/
  const countriesCode = ref([])
  const { data: countries } = useAsyncData('countries', async () => {
    const data = await queryCollection('countries').all()


    return data.map(item => {
      countriesCode.value.push(item.code);
      return {
        code: item.code,
        name: item.name
      }
    })
  })

  function getCountryName(code) {
    return countries.value?.find(country => country.code === code)?.name || code
  }

  function getCountryCode(name) {
    if (!countries.value) return undefined
    const country = countries.value.find(
      country => country.name.toLowerCase() === name.toLowerCase()
    )
    return country ? country.code : undefined
  }

  return {
    countries: countriesCode,
    getCountryName,
    getCountryCode,
  }
}