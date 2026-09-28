const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const { getIsConnected, getMemoryStore } = require('../config/db');

// Get All Issues with optional Category / Severity / Region filters
router.get('/', async (req, res) => {
  try {
    const { category, severity, status } = req.query;

    if (getIsConnected()) {
      let filter = {};
      if (category) filter.category = category;
      if (severity) filter.severity = severity;
      if (status) filter.status = status;

      const issues = await Issue.find(filter).sort({ createdAt: -1 });
      return res.json({ success: true, count: issues.length, data: issues });
    } else {
      const store = getMemoryStore();
      let filtered = [...store.issues];
      if (category) filtered = filtered.filter(i => i.category === category);
      if (severity) filtered = filtered.filter(i => i.severity === severity);
      if (status) filtered = filtered.filter(i => i.status === status);

      return res.json({ success: true, count: filtered.length, data: filtered });
    }
  } catch (error) {
    console.error('Fetch issues error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create New Issue Report (Citizen / Emergency)
router.post('/', async (req, res) => {
  try {
    const {
      title,
      category,
      severity = 'Medium',
      description,
      location,
      imageUrl,
      reporterName = 'Citizen Reporter'
    } = req.body;

    if (!category || !location || !location.coordinates) {
      return res.status(400).json({ success: false, message: 'Category and Location coordinates are required.' });
    }

    const defaultTitle = title || `${category} reported near ${location.address || 'Thane'}`;

    if (getIsConnected()) {
      const newIssue = await Issue.create({
        title: defaultTitle,
        category,
        severity,
        description,
        location,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=600&auto=format&fit=crop&q=80',
        reporterName,
        distanceKm: '0.4 km away',
        timeAgo: 'Just now',
        status: 'Pending'
      });
      return res.status(201).json({ success: true, data: newIssue });
    } else {
      const store = getMemoryStore();
      const newIssue = {
        id: 'iss_' + Date.now(),
        title: defaultTitle,
        category,
        severity,
        status: 'Pending',
        description: description || 'Issue submitted by citizen via CityTwin mobile portal.',
        location: {
          address: location.address || 'Detected Location, Thane West',
          regionName: location.regionName || 'Thane City (TMC)',
          coordinates: location.coordinates // [lng, lat]
        },
        distanceKm: '0.4 km away',
        timeAgo: 'Just now',
        reporterName,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=600&auto=format&fit=crop&q=80',
        likes: 1,
        createdAt: new Date().toISOString()
      };
      store.issues.unshift(newIssue);
      return res.status(201).json({ success: true, data: newIssue });
    }
  } catch (error) {
    console.error('Create issue error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Upvote / Like an Issue
router.patch('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    if (getIsConnected()) {
      const issue = await Issue.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true });
      return res.json({ success: true, data: issue });
    } else {
      const store = getMemoryStore();
      const issue = store.issues.find(i => i.id === id || i._id === id);
      if (issue) {
        issue.likes = (issue.likes || 0) + 1;
        return res.json({ success: true, data: issue });
      }
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
