const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');

// Get logged in user orders - THIS NEEDS TO BE FIRST
router.get('/myorders', protect, async (req, res) => {
    try {
        console.log('Fetching orders for user:', req.user._id);
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 });
        console.log('Found orders:', orders.length);
        res.json(orders);
    } catch (error) {
        console.error('Error in /myorders:', error);
        res.status(500).json({ message: error.message });
    }
});

// Create new order
router.post('/', protect, async (req, res) => {
    try {
        console.log('Creating order for user:', req.user._id);
        console.log('Order data:', req.body);
        
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice
        } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || 
            !shippingAddress.postalCode || !shippingAddress.country) {
            return res.status(400).json({ message: 'Shipping address is required' });
        }

        // Validate orderItems structure
        const validOrderItems = orderItems.every(item => 
            item.product && item.title && item.quantity && 
            item.imageUrl && typeof item.price === 'number'
        );

        if (!validOrderItems) {
            return res.status(400).json({ message: 'Invalid order items structure' });
        }

        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice: Number(itemsPrice),
            shippingPrice: Number(shippingPrice),
            totalPrice: Number(totalPrice)
        });

        const createdOrder = await order.save();
        console.log('Order created successfully:', createdOrder._id);
        res.status(201).json(createdOrder);
    } catch (error) {
        console.error('Error in order creation:', error);
        res.status(500).json({ 
            message: 'Error creating order',
            error: error.message 
        });
    }
});

// Get order by ID
router.get('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update order to paid
router.put('/:id/pay', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address
        };

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;