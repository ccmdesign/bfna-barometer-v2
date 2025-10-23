import { H3Event, readBody } from 'h3'
import fetch from 'node-fetch'

export default defineEventHandler(async (event: H3Event) => {
  const apiKey = useRuntimeConfig().public.mailchimpApiKey
  const mailchimpAudienceId = useRuntimeConfig().public.mailchimpListId
  const body = await readBody(event)
  const { name, email } = body

  if (!email) {
    throw createError({ statusCode: 400, statusMessage: 'E-mail is required.' })
  }
  const dataCenter = apiKey?.split('-')[1] // exemplo: 'us21'

  const response = await fetch(`https://${dataCenter}.api.mailchimp.com/3.0/lists/${mailchimpAudienceId}/members`, {
    method: 'POST',
    headers: {
      'Authorization': `apikey ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        EMAIL: email,
        FNAME: name.split(' ')[0] || '',
        LNAME: name.split(' ').slice(1).join(' ') || ''
      }
    })
  })

  const data = await response.json()

  if (!response.ok) {
    console.error('Mailchimp error:', data)
    throw createError({ statusCode: 400, statusMessage: data.detail || 'Error while subscribing' })
 }

  return { success: true, message: 'Registration completed successfully!' }
})
