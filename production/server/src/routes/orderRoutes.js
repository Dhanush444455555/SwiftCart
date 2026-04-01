import express from 'express';
import {
    createOrder,
    getOrderById,
    getUserOrders,
    getAllOrders,
    updateOrderPayment,
    cancelOrder,
} from '../controllers/orderController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, createOrder);
router.get('/user', authenticate, getUserOrders);
router.get('/admin/all', authenticate, authorize(['admin']), getAllOrders);
router.get('/:id', authenticate, getOrderById);
router.patch('/:id/payment', authenticate, updateOrderPayment);
router.patch('/:id/cancel', authenticate, cancelOrder);

export default router;