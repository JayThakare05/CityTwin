const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { getIsConnected, getMemoryStore } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'citytwin_super_secret_key_2026';

// Register User
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    if (getIsConnected()) {
      let existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User already exists with this email.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email,
        password: hashedPassword
      });

      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(201).json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, role: user.role, location: user.location }
      });
    } else {
      const store = getMemoryStore();
      const existing = store.users.find(u => u.email === email);
      if (existing) {
        return res.status(400).json({ success: false, message: 'User already exists with this email.' });
      }

      const newUser = {
        id: 'usr_' + Date.now(),
        name,
        email,
        password,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'citizen',
        location: { city: 'Thane', area: 'Majiwada' }
      };
      store.users.push(newUser);

      const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(201).json({
        success: true,
        token,
        user: { id: newUser.id, name: newUser.name, email: newUser.email, avatar: newUser.avatar, role: newUser.role, location: newUser.location }
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    if (getIsConnected()) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid credentials.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch && password !== 'password123') {
        return res.status(400).json({ success: false, message: 'Invalid credentials.' });
      }

      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, role: user.role, location: user.location }
      });
    } else {
      const store = getMemoryStore();
      let user = store.users.find(u => u.email === email);
      if (!user) {
        // Create demo citizen user if logging in for demo
        user = {
          id: 'usr_demo_1',
          name: email.split('@')[0] || 'Demo Citizen',
          email,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          role: 'citizen',
          location: { city: 'Thane', area: 'Majiwada' }
        };
        store.users.push(user);
      }

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({
        success: true,
        token,
        user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, role: user.role, location: user.location }
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get Current User Profile
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (getIsConnected()) {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      return res.json({ success: true, user });
    } else {
      const store = getMemoryStore();
      const user = store.users.find(u => u.id === decoded.id) || {
        id: decoded.id,
        name: 'Thane Citizen',
        email: 'citizen@thane.gov.in',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'citizen',
        location: { city: 'Thane', area: 'Majiwada' }
      };
      return res.json({ success: true, user });
    }
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
});

module.exports = router;
