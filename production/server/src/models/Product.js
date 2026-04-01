import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a product name'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please provide a product description'],
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
        min: 0,
    },
    stock: {
        type: Number,
        required: [true, 'Please provide stock quantity'],
        min: 0,
    },
    category: {
        type: String,
        enum: ['Electronics', 'Groceries', 'Clothing', 'Books', 'Home', 'Beauty', 'Sports', 'Other'],
        default: 'Other',
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/300',
    },
    qrCode: {
        type: String, // URL to QR code image
    },
    sku: {
        type: String,
        unique: true,
        sparse: true,
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

// Generate QR code URL (using product ID)
productSchema.pre('save', function(next) {
    if (!this.qrCode && this._id) {
        // Generate QR code using a service like qr-server.com
        this.qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${this._id}`;
    }
    if (!this.sku) {
        this.sku = `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    next();
});

export default mongoose.model('Product', productSchema);