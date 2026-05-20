import path from 'node:path'
import Module from 'node:module'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// `contentful/topicsv2.js` is CommonJS and does `require('../contentful/main')`.
// vi.mock targets the ESM module graph and is NOT honored by Node's CJS loader,
// so we inject our stub straight into `require.cache` before topicsv2 is loaded.
const writeContentSpy = vi.fn()
const getImageAssetUrlSpy = vi.fn((url: string) => `${url}?w=2000&fm=webp&q=80&fit=fill`)
const contentfulClientStub = { getEntries: vi.fn() }

const mainStub = {
  contentfulClient: contentfulClientStub,
  slugify: (s: string) => String(s).toLowerCase().replace(/\s+/g, '-'),
  formatCountryName: (s: string) => String(s),
  getCodeByCountry: {} as Record<string, string>,
  getCodeByCountryCamelCase: {} as Record<string, string>,
  getImageAssetUrl: (url: string) => getImageAssetUrlSpy(url),
  writeContent: (item: unknown) => writeContentSpy(item),
  checkFolder: vi.fn().mockResolvedValue(true)
}

const repoRoot = path.resolve(__dirname, '..', '..')
const mainPath = require.resolve(path.join(repoRoot, 'contentful', 'main.js'))
const topicsv2Path = require.resolve(path.join(repoRoot, 'contentful', 'topicsv2.js'))

// Seed require.cache so any `require('../contentful/main')` resolves to mainStub.
require.cache[mainPath] = {
  id: mainPath,
  filename: mainPath,
  loaded: true,
  exports: mainStub,
  paths: [],
  children: [],
  // The CJS Module type expects more fields than we need here.
} as unknown as NodeJS.Module

// Make sure topicsv2 picks up the seeded main on first require.
// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
delete require.cache[topicsv2Path]
// eslint-disable-next-line @typescript-eslint/no-require-imports
const topicsv2 = require(topicsv2Path) as {
  (): Promise<void>
  isAllowedImageAsset: (file: unknown) => boolean
}

type AssetFields = { title?: string, file: { url: string, contentType: string } }

const buildTopicWith = (fileFields: AssetFields | undefined) => {
  return {
    sys: { id: 'topic-1' },
    fields: {
      topic: 'Transatlantic Trade',
      description: 'topic desc',
      period: '2024-01-01',
      tags: ['trade'],
      infographics: [
        {
          sys: { id: 'cig-1', contentType: { sys: { id: 'customInfographic' } } },
          fields: {
            title: 'Balance of Trade',
            description: 'desc',
            ...(fileFields ? { file: { sys: { id: 'asset-1' }, fields: fileFields } } : {})
          }
        }
      ]
    }
  }
}

describe('isAllowedImageAsset', () => {
  it('returns true for allowed image content types', () => {
    for (const ct of ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']) {
      expect(topicsv2.isAllowedImageAsset({ fields: { file: { contentType: ct, url: '//x' } } })).toBe(true)
    }
  })

  it('returns true case-insensitively', () => {
    expect(topicsv2.isAllowedImageAsset({ fields: { file: { contentType: 'IMAGE/PNG', url: '//x' } } })).toBe(true)
  })

  it('returns false for non-image content types', () => {
    for (const ct of ['application/pdf', 'application/octet-stream', 'text/html', 'image/x-icon', '']) {
      expect(topicsv2.isAllowedImageAsset({ fields: { file: { contentType: ct, url: '//x' } } })).toBe(false)
    }
  })

  it('returns false when contentType is missing', () => {
    expect(topicsv2.isAllowedImageAsset({ fields: { file: { url: '//x' } } })).toBe(false)
    expect(topicsv2.isAllowedImageAsset({ fields: {} })).toBe(false)
    expect(topicsv2.isAllowedImageAsset(null)).toBe(false)
    expect(topicsv2.isAllowedImageAsset(undefined)).toBe(false)
  })
})

describe('getTopics customInfographicFile mapping', () => {
  beforeEach(() => {
    writeContentSpy.mockClear()
    getImageAssetUrlSpy.mockClear()
    contentfulClientStub.getEntries.mockReset()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const runMapper = async (fileFields: AssetFields | undefined) => {
    const topic = buildTopicWith(fileFields)
    contentfulClientStub.getEntries.mockImplementation((query: { content_type: string }) => {
      if (query.content_type === 'topics') return Promise.resolve({ items: [topic] })
      if (query.content_type === 'country') return Promise.resolve({ items: [] })
      if (query.content_type === 'treemapChart') return Promise.resolve({ items: [] })
      return Promise.resolve({ items: [] })
    })
    await topicsv2()
    // The forEach inside getTopics is async; flush microtasks before reading writes.
    await new Promise((resolve) => setImmediate(resolve))
    const writtenTopic = writeContentSpy.mock.calls.find(([item]) => item && item.id === 'topic-1')
    return writtenTopic ? writtenTopic[0] : null
  }

  it('sets url to empty string when the asset contentType is application/pdf', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const topic = await runMapper({
      title: 'BoT PDF',
      file: { url: '//images.ctfassets.net/x/y/z.pdf', contentType: 'application/pdf' }
    })
    expect(topic).not.toBeNull()
    const infgc = topic!.infographics[0]
    expect(infgc.customInfographicFile.url).toBe('')
    expect(infgc.customInfographicFile.title).toBe('BoT PDF')
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('[BF-65]'))
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('application/pdf'))
  })

  it('sets url to the Contentful Image API URL when contentType is image/png', async () => {
    const topic = await runMapper({
      title: 'BoT PNG',
      file: { url: '//images.ctfassets.net/x/y/z.png', contentType: 'image/png' }
    })
    expect(topic).not.toBeNull()
    const infgc = topic!.infographics[0]
    expect(infgc.customInfographicFile.url).toBe('//images.ctfassets.net/x/y/z.png?w=2000&fm=webp&q=80&fit=fill')
    expect(infgc.customInfographicFile.title).toBe('BoT PNG')
  })

  it('sets url to empty string when there is no file at all (no warn)', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const topic = await runMapper(undefined)
    expect(topic).not.toBeNull()
    const infgc = topic!.infographics[0]
    expect(infgc.customInfographicFile.url).toBe('')
    expect(infgc.customInfographicFile.title).toBe('')
    expect(warnSpy).not.toHaveBeenCalled()
  })
})

// silence unused-import warning for Module (kept for clarity that we manipulate it)
void Module
