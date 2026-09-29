const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {
  supabaseAdmin,
  syncUserToPublicTable,
  ensureDefaultCitizenUser
} = require('../config/supabase');

const JWT_SECRET = process.env.JWT_SECRET || 'citytwin_super_secret_jwt_key_2026_prod';

// Register User via Supabase Auth & Sync to public.users
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
    const defaultLocation = { city: 'Thane', area: 'Majiwada' };

    // Check if user already exists in Supabase
    const { data: existingList } = await supabaseAdmin.auth.admin.listUsers();
    const existing = existingList?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: 'User already exists with this email in Supabase.' });
    }

    // Create user in Supabase Auth
    const { data: createData, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        phone: phone || '',
        avatar: defaultAvatar,
        role: 'citizen',
        location: defaultLocation
      }
    });

    if (createErr) {
      console.error('[CityTwin Auth] Supabase register error:', createErr);
      return res.status(400).json({ success: false, message: createErr.message });
    }

    const newUser = createData.user;

    // Sync to public.users table if it exists
    await syncUserToPublicTable(newUser);

    // Sign in to get session token
    const { data: signInData, error: signInErr } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password
    });

    const token = signInData?.session?.access_token || jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        name: newUser.user_metadata?.name || name,
        email: newUser.email,
        avatar: newUser.user_metadata?.avatar || defaultAvatar,
        role: newUser.user_metadata?.role || 'citizen',
        location: newUser.user_metadata?.location || defaultLocation
      }
    });
  } catch (error) {
    console.error('[CityTwin Auth] Register exception:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Login User via Supabase Auth
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    // Attempt Supabase Auth login
    const { data: signInData, error: signInErr } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password
    });

    if (signInData?.user && signInData?.session) {
      const user = signInData.user;
      await syncUserToPublicTable(user);

      return res.json({
        success: true,
        token: signInData.session.access_token,
        user: {
          id: user.id,
          name: user.user_metadata?.name || email.split('@')[0],
          email: user.email,
          avatar: user.user_metadata?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          role: user.user_metadata?.role || 'citizen',
          location: user.user_metadata?.location || { city: 'Thane', area: 'Majiwada' }
        }
      });
    }

    // If password is demo password 'password123', look up user or create demo citizen
    if (password === 'password123' || password === 'Password123!') {
      const { data: usersList } = await supabaseAdmin.auth.admin.listUsers();
      let user = usersList?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase());

      if (!user) {
        const { data: created } = await supabaseAdmin.auth.admin.createUser({
          email,
          password: 'password123',
          email_confirm: true,
          user_metadata: {
            name: email.split('@')[0] || 'Thane Citizen',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            role: 'citizen',
            location: { city: 'Thane', area: 'Majiwada' }
          }
        });
        user = created?.user;
      }

      if (user) {
        await syncUserToPublicTable(user);
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
        return res.json({
          success: true,
          token,
          user: {
            id: user.id,
            name: user.user_metadata?.name || email.split('@')[0],
            email: user.email,
            avatar: user.user_metadata?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            role: user.user_metadata?.role || 'citizen',
            location: user.user_metadata?.location || { city: 'Thane', area: 'Majiwada' }
          }
        });
      }
    }

    return res.status(400).json({
      success: false,
      message: signInErr?.message || 'Invalid email or password.'
    });
  } catch (error) {
    console.error('[CityTwin Auth] Login exception:', error);
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

    // Try Supabase Auth token verification first
    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);
    if (!userErr && userData?.user) {
      const user = userData.user;
      return res.json({
        success: true,
        user: {
          id: user.id,
          name: user.user_metadata?.name || user.email?.split('@')[0],
          email: user.email,
          avatar: user.user_metadata?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          role: user.user_metadata?.role || 'citizen',
          location: user.user_metadata?.location || { city: 'Thane', area: 'Majiwada' }
        }
      });
    }

    // Fallback: verify custom JWT
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const { data: userResp } = await supabaseAdmin.auth.admin.getUserById(decoded.id);
      if (userResp?.user) {
        const u = userResp.user;
        return res.json({
          success: true,
          user: {
            id: u.id,
            name: u.user_metadata?.name || u.email?.split('@')[0],
            email: u.email,
            avatar: u.user_metadata?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            role: u.user_metadata?.role || 'citizen',
            location: u.user_metadata?.location || { city: 'Thane', area: 'Majiwada' }
          }
        });
      }
    } catch {
      // Token invalid
    }

    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
});

// List All Registered Users (Supabase Auth / Public table)
router.get('/users', async (req, res) => {
  try {
    const { data: authList, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) throw error;

    const users = (authList?.users || []).map(u => ({
      id: u.id,
      email: u.email,
      name: u.user_metadata?.name || u.email?.split('@')[0],
      role: u.user_metadata?.role || 'citizen',
      createdAt: u.created_at
    }));

    return res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
