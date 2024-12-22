const express = require('express');
const router = express.Router();
const rawMaterialController = require('../controllers/rawMaterial.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/', verifyToken, rawMaterialController.createMaterial);
router.get('/', verifyToken, rawMaterialController.getMaterialsBySupplier);
router.get('/stats', verifyToken, rawMaterialController.getMaterialStats);

module.exports = router; 