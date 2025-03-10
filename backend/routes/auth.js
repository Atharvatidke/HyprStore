const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    
    // Create new user
    user = new User({
      name,
      email,
      password
    });
    
    await user.save();
    
    // Create and return JWT token
    const payload = {
      user: {
        id: user.id
      }
    };
    
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.cookie('token', token, { httpOnly: true }).json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    // Validate password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    // Create and return JWT token
    const payload = {
      user: {
        id: user.id
      }
    };
    
    jwt.sign(
      payload, 
      process.env.JWT_SECRET,  
      { expiresIn: '24h' },  
      (err, token) => {
        if (err) throw err;
        
        res.cookie('token', token, { 
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, 
          path: '/'
        }).json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          }
        });
      }
    );
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get user data
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token').json({ msg: 'Logged out successfully' });
});

// Add this to your server.js or auth.js routes
router.get('/test', auth, (req, res) => {
  res.json({ msg: 'Authentication successful', userId: req.user.id });
});

// Add this route to your auth.js file
router.get('/verify', auth, (req, res) => {
  try {
    res.json({ 
      success: true, 
      userId: req.user.id,
      message: 'Token verified successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;