const express = require('express');
const router = express.Router();
const savedController = require('../controllers/savedController');
const verifyToken = require('../middlewares/authMiddleware');

router.get('/', verifyToken, savedController.getSavedArticles);
router.post('/:articleId', verifyToken, savedController.saveArticle);
router.delete('/:articleId', verifyToken, savedController.removeSavedArticle);

module.exports = router;