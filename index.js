const express = require('express');
const fetch = require('isomorphic-fetch');
require('dotenv').config();

const app = express();
const port = 4000;

const geniusApiUrl = 'https://api.genius.com';
const fetchHeaders = {
  headers: {
    Authorization: `Bearer ${process.env.GENIUS_API_TOKEN}`,
  },
};

app.get('/', (req, res) => res.send('Welcome to the Drug Mentions API!'));

app.get('/search', async (req, res) => {
  const { q } = req.query;

  try {
    const response = await fetch(`${geniusApiUrl}/search?q=${q}`, fetchHeaders);
    const searchResults = await response.json();

    res.json(searchResults);
  } catch (error) {
    throw new Error(error);
  }
});

app.listen(port, () => console.log(`App listening on port ${port}`));
