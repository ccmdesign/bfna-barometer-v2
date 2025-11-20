const fs = require('fs-extra');
require('dotenv').config();
const contentful = require("contentful");

const contentfulClient = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

// slugify
const slugify = (term) => {
  return term
    .toString()
    .toLowerCase()
    .replace(/[àÀáÁâÂãäÄÅåª]+/g, "a") // Special Characters #1
    .replace(/[èÈéÉêÊëË]+/g, "e") // Special Characters #2
    .replace(/[ìÌíÍîÎïÏ]+/g, "i") // Special Characters #3
    .replace(/[òÒóÓôÔõÕöÖº]+/g, "o") // Special Characters #4
    .replace(/[ùÙúÚûÛüÜ]+/g, "u") // Special Characters #5
    .replace(/[ýÝÿŸ]+/g, "y") // Special Characters #6
    .replace(/[ñÑ]+/g, "n") // Special Characters #7
    .replace(/[çÇ]+/g, "c") // Special Characters #8
    .replace(/[ß]+/g, "ss") // Special Characters #9
    .replace(/[Ææ]+/g, "ae") // Special Characters #10
    .replace(/[Øøœ]+/g, "oe") // Special Characters #11
    .replace(/[%]+/g, "pct") // Special Characters #12
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};

const getCodeByCountry = {
  "Afghanistan": "af",
  "\u00c5land Islands": "ax",
  "Albania": "al",
  "Algeria": "dz",
  "American Samoa": "as",
  "Andorra": "ad",
  "Angola": "ao",
  "Anguilla": "ai",
  "Antarctica": "aq",
  "Antigua and Barbuda": "ag",
  "Argentina": "ar",
  "Armenia": "am",
  "Aruba": "aw",
  "Australia": "au",
  "Austria": "at",
  "Azerbaijan": "az",
  "Bahamas": "bs",
  "Bahrain": "bh",
  "Bangladesh": "bd",
  "Barbados": "bb",
  "Belarus": "by",
  "Belgium": "be",
  "Belize": "bz",
  "Benin": "bj",
  "Bermuda": "bm",
  "Bhutan": "bt",
  "Bolivia": "bo",
  "Bonaire": "bq",
  "Bosnia and Herzegovina": "ba",
  "Botswana": "bw",
  "Bouvet Island": "bv",
  "Brazil": "br",
  "British Indian Ocean Territory": "io",
  "Brunei Darussalam": "bn",
  "Bulgaria": "bg",
  "Burkina Faso": "bf",
  "Burundi": "bi",
  "Cambodia": "kh",
  "Cameroon": "cm",
  "Canada": "ca",
  "Cape Verde": "cv",
  "Cayman Islands": "ky",
  "Central African Republic": "cf",
  "Chad": "td",
  "Chile": "cl",
  "China": "cn",
  "Christmas Island": "cx",
  "Cocos (Keeling) Islands": "cc",
  "Colombia": "co",
  "Comoros": "km",
  "Congo": "cg",
  "Congo": "cd",
  "Cook Islands": "ck",
  "Costa Rica": "cr",
  "C\u00f4te d'Ivoire": "ci",
  "Croatia": "hr",
  "Cuba": "cu",
  "Cura\u00e7ao": "cw",
  "Cyprus": "cy",
  "Czechia": "cz",
  "Denmark": "dk",
  "Djibouti": "dj",
  "Dominica": "dm",
  "Dominican Republic": "do",
  "Ecuador": "ec",
  "Egypt": "eg",
  "El Salvador": "sv",
  "Equatorial Guinea": "gq",
  "Eritrea": "er",
  "Estonia": "ee",
  "Ethiopia": "et",
  "Falkland Islands (Malvinas)": "fk",
  "Faroe Islands": "fo",
  "Fiji": "fj",
  "Finland": "fi",
  "France": "fr",
  "French Guiana": "gf",
  "French Polynesia": "pf",
  "French Southern Territories": "tf",
  "Gabon": "ga",
  "Gambia": "gm",
  "Georgia": "ge",
  "Germany": "de",
  "Ghana": "gh",
  "Gibraltar": "gi",
  "Greece": "gr",
  "Greenland": "gl",
  "Grenada": "gd",
  "Guadeloupe": "gp",
  "Guam": "gu",
  "Guatemala": "gt",
  "Guernsey": "gg",
  "Guinea": "gn",
  "Guinea-Bissau": "gw",
  "Guyana": "gy",
  "Haiti": "ht",
  "Heard Island and McDonald Islands": "hm",
  "Holy See (Vatican City State)": "va",
  "Honduras": "hn",
  "Hong Kong": "hk",
  "Hungary": "hu",
  "Iceland": "is",
  "India": "in",
  "Indonesia": "id",
  "Iran": "ir",
  "Iraq": "iq",
  "Ireland": "ie",
  "Isle of Man": "im",
  "Israel": "il",
  "Italy": "it",
  "Jamaica": "jm",
  "Japan": "jp",
  "Jersey": "je",
  "Jordan": "jo",
  "Kazakhstan": "kz",
  "Kenya": "ke",
  "Kiribati": "ki",
  "Korea": "kp",
  "Korea": "kr",
  "Kosovo": "xk",
  "Kuwait": "kw",
  "Kyrgyzstan": "kg",
  "Lao People's Democratic Republic": "la",
  "Latvia": "lv",
  "Lebanon": "lb",
  "Lesotho": "ls",
  "Liberia": "lr",
  "Libya": "ly",
  "Liechtenstein": "li",
  "Lithuania": "lt",
  "Luxembourg": "lu",
  "Macao": "mo",
  "Macedonia": "mk",
  "Madagascar": "mg",
  "Malawi": "mw",
  "Malaysia": "my",
  "Maldives": "mv",
  "Mali": "ml",
  "Malta": "mt",
  "Marshall Islands": "mh",
  "Martinique": "mq",
  "Mauritania": "mr",
  "Mauritius": "mu",
  "Mayotte": "yt",
  "Mexico": "mx",
  "Micronesia": "fm",
  "Moldova": "md",
  "Monaco": "mc",
  "Mongolia": "mn",
  "Montenegro": "me",
  "Montserrat": "ms",
  "Morocco": "ma",
  "Mozambique": "mz",
  "Myanmar": "mm",
  "Namibia": "na",
  "Nauru": "nr",
  "Nepal": "np",
  "Netherlands": "nl",
  "New Caledonia": "nc",
  "New Zealand": "nz",
  "Nicaragua": "ni",
  "Niger": "ne",
  "Nigeria": "ng",
  "Niue": "nu",
  "Norfolk Island": "nf",
  "Northern Mariana Islands": "mp",
  "Norway": "no",
  "Oman": "om",
  "Pakistan": "pk",
  "Palau": "pw",
  "Palestine": "ps",
  "Panama": "pa",
  "Papua New Guinea": "pg",
  "Paraguay": "py",
  "Peru": "pe",
  "Philippines": "ph",
  "Pitcairn": "pn",
  "Poland": "pl",
  "Portugal": "pt",
  "Puerto Rico": "pr",
  "Qatar": "qa",
  "R\u00e9union": "re",
  "Romania": "ro",
  "Russian Federation": "ru",
  "Rwanda": "rw",
  "Saint Barth\u00e9lemy": "bl",
  "Saint Helena": "sh",
  "Saint Kitts and Nevis": "kn",
  "Saint Lucia": "lc",
  "Saint Martin (French part)": "mf",
  "Saint Pierre and Miquelon": "pm",
  "Saint Vincent and the Grenadines": "vc",
  "Samoa": "ws",
  "San Marino": "sm",
  "Sao Tome and Principe": "st",
  "Saudi Arabia": "sa",
  "Senegal": "sn",
  "Serbia": "rs",
  "Seychelles": "sc",
  "Sierra Leone": "sl",
  "Singapore": "sg",
  "Sint Maarten (Dutch part)": "sx",
  "Slovakia": "sk",
  "Slovenia": "si",
  "Solomon Islands": "sb",
  "Somalia": "so",
  "South Africa": "za",
  "South Georgia and the South Sandwich Islands": "gs",
  "South Sudan": "ss",
  "Spain": "es",
  "Sri Lanka": "lk",
  "Sudan": "sd",
  "Suriname": "sr",
  "Svalbard and Jan Mayen": "sj",
  "Swaziland": "sz",
  "Sweden": "se",
  "Switzerland": "ch",
  "Syrian Arab Republic": "sy",
  "Taiwan": "tw",
  "Tajikistan": "tj",
  "Tanzania": "tz",
  "Thailand": "th",
  "Timor-Leste": "tl",
  "Togo": "tg",
  "Tokelau": "tk",
  "Tonga": "to",
  "Trinidad and Tobago": "tt",
  "Tunisia": "tn",
  "Turkey": "tr",
  "Turkmenistan": "tm",
  "Turks and Caicos Islands": "tc",
  "Tuvalu": "tv",
  "Uganda": "ug",
  "Ukraine": "ua",
  "United Arab Emirates": "ae",
  "United Kingdom": "gb",
  "United States": "us",
  "United States Minor Outlying Islands": "um",
  "Uruguay": "uy",
  "Uzbekistan": "uz",
  "Vanuatu": "vu",
  "Venezuela": "ve",
  "Viet Nam": "vn",
  "Virgin Islands British": "vg",
  "Virgin Islands U.S.": "vi",
  "Wallis and Futuna": "wf",
  "Western Sahara": "eh",
  "Yemen": "ye",
  "Zambia": "zm",
  "Zimbabwe": "zw",
  "African Union": "africanUnion",
  "European Union": "eu"
}

const getCodeByCountryCamelCase = {
  austria: "at",
  belgium: "be",
  bulgaria: "bg",
  canada: "ca",
  croatia: "hr",
  cyprus: "cy",
  czechRepublic: "cz",
  czechia: "cz",
  denmark: "dk",
  estonia: "ee",
  europeanUnion: "eu",
  finland: "fi",
  france: "fr",
  germany: "de",
  greece: "gr",
  hungary: "hu",
  ireland: "ie",
  italy: "it",
  latvia: "lv",
  lithuania: "lt",
  luxembourg: "lu",
  malta: "mt",
  netherlands: "nl",
  poland: "pl",
  portugal: "pt",
  romania: "ro",
  slovakia: "sk",
  slovenia: "si",
  spain: "es",
  sweden: "se",
  unitedKingdom: "gb",
  unitedStates: "us"
}

const checkFolder = (dirName) => {
  return new Promise((resolve) => {
    fs.access(dirName, fs.constants.F_OK, (err) => {
      if (err) {
        console.log('Folder does not exist yet, waiting...');
        setTimeout(() => resolve(false), 1000); // Check again after 1 second
      } else {
        resolve(true);
      }
    });
  });
}

const writeContent = async (item, folder, log = false) => {
  const dir = `./content/${folder}`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  while (!(await checkFolder(dir))) {
    console.log('waiting for folder to be created');
  }

  fs.writeFile(
    `${dir}/${item.slug}.json`,
    JSON.stringify(item),
    function (err) {
      if (err) console.log("error", err);
    }
  );

  if (log) console.log(`WRITING ${folder}: `, item.slug + ".json");

}

const formatCountryName = (countryName) => {
  const words = countryName.split(' ');
  const formattedWords = words.map((word, index) => {
    if (index === 0) {
      return word.toLowerCase();
    } else {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
  });
  return formattedWords.join('');
}


const getImageAssetUrl = (url) => {
  if (url && !url.startsWith('https://')) {
    url = 'https:' + url.replace(/^https?:\/\//, '');
  }
  return `${url}?w=2000&fm=webp&q=80&fit=fill`;
};

module.exports = {
  contentfulClient,
  slugify,
  checkFolder,
  writeContent,
  getCodeByCountry,
  getCodeByCountryCamelCase,
  formatCountryName,
  getImageAssetUrl
}