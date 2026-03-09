const { GoogleGenerativeAI } = require('@google/generative-ai');
const EmailReply = require('../models/EmailReply');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY);

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

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reply = response.text().trim();

    res.json({ reply });
  } catch (err) {
    console.error('Generate reply error:', err.message);
    if (err.message.includes('API key not valid') || err.message.includes('API_KEY_INVALID')) {
      return res.status(401).json({ message: 'Invalid API key. Please check your Gemini API key in .env' });
    }
    if (err.message.includes('quota') || err.status === 429) {
      return res.status(429).json({ message: 'API quota exceeded. Please check your Gemini plan.' });
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
