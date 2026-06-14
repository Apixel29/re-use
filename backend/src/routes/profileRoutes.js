const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const verifyToken = require('../middlewares/authMiddleware');

// Obtener perfil actual
router.get('/', verifyToken, profileController.getProfile);

// Actualizar datos básicos
router.put('/', verifyToken, profileController.updateProfile);

// Actualizar contraseña
router.put('/password', verifyToken, profileController.updatePassword);

module.exports = router;