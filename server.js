require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();
const port = Number(process.env.PORT) || 3000;
const allowedTypes = new Set(['Email', 'Slack message', 'Text message']);
const allowedTones = new Set(['Warm', 'Professional', 'Casual', 'Apologetic']);
const allowedLengths = new Set(['Brief', 'Balanced', 'Detailed']);

app.disable('x-powered-by');
app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'same-origin',
    'Cache-Control': 'no-store'
  });
  next();
});
app.use(express.json({ limit: '20kb', type: 'application/json' }));

function validateDraftRequest(body) {
  if (!body || typeof body !== 'object') return 'A JSON request body is required.';
  const { prompt, messageType, tone, length } = body;
  if (typeof prompt !== 'string' || !prompt.trim()) return 'Please enter a rough instruction.';
  if (prompt.trim().length > 1200) return 'The instruction must be 1,200 characters or fewer.';
  if (!allowedTypes.has(messageType)) return 'Unsupported message type.';
  if (!allowedTones.has(tone)) return 'Unsupported tone.';
  if (!allowedLengths.has(length)) return 'Unsupported length.';
  return null;
}

function buildMessages({ prompt, messageType, tone, length }) {
  return [
    {
      role: 'system',
      content: `You are Draftly, a careful communications editor. Create a polished ${messageType} from the user's rough instruction. First silently assess clarity, tone, politeness, and completeness; then revise the draft once. Return valid JSON only, using exactly this schema: {"draft":"the final send-ready message","review":{"clarity":"short observation","tone":"short observation","completeness":"short observation"}}. Do not include markdown code fences. Requested tone: ${tone}. Requested length: ${length}.`
    },
    { role: 'user', content: prompt.trim() }
  ];
}

function parseGroqJson(content) {
  try {
    const parsed = JSON.parse(content);
    if (typeof parsed.draft !== 'string' || !parsed.draft.trim() || !parsed.review) throw new Error();
    const review = parsed.review;
    if (typeof review.clarity !== 'string' || typeof review.tone !== 'string' || typeof review.completeness !== 'string') throw new Error();
    return { draft: parsed.draft.trim(), review };
  } catch {
    return null;
  }
}

app.post('/api/draft', async (req, res) => {
  const request = { ...req.body, messageType: req.body?.messageType || req.body?.type };
  const validationError = validateDraftRequest(request);
  if (validationError) return res.status(400).json({ error: validationError });
  if (!process.env.GROQ_API_KEY) return res.status(503).json({ error: 'The server is not configured with a Groq API key.' });

  const maxTokens = request.length === 'Brief' ? 300 : request.length === 'Detailed' ? 850 : 520;
  try {
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
        temperature: 0.55,
        max_tokens: maxTokens,
        response_format: { type: 'json_object' },
        messages: buildMessages(request)
      })
    });
    const payload = await groqResponse.json().catch(() => ({}));
    if (!groqResponse.ok) {
      console.error('Groq request failed:', groqResponse.status, payload?.error?.message || 'Unknown error');
      return res.status(groqResponse.status === 401 ? 503 : 502).json({ error: 'Draft generation is temporarily unavailable. Please try again.' });
    }
    const result = parseGroqJson(payload?.choices?.[0]?.message?.content);
    if (!result) {
      console.error('Groq returned an invalid draft format.');
      return res.status(502).json({ error: 'The writing service returned an invalid response. Please try again.' });
    }
    return res.json(result);
  } catch (error) {
    console.error('Groq connection error:', error.message);
    return res.status(502).json({ error: 'Could not reach the writing service. Please try again.' });
  }
});

app.use(express.static(__dirname, { index: 'index.html', extensions: ['html'] }));
app.use((req, res) => res.status(404).json({ error: 'Not found.' }));

app.listen(port, () => console.log(`Draftly is running at http://localhost:${port}`));
