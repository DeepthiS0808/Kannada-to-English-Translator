const express = require('express');
const cors = require('cors');
const translate = require('google-translate-api-x');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/api/translate', async (req, res) => {
  try {
    const { text, sourcePath = 'kn', targetPath = 'en' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const response = await translate(text, { from: sourcePath, to: targetPath });
    
    res.json({ translatedText: response.text });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
