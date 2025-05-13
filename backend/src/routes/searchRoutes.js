const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;

if (!PIXABAY_API_KEY) {
  console.warn('⚠️ Warning: PIXABAY_API_KEY is not set in the environment.');
}

router.post('/search', async (req, res) => {
  const { query, page = 1 } = req.body;

  if (!query) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    const url = 'https://pixabay.com/api/';
    const response = await axios.get(url, {
      params: {
        key: PIXABAY_API_KEY,
        q: query,
        image_type: 'all',
        safesearch: true,
        per_page: 50,
        page
      }
    });

    const results = response.data?.hits || [];
    return res.json(results);
  } catch (err) {
    console.error('❌ Pixabay search error:', err.message);
    return res.status(500).json({ message: 'Search failed. Please try again later.' });
  }
});

module.exports = router;
