const main = require('../contentful/main')

const getCountries = async () => {
  const data = await main.contentfulClient.getEntries({
    content_type: 'country'
  });
  
  // Use a Set to track seen country names (or codes, or ids as needed)
  const seen = new Set();
  const countries = data.items.reduce((acc, { fields, sys: { id } }) => {
    const name = fields.name;
    if (!seen.has(name)) {
      seen.add(name);
      acc.push({
        id: id,
        name: name,
        code: main.getCodeByCountry[name],
        slug: main.slugify(name),
      });
    }
    return acc;
  }, []);

  for (const country of countries) main.writeContent(country, 'countries', true);

}

module.exports = async function () {
  return await getCountries();
}