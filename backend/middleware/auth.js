const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');


dotenv.config();

module.exports = function(req, res, next) {
  try {
    console.log('Auth middleware called');
    
    // Get token from header
    const authHeader = req.header('Authorization');
    console.log('Authorization header:', authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No proper Authorization header found');
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      console.log('No token found after splitting');
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    
    
    const JWT_SECRET = process.env.JWT_SECRET;
    console.log('Using JWT_SECRET:', JWT_SECRET ? 'Secret is set' : 'SECRET NOT FOUND!');
    
    
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token verified successfully, user ID:', decoded.user.id);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    console.error('Error message:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};