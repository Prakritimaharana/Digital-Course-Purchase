const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to create JWT token
const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });
};

// Signup controller
exports.signup = async (req, res) => {
  const { fullName, username, email, password, age } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ 
        error: existingUser.email === email 
          ? 'Email already in use' 
          : 'Username already taken'
      });
    }

    // Create new user
    const user = await User.create({ fullName, username, email, password, age });
    
    // Generate token
    const token = createToken(user._id);
    
    res.status(201).json({ 
      message: 'User created successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        age: user.age
      },
      token 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = createToken(user._id);
    
    res.status(200).json({ 
      message: 'Login successful',
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        age: user.age
      },
      token 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};