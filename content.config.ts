import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    statements: defineCollection({
      source: 'statements/*.json',
      type: 'data',
      // Define custom schema for docs collection
      schema: z.object({
        id: z.string(),
        slug: z.string(),
        countryCode: z.string(),
        statements: z.array(z.any()), // Adjust type if you know the structure
        topicsIds: z.array(z.string())
      })
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
        infographicsType2: z.array(z.any()),
        infographics: z.array(z.any()),
        category: z.string(),
        tags: z.array(z.string()),
        new: z.boolean(),
      })
    }),
  }
})
