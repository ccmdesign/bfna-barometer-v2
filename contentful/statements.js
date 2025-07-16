const main = require('../contentful/main')

const getLinks = (links) => {
  let result = []
  if(links !== undefined) {

    links.forEach(a => {
      result.push({
      'label': a.substr(0, a.indexOf("|")).trim(),
      'url': a.substr(a.indexOf('|') +1, a.length).trim()
      })
    })
  }

  return result
}

const checkValidTopic = (topic) => {
  let topicId = ''
  if (topic.length > 0) {
    topic.forEach((a) => {
      if (a.sys && a.sys.revision) {
        topicId = a.sys.id
      }
    })
  } 
  return topicId
}


const statementsByContrtry = {};

const getStatements = async () => {
  const data = await main.contentfulClient.getEntries({
    content_type: "statements",
    limit: 1000,
    // include: 2,
  });

  data.items.map(({ fields, sys: { id } }) => {

    const countryCode = main.getCodeByCountry[fields.country];
    const doc = {
      id: id,
      slug: `${main.slugify(fields.country)}`,
      topic: checkValidTopic(fields.topic), // fields.topic[0].sys.id,
      country: countryCode,
      description: fields.description && fields.description.content ? fields.description.content[0].content[0].value : '',
      links: getLinks(fields.links),
      furtherReading: getLinks(fields.furtherReading),

      // infographic info
      infographicBaseData: fields.infographicData ? fields.infographicData : 0,
      infographicTime: fields.infographicTime,
      infographicLabel: fields.infographicLabel

    };

    if (!(countryCode in statementsByContrtry)) {
      statementsByContrtry[countryCode] = {
        slug: main.slugify(fields.country),
        countryCode: countryCode,
        country: fields.country,
        statements: [],
        topicsByCountry: []
      };
    }

    statementsByContrtry[countryCode].statements.push(doc);

    const currentTopic = checkValidTopic(fields.topic);
    if(currentTopic) statementsByContrtry[countryCode].topicsByCountry.push(currentTopic);

  });

  for(const country in statementsByContrtry) {
    const item = statementsByContrtry[country];
    main.writeContent(item, 'statements', true);
  }

};

module.exports = async function () {
  return await getStatements();
}