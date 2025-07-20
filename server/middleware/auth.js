const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate JWT tokens
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided. Authorization denied.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user and check if token exists in their tokens array (if you're implementing token invalidation)
    const user = await User.findOne({ _id: decoded.userId });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token. User not found.' });
    }

    // Attach user and token to request object
    req.userId = user._id;
    req.token = token;
    next();
  } catch (err) {
    console.error('Authentication error:', err.message);
    
    let errorMessage = 'Token is not valid';
    if (err.name === 'TokenExpiredError') {
      errorMessage = 'Token has expired';
    } else if (err.name === 'JsonWebTokenError') {
      errorMessage = 'Invalid token';
    }
    
    res.status(401).json({ error: errorMessage });
  }
};

// Optional: Middleware to check if user has admin role
const adminAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    next();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Optional: Middleware to check course ownership/access
const courseAccess = async (req, res, next) => {
  try {
    const courseId = req.params.courseId || req.body.courseId;
    const userId = req.userId;

    // Here you would check if user has access to the course
    // This could be checking a purchases collection or course enrollment
    // For now we'll just let it pass as the actual check is done in the controller
    next();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  auth,
  adminAuth,
  courseAccess
};