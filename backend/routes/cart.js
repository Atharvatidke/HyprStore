const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const MAX_QUANTITY_PER_ITEM = 10;

// Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    
    if (!cart) {
      cart = new Cart({ user: req.user.id });
      await cart.save();
    }
    
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Add item to cart
router.post('/add', auth, async (req, res) => {
  try {
    console.log('POST /api/cart/add received');
    console.log('User:', req.user);
    console.log('Request body:', req.body);
    
    const { productId, quantity = 1 } = req.body;
    
    // Validate inputs
    if (!productId) {
      console.log('Missing productId');
      return res.status(400).json({ msg: 'Product ID is required' });
    }
    
    console.log('Looking for product:', productId);
    // Find product
    const product = await Product.findById(productId);
    if (!product) {
      console.log('Product not found');
      return res.status(404).json({ msg: 'Product not found' });
    }
    console.log('Product found:', product.name);
    
    // Find or create cart
    console.log('Looking for cart for user:', req.user.id);
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      console.log('Cart not found, creating new cart');
      cart = new Cart({ user: req.user.id });
    } else {
      console.log('Cart found');
    }
    
    // Check if item already exists in cart
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    
    if (itemIndex === -1) {
      // Add new item to cart
      cart.items.push({
        product: productId,
        quantity: parseInt(quantity),
        price: product.price
      });
    } else {
      // Update existing item quantity
      if (cart.items[itemIndex].quantity + parseInt(quantity) > MAX_QUANTITY_PER_ITEM) {
        return res.status(400).json({ 
          msg: `Cannot add more than ${MAX_QUANTITY_PER_ITEM} of the same item` 
        });
      }
      cart.items[itemIndex].quantity += parseInt(quantity);
    }
    
    // Calculate total price
    cart.totalPrice = cart.items.reduce((total, item) => 
      total + (item.quantity * item.price), 0);
    
    await cart.save();
    // After saving the cart
    cart = await Cart.findOne({ user: req.user.id }).populate({
      path: 'items.product',
      select: 'name image price'
    });
    console.log('Cart saved successfully');
    res.json({
      msg: `Added ${quantity} item(s) to cart`,
      cart
    });
  } catch (err) {
    console.error('Error in /add route:', err);
    res.status(500).json({ msg: `Server error: ${err.message}` });
  }
});

// Remove item from cart
router.post('/remove', auth, async (req, res) => {
  try {
    const { productId } = req.body;
    
    // Find cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }
    
    // Find item index
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ msg: 'Item not found in cart' });
    }
    
    // Remove item from cart
    cart.items.splice(itemIndex, 1);
    
    // Recalculate total price
    cart.totalPrice = cart.items.reduce((total, item) => total + (item.quantity * item.price), 0);
    
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Clear cart
router.post('/clear', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }
    
    cart.items = [];
    cart.totalPrice = 0;
    
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

