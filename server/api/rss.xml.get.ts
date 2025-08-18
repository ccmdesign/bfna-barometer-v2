export default defineEventHandler(async (event) => {
  const hostname = 'https://transatlanticbarometer.org'
  
  const rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Transatlantic Barometer</title>
    <description>Interactive Policy Platform for Transatlantic Relations</description>
    <link>${hostname}</link>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${hostname}/api/rss.xml" rel="self" type="application/rss+xml"/>
    
    <item>
      <title>Welcome to Transatlantic Barometer</title>
      <description>An interactive digital platform providing up-to-date information on pressing issues shaping the transatlantic relationship between the US, Canada, UK, and EU.</description>
      <link>${hostname}</link>
      <guid>${hostname}</guid>
      <pubDate>${new Date().toUTCString()}</pubDate>
    </item>
  </channel>
</rss>`

  setHeader(event, 'Content-Type', 'application/xml')
  return rssContent
})
