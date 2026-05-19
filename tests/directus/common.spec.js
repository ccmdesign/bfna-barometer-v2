import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { getImage } from '../../directus/common.js'

describe('directus/common.js getImage', () => {
  const BASE_URL = 'https://directus.example.test'

  beforeEach(() => {
    vi.stubEnv('BASE_URL', BASE_URL)
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  describe('R1: falsy or sentinel-string ids return null', () => {
    it('returns null for undefined', () => {
      expect(getImage(undefined)).toBeNull()
    })

    it('returns null for null', () => {
      expect(getImage(null)).toBeNull()
    })

    it('returns null for empty string', () => {
      expect(getImage('')).toBeNull()
    })

    it('returns null for whitespace-only string', () => {
      expect(getImage('   ')).toBeNull()
    })

    it('returns null for the literal string "undefined"', () => {
      expect(getImage('undefined')).toBeNull()
    })

    it('returns null for the literal string "null"', () => {
      expect(getImage('null')).toBeNull()
    })
  })

  describe('R2: non-UUID-shaped ids return null', () => {
    it('returns null for an id containing a space', () => {
      expect(getImage('not a uuid')).toBeNull()
    })

    it('returns null for an id that is too short', () => {
      expect(getImage('xyz')).toBeNull()
    })

    it('returns null for an id with disallowed characters', () => {
      expect(getImage('zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz')).toBeNull()
    })
  })

  describe('R3: plausible UUIDs build the assets URL', () => {
    it('returns BASE_URL/assets/<id> for a well-formed UUID', () => {
      const id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
      expect(getImage(id)).toBe(`${BASE_URL}/assets/${id}`)
    })

    it('returns BASE_URL/assets/<id> for the prod-observed id shape', () => {
      const id = 'cfb6ffeb-1234-4567-89ab-cdef01234567'
      expect(getImage(id)).toBe(`${BASE_URL}/assets/${id}`)
    })

    it('does not mutate the id (no lowercase, no trim into the URL)', () => {
      const id = 'A1B2C3D4-E5F6-7890-ABCD-EF1234567890'
      expect(getImage(id)).toBe(`${BASE_URL}/assets/${id}`)
    })
  })
})
