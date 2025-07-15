const main = require('../contentful/main')

const getCountries = async () => {
  const data = await main.contentfulClient.getEntries({
    content_type: 'country'
  });
  
  data.items.map(({ fields, sys: { id } }) => {
    const doc = {
      id: id,
      name: fields.name,
      slug: main.slugify(fields.name),
    }

    main.writeContent(doc, 'countries', true);

  });
}

module.exports = async function () {
  return await getCountries();
}