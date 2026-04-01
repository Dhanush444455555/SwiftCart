import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';

dotenv.config();

const seedData = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/swiftcart');
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany();
        await Product.deleteMany();
        console.log('Cleared existing data');

        // Create admin user
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@swiftcart.com',
            password: 'admin123',
            role: 'admin',
        });
        console.log('✓ Admin user created');

        // Create sample customer user
        const customer = await User.create({
            name: 'John Doe',
            email: 'customer@swiftcart.com',
            password: 'customer123',
            role: 'user',
        });
        console.log('✓ Customer user created');

        // Create sample products
        const products = await Product.create([{
                name: 'Wireless Headphones',
                description: 'High-quality wireless headphones with noise cancellation',
                price: 4999,
                stock: 50,
                category: 'Electronics',
                image: 'https://via.placeholder.com/300?text=Headphones',
                discount: 10,
                createdBy: admin._id,
            },
            {
                name: 'Organic Tea Set',
                description: 'Premium organic tea collection',
                price: 1299,
                stock: 100,
                category: 'Groceries',
                image: 'https://via.placeholder.com/300?text=Tea',
                discount: 5,
                createdBy: admin._id,
            },
            {
                name: 'Cotton T-Shirt',
                description: 'Comfortable 100% cotton t-shirt',
                price: 599,
                stock: 200,
                category: 'Clothing',
                image: 'https://via.placeholder.com/300?text=TShirt',
                discount: 15,
                createdBy: admin._id,
            },
            {
                name: 'Programming Book',
                description: 'Learn Advanced JavaScript Programming',
                price: 899,
                stock: 30,
                category: 'Books',
                image: 'https://via.placeholder.com/300?text=Book',
                discount: 0,
                createdBy: admin._id,
            },
            {
                name: 'Desk Lamp',
                description: 'LED desk lamp with adjustable brightness',
                price: 1999,
                stock: 75,
                category: 'Home',
                image: 'https://via.placeholder.com/300?text=Lamp',
                discount: 20,
                createdBy: admin._id,
            },
            {
                name: 'Face Moisturizer',
                description: 'Natural face moisturizer cream',
                price: 799,
                stock: 120,
                category: 'Beauty',
                image: 'https://via.placeholder.com/300?text=Moisturizer',
                discount: 10,
                createdBy: admin._id,
            },
            {
                name: 'Basketball',
                description: 'Professional basketball ball',
                price: 1499,
                stock: 40,
                category: 'Sports',
                image: 'https://via.placeholder.com/300?text=Basketball',
                discount: 5,
                createdBy: admin._id,
            },
            {
                name: 'USB-C Cable',
                description: 'Fast charging USB-C cable 2 meters',
                price: 399,
                stock: 500,
                category: 'Electronics',
                image: 'https://via.placeholder.com/300?text=Cable',
                discount: 12,
                createdBy: admin._id,
            },
        ]);
        console.log(`✓ ${products.length} products created`);

        console.log('\n✅ Database seeded successfully!\n');
        console.log('Test Credentials:');
        console.log('Admin - Email: admin@swiftcart.com, Password: admin123');
        console.log('Customer - Email: customer@swiftcart.com, Password: customer123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedData();