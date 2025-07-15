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
        topic: z.string(),
        country: z.string(),
        description: z.string(),
        links: z.array(
          z.object({
            label: z.string(),
            url: z.string().url()
          })
        ),
        furtherReading: z.array(z.any()), // Adjust type if you know the structure
        infographicBaseData: z.number()
      })
    }),
    topics: defineCollection({
      source: 'topics/*.json',
      type: 'data',
      // Define custom schema for docs collection
      schema: z.object({
        id: z.string(),
        slug: z.string(),
        isArchived: z.boolean(),
        topic: z.string(),
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
