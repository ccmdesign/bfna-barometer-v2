import Papa from 'papaparse'
import { get, set } from 'lodash'

export const downloadCSV = (csv) => {
    // Create a download link
  const blob = new Blob([csv], { type: 'text/csv' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'comparison-data.csv'
  link.click()
  URL.revokeObjectURL(link.href)
}

/**
 * Flattens a nested object into a single-level object with dot notation keys
 * @param {Object} obj - The nested object to flatten
 * @param {String} prefix - The prefix for the keys (used in recursion)
 * @returns {Object} - Flattened object
 */
export const flattenObject = (obj, prefix = '') => {
  return Object.keys(obj).reduce((acc, key) => {
    const pre = prefix.length ? `${prefix}.` : ''
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(acc, flattenObject(obj[key], `${pre}${key}`))
    } else if (Array.isArray(obj[key])) {
      // Handle arrays by creating indexed keys
      obj[key].forEach((item, index) => {
        if (typeof item === 'object' && item !== null) {
          Object.assign(acc, flattenObject(item, `${pre}${key}[${index}]`))
        } else {
          acc[`${pre}${key}[${index}]`] = item
        }
      })
    } else {
      acc[`${pre}${key}`] = obj[key]
    }
    
    return acc
  }, {})
}

/**
 * Converts an array of nested objects to CSV
 * @param {Array} objects - Array of objects to convert
 * @param {Object} options - Additional options
 * @returns {String} - CSV string
 */
export const objectsToCSV = (objects, options = {}) => {
  if (!Array.isArray(objects) || objects.length === 0) {
    return ''
  }
  
  // Flatten all objects
  const flattenedObjects = objects.map(obj => flattenObject(obj))
  
  // Generate CSV using PapaParse
  return Papa.unparse(flattenedObjects, {
    header: true,
    ...options
  })
}

/**
 * Converts a single nested object to CSV
 * @param {Object} object - Object to convert
 * @param {Object} options - Additional options
 * @returns {String} - CSV string
 */
export const objectToCSV = (object, options = {}) => {
  return objectsToCSV([object], options)
}

/**
 * Reconstructs a nested object from a flattened object with dot notation
 * @param {Object} flattenedObj - Flattened object with dot notation keys
 * @returns {Object} - Reconstructed nested object
 */
export const unflattenObject = (flattenedObj) => {
  const result = {}
  
  Object.keys(flattenedObj).forEach(key => {
    set(result, key, flattenedObj[key])
  })
  
  return result
}

/**
 * Parses CSV back to an array of nested objects
 * @param {String} csv - CSV string
 * @returns {Array} - Array of reconstructed nested objects
 */
export const csvToObjects = (csv) => {
  const parsed = Papa.parse(csv, { header: true })
  
  return parsed.data.map(flatObj => unflattenObject(flatObj))
}
