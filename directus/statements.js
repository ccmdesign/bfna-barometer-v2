import fs from 'fs';
import { rimraf } from 'rimraf';
import * as common from './common.js';

const countryNameToCode = {
  'Austria': 'at',
  'Belgium': 'be',
  'Bulgaria': 'bg',
  'Canada': 'ca',
  'Croatia': 'hr',
  'Cyprus': 'cy',
  'Czechia': 'cz',
  'Czech Republic': 'cz',
  'Denmark': 'dk',
  'Estonia': 'ee',
  'European Union': 'eu',
  'Finland': 'fi',
  'France': 'fr',
  'Germany': 'de',
  'Greece': 'gr',
  'Hungary': 'hu',
  'Ireland': 'ie',
  'Italy': 'it',
  'Latvia': 'lv',
  'Lithuania': 'lt',
  'Luxembourg': 'lu',
  'Malta': 'mt',
  'Netherlands': 'nl',
  'Poland': 'pl',
  'Portugal': 'pt',
  'Romania': 'ro',
  'Slovakia': 'sk',
  'Slovenia': 'si',
  'Spain': 'es',
  'Sweden': 'se',
  'United Kingdom': 'gb',
  'United States': 'us'
};

const getCountryCode = (countryNameOrCode) => {
  if (!countryNameOrCode) return '';
  if (countryNameOrCode.length === 2) {
    return countryNameOrCode.toLowerCase();
  }
  return countryNameToCode[countryNameOrCode] || countryNameOrCode.toLowerCase();
};

const objectContructor = async (dir, fs) => {
  try {
    const items = await common.getDirectusData("barometer_topics");

    // Group statements by country
    const statementsByCountry = {};

    items.data.forEach((item) => {
      const topicId = item.id || '';
      const statements = item.statements;

      if (!statements || !Array.isArray(statements) || statements.length === 0) {
        return;
      }

      statements.forEach((entry) => {
        const countryName = entry.country || '';
        if (!countryName) {
          console.warn('Statement entry missing country for topic:', topicId);
          return;
        }

        const countryCode = getCountryCode(countryName);
        const countrySlug = common.slugify(countryName);

        if (!(countryCode in statementsByCountry)) {
          statementsByCountry[countryCode] = {
            slug: countrySlug,
            countryCode: countryCode,
            country: countryName,
            statements: [],
            topicsByCountry: []
          };
        }

        const statement = {
          id: '',
          slug: countrySlug,
          topic: topicId,
          country: countryCode,
          description: entry.description || '',
          links: entry.links || [],
          furtherReading: [],
          infographicBaseData: 0
        };

        statementsByCountry[countryCode].statements.push(statement);

        if (topicId && !statementsByCountry[countryCode].topicsByCountry.includes(topicId)) {
          statementsByCountry[countryCode].topicsByCountry.push(topicId);
        }
      });
    });

    // Write files for each country
    for (const countryCode in statementsByCountry) {
      const countryData = statementsByCountry[countryCode];
      const fileName = countryData.slug + '.json';

      fs.writeFile(
        dir + "/" + fileName,
        JSON.stringify(countryData),
        function (err, result) {
          if (err) console.log("error", err);
        }
      );
      console.log("WRITING STATEMENTS: ", fileName);
    }
  } catch (error) {
    console.error('Error in objectContructor:', error);
  }
}

export const getStatements = async () => {
  const dir = "./content/statements";

  try {
    if (fs.existsSync(dir)) {
      await rimraf(dir);
    }

    if (!fs.existsSync("./content")) {
      fs.mkdirSync("./content");
    }
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    await objectContructor(dir, fs);
  } catch (err) {
    console.error('Error in getStatements:', err);
  }
}
