import express from 'express';
import fetch from 'node-fetch';
import juice from 'juice';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/inline-styles', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required in the request body.' });
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch HTML. HTTP status: ${response.status}`);
    }

    const html = await response.text();
    const inlinedHtml = juice(html);

    res.status(200).send(inlinedHtml);
  } catch (error) {
    console.error('Error processing the request:', error.message);
    res.status(500).json({ error: 'Failed to process the request. ' + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Juice Inline Styles API is running on http://localhost:${PORT}`);
});
