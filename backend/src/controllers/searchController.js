const axios = require('axios');
// const SearchHistory = require('../models/SearchHistory');
require('dotenv').config();

const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;

const searchImages = async (req, res) => {
  const { query, userId } = req.body;

  if (!query) return res.status(400).json({ message: 'Query is required' });

  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodedQuery}`;

    const response = await axios.get(url);
    const results = response.data.hits;

    if (userId) {
      await SearchHistory.create({ userId, query });
    }

    res.json(results);
  } catch (err) {
    console.error('Pixabay search error:', err.message);
    res.status(500).json({ message: 'Search failed' });
  }
};

module.exports = { searchImages };
