const OpenAI = require('openai');
const EmailReply = require('../models/EmailReply');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const TONE_DESCRIPTIONS = {
  professional: 'Professional and business-appropriate',
  friendly: 'Warm, friendly, and conversational',
  formal: 'Highly formal and structured',
  apologetic: 'Empathetic and apologetic',
  short: 'Brief, concise, and to the point (2-3 sentences max)'
};

// Generate Reply
exports.generateReply = async (req, res) => {
  try {
    const { emailText, tone } = req.body;

    if (!emailText || !tone) {
      return res.status(400).json({ message: 'Email text and tone are required' });
    }

    const toneDescription = TONE_DESCRIPTIONS[tone] || 'Professional';

    const prompt = `You are an expert email writer. Write a ${toneDescription} email reply to the following email.

Tone: ${toneDescription}

Original Email:
${emailText}

Requirements:
- Reply should be complete and ready to send
- Match the tone exactly: ${toneDescription}
- Be natural and authentic
- Do not include subject line, just the email body
- Start with an appropriate greeting
- End with an appropriate closing signature

Email Reply:`;

    const completion = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional email writer who creates excellent, contextually appropriate email replies.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const reply = completion.choices[0].message.content.trim();

    res.json({ reply });
  } catch (err) {
    console.error('Generate reply error:', err.message);
    if (err.code === 'insufficient_quota') {
      return res.status(429).json({ message: 'API quota exceeded. Please check your OpenAI plan.' });
    }
    res.status(500).json({ message: 'Failed to generate reply', error: err.message });
  }
};

// Save Reply
exports.saveReply = async (req, res) => {
  try {
    const { emailText, generatedReply, tone } = req.body;

    if (!emailText || !generatedReply || !tone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const emailReply = await EmailReply.create({
      user_id: req.user.id,
      email_input: emailText,
      generated_reply: generatedReply,
      tone
    });

    res.status(201).json({ message: 'Reply saved successfully', emailReply });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get History
exports.getHistory = async (req, res) => {
  try {
    const replies = await EmailReply.find({ user_id: req.user.id })
      .sort({ created_at: -1 })
      .limit(50);

    res.json({ replies });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete Reply
exports.deleteReply = async (req, res) => {
  try {
    const reply = await EmailReply.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user.id
    });

    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    res.json({ message: 'Reply deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
