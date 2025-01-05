import fetch from 'node-fetch';
import juice from 'juice';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
    const inlinedHtml = juice(html); // Inline styles

    res.status(200).send(inlinedHtml);
  } catch (error) {
    console.error('Error processing the request:', error.message);
    res.status(500).json({ error: 'Failed to process the request. ' + error.message });
  }
}
