const { Groq } = require('groq-sdk');

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured.');
  }

  return new Groq({ apiKey });
}

async function callGroq(prompt, options = {}) {
  const groq = getGroqClient();

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: options.temperature ?? 0.2,
      max_tokens: options.maxOutputTokens ?? 2048,
      top_p: options.topP ?? 0.9,
    });

    const text = chatCompletion.choices[0]?.message?.content || '';
    return text.trim();
  } catch (error) {
    console.error('Groq API Error:', error?.message || error);
    throw error;
  }
}

const getCaloriesFromGemini = async (prompt) => {
  return callGroq(prompt, { maxOutputTokens: 512, temperature: 0.1 });
};

const getDietFromGemini = async (prompt) => {
  return callGroq(prompt, { maxOutputTokens: 3072, temperature: 0.5, topP: 0.95 });
};

module.exports = {
  getCaloriesFromGemini,
  getDietFromGemini,
};