import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    price: {
        type: Number,
        required: true,
    },
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
    },
    finalAmount: {
        type: Number,
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending',
    },
    paymentMethod: {
        type: String,
        enum: ['razorpay', 'upi', 'card', 'wallet'],
        default: 'razorpay',
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    orderStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'completed', 'cancelled'],
        default: 'pending',
    },
    deliveryAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        phone: String,
    },
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    completedAt: Date,
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);