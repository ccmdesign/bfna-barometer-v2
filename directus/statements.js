import fs from 'fs';
import { rimraf } from 'rimraf';
import * as common from './common.js';


const objectContructor = async (dir, fs) => {
  try {
    // use this list to add fields from junction tables
    const junctionFields = [
      'topics.topic_id.*',
      'country.*',
    ]

    const items = await common.getDirectusData("barometer_statements", junctionFields);

    // Group statements by country
    const statementsByCountry = {};

    items.data.forEach((item) => {
      // Get country information
      const country = item.country;
      if (!country) {
        console.warn('Statement missing country:', item.id);
        return;
      }

      const countryCode = country.code || '';
      const countryName = country.name || '';
      const countrySlug = common.slugify(countryName);

      // Initialize country object if it doesn't exist
      if (!(countryCode in statementsByCountry)) {
        statementsByCountry[countryCode] = {
          slug: countrySlug,
          countryCode: countryCode,
          country: countryName,
          statements: [],
          topicsByCountry: []
        };
      }

      // Get topic ID from junction table
      // The junction table structure: item.topics is an array, each element has topic_id which contains the topic object
      let topicId = '';
      if (item.topics && Array.isArray(item.topics) && item.topics.length > 0) {
        // Get the first topic's topic_id
        const firstTopic = item.topics[0];

        if (firstTopic.barometer_topics_id) {
          // topic_id might be an object with topicId field, or it might be the topicId directly
          topicId = firstTopic.barometer_topics_id;
        }
      }

      // Map Directus field names to expected output format
      // Directus uses snake_case, but output uses camelCase
      const furtherReading = item.further_readings || item.furtherReading || [];
      const infographicBaseData = item.infographic_base_data !== undefined 
        ? item.infographic_base_data 
        : (item.infographicBaseData !== undefined ? item.infographicBaseData : 0);

      // Build statement object matching the expected format
      const statement = {
        id: item.id || '',
        slug: countrySlug,
        topic: topicId,
        country: countryCode,
        description: item.description || '',
        links: item.links || [],
        furtherReading: furtherReading,
        infographicBaseData: infographicBaseData
      };
      // Add statement to country
      statementsByCountry[countryCode].statements.push(statement);

      // Add topic to topicsByCountry if not already present (ensure uniqueness)
      if (topicId && !statementsByCountry[countryCode].topicsByCountry.includes(topicId)) {
        statementsByCountry[countryCode].topicsByCountry.push(topicId);
      }
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
