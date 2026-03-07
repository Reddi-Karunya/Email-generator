const mongoose = require('mongoose');

const emailReplySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email_input: {
    type: String,
    required: true
  },
  generated_reply: {
    type: String,
    required: true
  },
  tone: {
    type: String,
    enum: ['professional', 'friendly', 'formal', 'apologetic', 'short'],
    default: 'professional'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('EmailReply', emailReplySchema);
