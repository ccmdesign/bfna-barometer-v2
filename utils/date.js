export const formatedDate = (country) => {
  if (!country.val) return ''
  const date = new Date(country.val  + 'T00:00:00Z')
  const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })
  const year = String(date.getUTCFullYear()).slice(-2)
  return `${month} '${year}`
}