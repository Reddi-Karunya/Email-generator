const express = require('express');
const router = express.Router();
const {
  generateReply,
  saveReply,
  getHistory,
  deleteReply
} = require('../controllers/emailController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.post('/generate-reply', protect, generateReply);
router.post('/save-reply', protect, saveReply);
router.get('/history', protect, getHistory);
router.delete('/history/:id', protect, deleteReply);

module.exports = router;
