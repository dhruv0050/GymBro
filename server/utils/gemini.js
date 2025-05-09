const axios = require('axios');

async function getCaloriesFromGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  };

  const response = await axios.post(url, body, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response.data.candidates[0].content.parts[0].text.trim();
}

module.exports = { getCaloriesFromGemini };

async function getMacrosFromGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  };

  const response = await axios.post(url, body, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response.data.candidates[0].content.parts[0].text.trim();
}

module.exports = { getMacrosFromGemini };