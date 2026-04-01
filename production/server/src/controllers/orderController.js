import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const createOrder = async(req, res, next) => {
    try {
        const { items, deliveryAddress, notes } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Order must have at least one item' });
        }

        let totalAmount = 0;
        const populatedItems = [];

        // Calculate total and populate product details
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ error: `Product ${item.productId} not found` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({ error: `Product ${product.name} has insufficient stock` });
            }

            const itemPrice = product.price * (1 - (product.discount || 0) / 100);
            totalAmount += itemPrice * item.quantity;

            populatedItems.push({
                product: product._id,
                quantity: item.quantity,
                price: itemPrice,
            });

            // Reduce stock
            product.stock -= item.quantity;
            await product.save();
        }

        const order = new Order({
            user: req.userId,
            items: populatedItems,
            totalAmount,
            finalAmount: totalAmount,
            deliveryAddress,
            notes,
        });

        await order.save();

        res.status(201).json({
            message: 'Order created successfully',
            order,
        });
    } catch (error) {
        next(error);
    }
};

export const getOrderById = async(req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('user items.product');

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Check authorization
        if (order.user._id.toString() !== req.userId && req.userRole !== 'admin') {
            return res.status(403).json({ error: 'Not authorized' });
        }

        res.json(order);
    } catch (error) {
        next(error);
    }
};

export const getUserOrders = async(req, res, next) => {
    try {
        const orders = await Order.find({ user: req.userId }).populate('items.product');
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

export const getAllOrders = async(req, res, next) => {
    try {
        if (req.userRole !== 'admin') {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const orders = await Order.find().populate('user items.product');
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

export const updateOrderPayment = async(req, res, next) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, paymentStatus } = req.body;

        const order = await Order.findByIdAndUpdate(
            req.params.id, {
                razorpayOrderId,
                razorpayPaymentId,
                paymentStatus,
                orderStatus: paymentStatus === 'completed' ? 'confirmed' : 'pending',
            }, { new: true }
        );

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({
            message: 'Order payment updated successfully',
            order,
        });
    } catch (error) {
        next(error);
    }
};

export const cancelOrder = async(req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Check authorization
        if (order.user.toString() !== req.userId && req.userRole !== 'admin') {
            return res.status(403).json({ error: 'Not authorized' });
        }

        if (order.orderStatus === 'cancelled') {
            return res.status(400).json({ error: 'Order is already cancelled' });
        }

        // Restore stock
        for (const item of order.items) {
            const product = await Product.findById(item.product);
            product.stock += item.quantity;
            await product.save();
        }

        order.orderStatus = 'cancelled';
        await order.save();

        res.json({
            message: 'Order cancelled successfully',
            order,
        });
    } catch (error) {
        next(error);
    }
};