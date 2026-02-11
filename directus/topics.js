import fs from 'fs';
import { rimraf } from 'rimraf';
import * as common from './common.js';

// Country name to code mapping
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

// Helper function to get country code from name or code
const getCountryCode = (countryNameOrCode) => {
  if (!countryNameOrCode) return '';
  // If it's already a 2-letter code, return it
  if (countryNameOrCode.length === 2) {
    return countryNameOrCode.toLowerCase();
  }
  // Otherwise, try to map from name
  return countryNameToCode[countryNameOrCode] || countryNameOrCode.toLowerCase();
};

// Process infographic based on type
const processInfographic = (infographic, infographicType) => {
  // Parse countries JSON if it's a string
  let countriesData = [];
  if (infographic.countries) {
    if (typeof infographic.countries === 'string') {
      try {
        countriesData = JSON.parse(infographic.countries);
      } catch (e) {
        console.warn('Failed to parse countries JSON:', e);
        countriesData = [];
      }
    } else if (Array.isArray(infographic.countries)) {
      countriesData = infographic.countries;
    }
  }

  if (infographicType === 'rankingChart') {
    const ranking = infographic.rankingCountries.find((c) => c.id === infographic.id)?.ranking ?? [];
    countriesData = ranking
      .map((item) => ({
        country_name: item.barometer_countries_id?.name,
        val: item.sort
      }))
  }

  let cellsData = [];
  if (infographicType === 'treemapChart') {
    cellsData = infographic.treemapCells.find((c) => c.id === infographic.id)?.cell.map((cell) => ({
      name: cell.barometer_treemapcell_id?.name,
      value: cell.barometer_treemapcell_id?.value
    }));
  }


  // Transform countries data to expected format
  const countries = countriesData.map(country => {
    // Handle both formats: 
    // 1. {country_name: "Austria", value: "123"} or {country_name: "Austria", date: "2021-01-01"}
    // 2. {country: "at", val: 123}
    let countryCode = '';
    if (country.country) {
      countryCode = getCountryCode(country.country);
    } else if (country.country_name) {
      countryCode = getCountryCode(country.country_name);
    }
    
    const value = country.val !== undefined ? country.val : country.value;
    const date = country.date || (infographicType === 'timelineChart' && typeof value === 'string' && value.includes('-') ? value : undefined);
    
    return {
      country: countryCode,
      val: date || value
    };
  }).filter(c => c.country); // Filter out entries without country code

  // Build vizCountries object
  const vizCountries = {};
  countries.forEach(c => {
    if (c.country) {
      vizCountries[c.country] = true;
    }
  });

  // Determine infographic type from table name or field
  let type = infographicType;
  if (!type) {
    // Try to infer from table structure or fields
    if (infographic.date !== undefined || countries.some(c => typeof c.val === 'string' && c.val.includes('-'))) {
      type = 'timelineChart';
    } else if (infographic.scale_limit !== undefined) {
      type = 'choroplethChart';
    } else {
      type = 'barChart';
    }
  }

  // Build base infographic object
  const infographicObj = {
    infographicId: infographic.id || '',
    infographicType: type,
    title: infographic.title || '',
    slug: common.slugify(infographic.title || ''),
    infographicDescription: infographic.description || '',
    cells: cellsData,
    countries: countries.sort((a, b) => {
      if (type === 'timelineChart') {
        const dateA = new Date(a.val);
        const dateB = new Date(b.val);
        return dateA - dateB;
      
      } else if (type === 'rankingChart') {
        return a.val - b.val;
      
      } else {
        // For bar and choropleth charts, sort by value descending
        const valA = parseFloat(a.val) || 0;
        const valB = parseFloat(b.val) || 0;
        return valB - valA;
      }
    }),
    vizCountries: vizCountries,
    vizMarkers: {},
    customInfographicFile: {
      url: '',
      title: ''
    }
  };

  if(type === 'customInfographic') {
    infographicObj.customInfographicFile = {
      url: common.getImage(infographic.file),
      title: infographic.title,
      description: infographic.description
    }
  }

  // Add type-specific fields
  if (type === 'barChart') {
    infographicObj.highestCountryValueAsScaleLimit = infographic.display_country_value_as_scale_limit || false;
    infographicObj.infographicValuesAsPercentage = infographic.value_as_percentage || false;
  } else if (type === 'choroplethChart') {
    infographicObj.scaleLimit = infographic.scale_limit || null;
    infographicObj.infographicValuesAsPercentage = infographic.value_as_percentage || false;
  }
  // timelineChart doesn't have these fields

  return infographicObj;
};

const objectContructor = async (dir, fs) => {
  try {
    // Fetch topics with infographics relationships
    const junctionFields = [
      'bar_chart.barometer_barchart_id.*',
      'choropleth_chart.barometer_choroplethchart_id.*',
      'ranking_chart.barometer_rankingchart_id.*',
      'updated_ranking_chart.barometer_updatedrankingchart_id.*',
      'timeline_chart.barometer_timelinechart_id.*',
      'treemap_chart.barometer_treemapchart_id.*',
      'custom.barometer_custom_infographics_id.*',
    ];

    const items = await common.getDirectusData("barometer_topics", junctionFields);
    const rankingCountries = await common.getDirectusData("barometer_rankingchart", ['ranking.barometer_countries_id.*']);
    const treemapCells = await common.getDirectusData("barometer_treemapchart", ['cell.barometer_treemapcell_id.*']);

    // Process all topics
    const topics = {};
    const allTopics = [];

    items.data.forEach((item) => {
      // Format period
      let period = '';
      let periodWithDay = '';
      if (item.period) {
        if (typeof item.period === 'string' && item.period.includes('-')) {
          // ISO date format
          const date = new Date(item.period);
          period = `${date.toLocaleDateString('en', { timeZone: 'utc', month: 'long' })} ${date.getFullYear()}`;
          periodWithDay = item.period;
        } else {
          period = item.period;
          periodWithDay = item.period;
        }
      }

      // Process infographics
      const infographics = [];
      const infographicsType2 = [];

      // Process bar charts
      if (item.bar_chart && Array.isArray(item.bar_chart)) {
        item.bar_chart.forEach(infographic => {
          const processed = processInfographic(infographic.barometer_barchart_id, 'barChart');
          infographics.push(processed);
          infographicsType2.push(infographic); // Keep raw data
        });
      }

      // Process timeline charts
      if (item.timeline_chart && Array.isArray(item.timeline_chart)) {
        item.timeline_chart.forEach(infographic => {
          const processed = processInfographic(infographic.barometer_timelinechart_id, 'timelineChart');
          infographics.push(processed);
          infographicsType2.push(infographic); // Keep raw data
        });
      }

      // Process choropleth charts
      if (item.choropleth_chart && Array.isArray(item.choropleth_chart)) {
        item.choropleth_chart.forEach(infographic => {
          const processed = processInfographic(infographic.barometer_choroplethchart_id, 'choroplethChart');
          infographics.push(processed);
          infographicsType2.push(infographic); // Keep raw data
        });
      }

      // Process treemap charts
      if (item.treemap_chart && Array.isArray(item.treemap_chart)) {
        item.treemap_chart.forEach(infographic => {
          const processed = processInfographic({...infographic.barometer_treemapchart_id, treemapCells: treemapCells.data}, 'treemapChart');
          infographics.push(processed);
          infographicsType2.push(infographic); // Keep raw data
        });
      }

      // Process custom infographics
      if (item.custom && Array.isArray(item.custom)) {
        item.custom.forEach(infographic => {
          const processed = processInfographic(infographic.barometer_custom_infographics_id, 'customInfographic');
          infographics.push(processed);
          infographicsType2.push(infographic); // Keep raw data
        });
      }

      // Process updated ranking charts
      if (item.updated_ranking_chart && Array.isArray(item.updated_ranking_chart)) {
        item.updated_ranking_chart.forEach(infographic => {
          const processed = processInfographic(infographic.barometer_updatedrankingchart_id, 'updatedRankingChart');
          infographics.push(processed);
          infographicsType2.push(infographic); // Keep raw data
        });
      }

      // Process ranking charts
      if (item.ranking_chart && Array.isArray(item.ranking_chart)) {
        item.ranking_chart.forEach(infographic => {
          const processed = processInfographic({...infographic.barometer_rankingchart_id, rankingCountries: rankingCountries.data}, 'rankingChart');
          infographics.push(processed);
          infographicsType2.push(infographic); // Keep raw data
        });
      }

      // Build topic object
      const topic = {
        id: item.id || '',
        topicId: item.topicId || item.id || '',
        title: item.topic || '',
        isArchived: item.archived || false,
        slug: common.slugify(item.topic || ''),
        description: item.description || '',
        period: period,
        periodWithDay: periodWithDay,
        tagsAsString: item.tags ? (Array.isArray(item.tags) ? item.tags.join(', ').toUpperCase() : item.tags) : '',
        infographic: item.infographic || '',
        video: item.video || '',
        deepDive: item.deep_dive || item.deepDive || '',
        infographicsType2: infographicsType2,
        infographics: infographics,
        new: false,
        active: false
      };

      topics[item.id] = topic;
      allTopics.push(topic);
    });

    // Determine newest topic and mark it as new and active
    if (allTopics.length > 0) {
      const sortedByDate = allTopics
        .filter(t => t.periodWithDay)
        .sort((a, b) => {
          const dateA = new Date(a.periodWithDay);
          const dateB = new Date(b.periodWithDay);
          return dateB - dateA;
        });

      if (sortedByDate.length > 0) {
        const newestTopicId = sortedByDate[0].id;
        if (topics[newestTopicId]) {
          topics[newestTopicId].new = true;
          topics[newestTopicId].active = true;
        }
      }
    }

    // Write files
    for (const topicId in topics) {
      const topic = topics[topicId];
      const fileName = topic.slug + '.json';

      fs.writeFile(
        dir + "/" + fileName,
        JSON.stringify(topic),
        function (err, result) {
          if (err) console.log("error", err);
        }
      );
      console.log("WRITING TOPICS: ", fileName);
    }
  } catch (error) {
    console.error('Error in objectContructor:', error);
  }
}

export const getTopics = async () => {
  const dir = "./content/topics";

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
    console.error('Error in getTopics:', err);
  }
}
