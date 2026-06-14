const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const verifyToken = require('../middlewares/authMiddleware');

// POST /api/chats
router.post('/', verifyToken, chatController.createChat);

// POST /api/chats/:chatId/messages
router.post('/:chatId/messages', verifyToken, chatController.sendMessage);

module.exports = router;