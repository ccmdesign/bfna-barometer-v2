import dotenv from 'dotenv';
import { createDirectus, rest, readItems } from '@directus/sdk';

dotenv.config();

const CONTENT_STATUS = process.env.DEV ? JSON.parse(process.env.DEV) : ["published"]
const client = createDirectus(process.env.BASE_URL).with(rest());

// get content from directus
export const getDirectusData = async (collectionName, junctionFields=undefined) => {
  const content = await client.request(readItems(collectionName, {
    fields: junctionFields ? [`*.*`, ...junctionFields] : ['*.*'],
    limit: -1,
    filter: {
      "status": {
        "_in" : CONTENT_STATUS
      }
    }
  }));

  return { data: content };
}

// getImageUrl
// Returns null when the id is missing, blank, the literal strings
// 'undefined' / 'null', or otherwise not UUID-shaped. This guards against
// Netlify builds that fire mid-edit (Directus webhook) when a custom
// infographic row has no file attached — see BF-63.
export const getImage = (imageId) => {
  if (typeof imageId !== 'string') return null;
  const trimmed = imageId.trim();
  if (!trimmed) return null;
  if (trimmed === 'undefined' || trimmed === 'null') return null;
  if (!/^[a-f0-9-]{8,}$/i.test(trimmed)) return null;
  return `${ process.env.BASE_URL }/assets/${ imageId }`;
}

// slugify
export const slugify = (term) => {
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

export const formatDate = (date) => {
  if (!date) return '';

  return new Date(date).toLocaleDateString(
    'en-gb',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  );
}

export const formatTime = (date) => {
  if (!date) return '';

  return new Date(date).toLocaleTimeString(
    'en',
    {
      hour: "2-digit",
      minute: "2-digit"
    }
  );
}
