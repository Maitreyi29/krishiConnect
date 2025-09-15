const express = require('express');
const { ElevenLabsClient } = require('@elevenlabs/elevenlabs-js');
const router = express.Router();

const elevenlabs = new ElevenLabsClient({
  apiKey: "sk_663faaece7b17a7eb2d2331a2812291211f8b84073d4ab76",
});

router.post('/text-to-speech', async (req, res) => {
  const { text, language } = req.body;

  if (!text || !language) {
    return res.status(400).json({ success: false, message: 'Text and language are required' });
  }

  try {
    const voiceId = language === 'hindi' ? 'pNInz6obpgDQGcFmaJgB' : 'JBFqnCBsd6RMkjVDRZzb';

    const audio = await elevenlabs.textToSpeech.convert(voiceId, {
      text: text,
      modelId: 'eleven_multilingual_v2',
      outputFormat: 'mp3_44100_128',
    });

    res.setHeader('Content-Type', 'audio/mpeg');
    audio.pipe(res);

  } catch (error) {
    console.error('ElevenLabs API error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate audio' });
  }
});

module.exports = router;
