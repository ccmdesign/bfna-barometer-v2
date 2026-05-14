import { getTopics } from './directus/topics.js';
import { getStatements } from './directus/statements.js';
import { getCountries } from './directus/countries.js';


console.log('');
console.log('Starting importing data from Directus...');
console.log('');
console.log('[ BAROMETER: TOPICS, STATEMENTS, COUNTRIES ]');

getTopics();
getStatements();
getCountries();