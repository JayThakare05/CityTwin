const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {
  supabaseAdmin,
  ensureDefaultCitizenUser,
  parseWkbPoint,
  formatPointWkt,
  uploadReportImage,
  verifyReport
} = require('../config/supabase');

const JWT_SECRET = process.env.JWT_SECRET || 'citytwin_super_secret_jwt_key_2026_prod';

// In-memory like counters for citizen upvotes
const reportLikes = new Map();

// Helper to format time ago
const formatTimeAgo = (dateStr) => {
  if (!dateStr) return 'Just now';
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

// Helper to format severity for display
const formatSeverity = (sev) => {
  if (!sev) return 'Medium';
  const lower = sev.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

// Get All Issue Categories from Supabase public.report_categories
router.get('/categories', async (req, res) => {
  try {
    const { data: categories, error } = await supabaseAdmin
      .from('report_categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return res.json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    console.error('[CityTwin] Fetch categories error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Get All Issues / Reports from Supabase public.reports
router.get('/', async (req, res) => {
  try {
    const { category, severity, status, user_id } = req.query;

    let query = supabaseAdmin
      .from('reports')
      .select(`
        *,
        report_categories ( id, name, description ),
        report_media ( id, storage_path, media_type ),
        report_verifications ( id, model_name, status, confidence, reason, verified_at )
      `)
      .order('created_at', { ascending: false });

    if (user_id) {
      query = query.eq('user_id', user_id);
    }
    if (status) {
      query = query.eq('status', status.toLowerCase());
    }
    if (severity) {
      query = query.eq('severity', severity.toLowerCase());
    }

    const { data: reports, error } = await query;
    if (error) throw error;

    // Filter by category name if provided
    let filteredReports = reports || [];
    if (category) {
      filteredReports = filteredReports.filter(r => 
        r.report_categories?.name?.toLowerCase() === category.toLowerCase()
      );
    }

    // Transform reports to match frontend format
    const transformed = await Promise.all(filteredReports.map(async (rep) => {
      // Decode coordinates
      let coords = [72.9781, 19.2183]; // Default Thane
      if (rep.location) {
        const parsed = parseWkbPoint(rep.location);
        if (parsed) coords = parsed;
      }

      // Resolve image URL
      let imageUrl = 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=600&auto=format&fit=crop&q=80';
      if (rep.report_media && rep.report_media.length > 0) {
        const media = rep.report_media[0];
        if (media.storage_path) {
          const { data: signedData } = await supabaseAdmin.storage
            .from('report-images')
            .createSignedUrl(media.storage_path, 60 * 60 * 24); // 24 hours

          if (signedData?.signedUrl) {
            imageUrl = signedData.signedUrl;
          } else {
            const { data: publicData } = supabaseAdmin.storage
              .from('report-images')
              .getPublicUrl(media.storage_path);
            if (publicData?.publicUrl) imageUrl = publicData.publicUrl;
          }
        }
      }

      const likesCount = reportLikes.get(rep.id) || 1;

      return {
        id: rep.id,
        _id: rep.id,
        user_id: rep.user_id,
        userId: rep.user_id,
        title: rep.title,
        category: rep.report_categories?.name || 'Other',
        category_id: rep.category_id,
        severity: formatSeverity(rep.severity),
        rawSeverity: rep.severity,
        status: rep.status,
        description: rep.description,
        location: {
          address: `Reported location in Thane (${coords[1].toFixed(4)}, ${coords[0].toFixed(4)})`,
          regionName: 'Thane City (TMC)',
          coordinates: coords // [lng, lat]
        },
        distanceKm: 'Nearby',
        timeAgo: formatTimeAgo(rep.created_at),
        reporterName: 'Citizen Reporter',
        imageUrl,
        likes: likesCount,
        verification: rep.report_verifications?.[0] || null,
        createdAt: rep.created_at,
        updatedAt: rep.updated_at
      };
    }));

    return res.json({ success: true, count: transformed.length, data: transformed });
  } catch (error) {
    console.error('[CityTwin] Fetch issues error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Create New Issue Report (Citizen / Emergency)
// Follows exact database flow:
// Citizen report → public.reports (pending)
//              → report-images bucket (optional photo)
//              → public.report_media (photo path)
//              → Groq verification → public.report_verifications
//              → reports.status = verified / needs_review / rejected
//              → verified report appears in admin dashboard
router.post('/', async (req, res) => {
  try {
    const {
      title,
      category,
      category_id,
      severity = 'medium',
      description,
      location,
      imageUrl,
      image,
      reporterName = 'Citizen Reporter',
      user_id: explicitUserId
    } = req.body;

    // 1. Resolve User ID (Must be valid Supabase Auth UUID due to reports_user_id_fkey)
    let userId = explicitUserId;

    if (!userId) {
      // Check Bearer token
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
          // Check Supabase Auth token
          const { data: { user: authUser } } = await supabaseAdmin.auth.getUser(token);
          if (authUser?.id) {
            userId = authUser.id;
          } else {
            // Check fallback custom JWT
            const decoded = jwt.verify(token, JWT_SECRET);
            if (decoded?.id && decoded.id.length === 36) {
              userId = decoded.id;
            }
          }
        } catch {
          // Ignore token error and fallback
        }
      }
    }

    if (!userId) {
      // Fallback to default citizen user
      userId = await ensureDefaultCitizenUser();
    }

    // 2. Resolve Category ID from public.report_categories
    const { data: allCategories, error: catFetchErr } = await supabaseAdmin
      .from('report_categories')
      .select('id, name');

    if (catFetchErr) throw catFetchErr;

    let targetCategoryId = category_id;
    let resolvedCategoryName = 'Other';

    if (targetCategoryId) {
      const match = allCategories.find(c => c.id === targetCategoryId);
      if (match) resolvedCategoryName = match.name;
    }

    if (!targetCategoryId && category) {
      // Search matching category
      const searchCat = category.toLowerCase();
      let matched = allCategories.find(c => c.name.toLowerCase() === searchCat);

      if (!matched) {
        if (searchCat.includes('accident')) {
          matched = allCategories.find(c => c.name.toLowerCase().includes('accident'));
        } else if (searchCat.includes('water') || searchCat.includes('flood')) {
          matched = allCategories.find(c => c.name.toLowerCase().includes('waterlogging'));
        } else if (searchCat.includes('garbage') || searchCat.includes('waste')) {
          matched = allCategories.find(c => c.name.toLowerCase().includes('garbage'));
        } else if (searchCat.includes('pandemic') || searchCat.includes('disease')) {
          matched = allCategories.find(c => c.name.toLowerCase().includes('pandemic'));
        } else if (searchCat.includes('pollut') || searchCat.includes('air')) {
          matched = allCategories.find(c => c.name.toLowerCase().includes('pollution'));
        } else if (searchCat.includes('traffic')) {
          matched = allCategories.find(c => c.name.toLowerCase().includes('traffic'));
        } else if (searchCat.includes('hospital')) {
          matched = allCategories.find(c => c.name.toLowerCase().includes('hospital'));
        }
      }

      if (matched) {
        targetCategoryId = matched.id;
        resolvedCategoryName = matched.name;
      } else {
        const otherCat = allCategories.find(c => c.name.toLowerCase() === 'other');
        targetCategoryId = otherCat?.id || allCategories[0].id;
        resolvedCategoryName = otherCat?.name || allCategories[0].name;
      }
    }

    if (!targetCategoryId) {
      targetCategoryId = allCategories[0].id;
      resolvedCategoryName = allCategories[0].name;
    }

    // 3. Resolve Location coordinates [lng, lat]
    let lng = 72.9781;
    let lat = 19.2183;
    let addressText = 'Thane West';

    if (location) {
      if (Array.isArray(location.coordinates) && location.coordinates.length >= 2) {
        lng = Number(location.coordinates[0]);
        lat = Number(location.coordinates[1]);
      } else if (location.lat && location.lng) {
        lat = Number(location.lat);
        lng = Number(location.lng);
      } else if (location.latitude && location.longitude) {
        lat = Number(location.latitude);
        lng = Number(location.longitude);
      }
      if (location.address) addressText = location.address;
    }

    const locationWkt = formatPointWkt(lng, lat);

    // 4. Resolve Severity (low, medium, high, critical)
    const validSeverities = ['low', 'medium', 'high', 'critical'];
    const normalizedSeverity = validSeverities.includes(severity.toLowerCase())
      ? severity.toLowerCase()
      : 'medium';

    const defaultTitle = title || `${resolvedCategoryName} reported near ${addressText}`;
    const reportDesc = description || `Civic issue reported by citizen in ${addressText}.`;

    // 5. Insert Report into public.reports (status = 'pending')
    const { data: newReport, error: insertErr } = await supabaseAdmin
      .from('reports')
      .insert({
        user_id: userId,
        category_id: targetCategoryId,
        title: defaultTitle,
        description: reportDesc,
        location: locationWkt,
        severity: normalizedSeverity,
        status: 'pending'
      })
      .select(`
        *,
        report_categories ( id, name, description )
      `)
      .single();

    if (insertErr) {
      console.error('[CityTwin] Insert report error:', insertErr);
      return res.status(500).json({ success: false, message: insertErr.message });
    }

    // 6. Handle Image Upload to 'report-images' bucket & insert public.report_media
    let uploadedMedia = null;
    const imagePayload = image || imageUrl;
    if (imagePayload) {
      uploadedMedia = await uploadReportImage(newReport.id, imagePayload, `${resolvedCategoryName.toLowerCase()}.jpg`);
    }

    // 7. Run Groq Verification Pipeline
    const verificationOutput = await verifyReport(
      newReport,
      resolvedCategoryName,
      uploadedMedia?.url || imageUrl
    );

    // 8. Prepare final returned object
    const finalStatus = verificationOutput?.finalStatus || 'verified';
    const responseData = {
      id: newReport.id,
      _id: newReport.id,
      title: newReport.title,
      category: resolvedCategoryName,
      category_id: targetCategoryId,
      severity: formatSeverity(newReport.severity),
      rawSeverity: newReport.severity,
      status: finalStatus,
      user_id: newReport.user_id,
      userId: newReport.user_id,
      description: newReport.description,
      location: {
        address: addressText,
        regionName: 'Thane City (TMC)',
        coordinates: [lng, lat]
      },
      distanceKm: '0.2 km away',
      timeAgo: 'Just now',
      reporterName,
      imageUrl: uploadedMedia?.url || imageUrl || 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=600&auto=format&fit=crop&q=80',
      likes: 1,
      verification: verificationOutput?.verification || null,
      createdAt: newReport.created_at,
      updatedAt: new Date().toISOString()
    };

    reportLikes.set(newReport.id, 1);

    return res.status(201).json({
      success: true,
      message: 'Report submitted and verified successfully.',
      data: responseData
    });
  } catch (error) {
    console.error('[CityTwin] Create issue error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Upvote / Like an Issue
router.patch('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const currentLikes = (reportLikes.get(id) || 1) + 1;
    reportLikes.set(id, currentLikes);

    return res.json({
      success: true,
      data: { id, likes: currentLikes }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
