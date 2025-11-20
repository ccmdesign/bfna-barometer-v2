import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    countries: defineCollection({
      source: 'countries/*.json',
      type: 'data',
      // Define custom schema for docs collection
      schema: z.object({
        id: z.string(),
        slug: z.string(),
        name: z.string(),
        code: z.string(),
      })
    }),
    statements: defineCollection({
      source: 'statements/*.json',
      type: 'data',
      schema: z.any()
    }),
    topics: defineCollection({
      source: 'topics/*.json',
      type: 'data',
      // Define custom schema for docs collection
      schema: z.object({
        id: z.string(),
        topicId: z.string(),
        slug: z.string(),
        isArchived: z.boolean(),
        title: z.string(),
        country: z.string(),
        description: z.string(),
        period: z.string(),
        periodWithDay: z.string(),
        infographic: z.string(),
        video: z.string(),
        deepDive: z.string(),
        infographicsType2: z.array(z.unknown()),
        infographics: z.array(z.unknown()),
        category: z.string(),
        tags: z.array(z.string()),
        tagsAsString: z.string(),
        new: z.boolean(),
        active: z.boolean(),
      })
    }),
  }
})
