import fetch from 'node-fetch';
import juice from 'juice';
import inlineCss from 'inline-css';

export default async function handler(req, res) {
  // Add CORS headers to allow cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins (for testing)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allow specific methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow specific headers

  // Handle preflight requests (CORS preflight uses OPTIONS method)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle POST requests for inlining styles
  if (req.method === 'POST') {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required in the request body.' });
    }

    try {
      // Fetch the HTML from the provided URL
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch HTML. HTTP status: ${response.status}`);
      }

      const html = await response.text();
      const inlinedHtml = await inlineCss(html, {url: 'http://localhost'})
      
      // const inlinedHtml = juice(html, {removeStyleTags: false,
      //   preserveMediaQueries: true,
      //   applyStyleTags: true,
      //   applyAttributesTableElements: true}); // Inline styles

      res.status(200).send(inlinedHtml);
    } catch (error) {
      console.error('Error processing the request:', error.message);
      res.status(500).json({ error: 'Failed to process the request. ' + error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
