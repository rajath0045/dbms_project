const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

router.get('/dashboard-stats', [verifyToken, isAdmin], adminController.getDashboardStats);
router.get('/users', [verifyToken, isAdmin], adminController.getAllUsers);
router.delete('/users/:id', [verifyToken, isAdmin], adminController.deleteUser);
router.get('/orders', [verifyToken, isAdmin], adminController.getAllOrders);
router.get('/suppliers', [verifyToken, isAdmin], adminController.getAllSuppliers);
router.delete('/suppliers/:id', [verifyToken, isAdmin], adminController.deleteSupplier);
router.get('/raw-materials', [verifyToken, isAdmin], adminController.getAllRawMaterials);

module.exports = router; 