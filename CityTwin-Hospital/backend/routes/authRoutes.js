const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getIsConnected, getMemoryStore } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'citytwin_hospital_secret';

// Hospital Login
router.post('/hospital/login', async (req, res) => {
  try {
    const { email, password, hospitalId } = req.body;
    const store = getMemoryStore();
    
    // Find hospital by email or hospitalId
    let hospital = store.hospitals.find(h => 
      h.email === email || h.hospitalId === hospitalId
    );

    if (!hospital) {
      return res.status(401).json({ success: false, message: 'Hospital not found' });
    }

    const isMatch = bcrypt.compareSync(password, hospital.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: hospital.hospitalId, role: 'hospital', name: hospital.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...hospitalData } = hospital;
    res.json({ success: true, token, hospital: hospitalData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Driver Login
router.post('/driver/login', async (req, res) => {
  try {
    const { driverId, password } = req.body;
    const store = getMemoryStore();
    
    const driver = store.drivers.find(d => d.driverId === driverId);
    if (!driver) {
      return res.status(401).json({ success: false, message: 'Driver not found' });
    }

    const isMatch = bcrypt.compareSync(password, driver.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: driver.driverId, role: 'driver', name: driver.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...driverData } = driver;
    res.json({ success: true, token, driver: driverData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Verify token / get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'No token' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const store = getMemoryStore();

    if (decoded.role === 'hospital') {
      const hospital = store.hospitals.find(h => h.hospitalId === decoded.id);
      if (hospital) {
        const { password: _, ...data } = hospital;
        return res.json({ success: true, role: 'hospital', user: data });
      }
    } else if (decoded.role === 'driver') {
      const driver = store.drivers.find(d => d.driverId === decoded.id);
      if (driver) {
        const { password: _, ...data } = driver;
        return res.json({ success: true, role: 'driver', user: data });
      }
    }

    res.status(404).json({ success: false, message: 'User not found' });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

module.exports = router;
