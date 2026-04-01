import Product from '../models/Product.js';

export const getAllProducts = async(req, res, next) => {
    try {
        const { category, search } = req.query;
        let filter = {};

        if (category) {
            filter.category = category;
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const products = await Product.find(filter);
        res.json(products);
    } catch (error) {
        next(error);
    }
};

export const getProductById = async(req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        next(error);
    }
};

export const createProduct = async(req, res, next) => {
    try {
        const { name, description, price, stock, category, image, discount } = req.body;

        if (!name || !description || !price || stock === undefined) {
            return res.status(400).json({ error: 'Please provide required fields' });
        }

        const product = new Product({
            name,
            description,
            price,
            stock,
            category,
            image,
            discount,
            createdBy: req.userId,
        });

        await product.save();

        res.status(201).json({
            message: 'Product created successfully',
            product,
        });
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async(req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check authorization
        if (product.createdBy.toString() !== req.userId && req.userRole !== 'admin') {
            return res.status(403).json({ error: 'Not authorized' });
        }

        product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body, { new: true, runValidators: true }
        );

        res.json({
            message: 'Product updated successfully',
            product,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async(req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check authorization
        if (product.createdBy.toString() !== req.userId && req.userRole !== 'admin') {
            return res.status(403).json({ error: 'Not authorized' });
        }

        await Product.findByIdAndDelete(req.params.id);

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        next(error);
    }
};