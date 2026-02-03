/**
 * List Objectives for a given module (mapped to a department) for the authenticated user's organization.
 * Auth via Supabase JWT. Does not create departments; if absent, returns empty list.
 *
 * Query params:
 *   moduleKey: 'production'|'project'|'finance'|'sales'|'supply_chain'|'hr'|'it' (required)
 *   year?: number
 *   quarter?: 1|2|3|4
 *   status?: 'not_started'|'in_progress'|'at_risk'|'completed'|'archived'
 *   limit?: number (default 50, max 200)
 *   offset?: number (default 0)
 */
import { createClient } from '@supabase/supabase-js';

const MODULE_TO_DEPARTMENT = {
  production: 'Production',
  project: 'Projects',
  finance: 'Finance',
  sales: 'Sales',
  supply_chain: 'Supply Chain',
  hr: 'Human Resources',
  it: 'IT',
};

const VALID_STATUS = new Set(['not_started','in_progress','at_risk','completed','archived']);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { moduleKey, year, quarter, status, limit = '50', offset = '0' } = req.query || {};
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200);
  const parsedOffset = Math.max(parseInt(offset, 10) || 0, 0);

  if (!moduleKey || !MODULE_TO_DEPARTMENT[moduleKey]) {
    return res.status(400).json({ error: 'Invalid or missing moduleKey' });
  }

  const authHeader = req.headers['authorization'] || '';
  const bearerPrefix = 'Bearer ';
  const token = authHeader.startsWith(bearerPrefix) ? authHeader.slice(bearerPrefix.length) : null;
  if (!token) {
    return res.status(401).json({ error: 'Missing Authorization Bearer token' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'Server not configured for Supabase' });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    // Validate JWT and resolve app user
    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData?.user?.email) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    const authEmail = userData.user.email;

    const { data: appUser, error: appUserErr } = await supabase
      .from('users')
      .select('id, role, organization_id')
      .eq('email', authEmail)
      .single();
    if (appUserErr || !appUser) {
      return res.status(403).json({ error: 'No app user found for token' });
    }
    if (!['admin','manager','contributor'].includes(appUser.role)) {
      return res.status(403).json({ error: 'Forbidden: insufficient role' });
    }

    const orgId = appUser.organization_id;
    if (!orgId) {
      return res.status(400).json({ error: 'User not associated with an organization' });
    }

    // Resolve quarter id if provided
    let quarterId = null;
    const yearInt = year ? parseInt(year, 10) : null;
    const quarterInt = quarter ? parseInt(quarter, 10) : null;
    if (yearInt && quarterInt) {
      const { data: quarterRow } = await supabase
        .from('quarters')
        .select('id')
        .eq('year', yearInt)
        .eq('quarter', quarterInt)
        .maybeSingle();
      quarterId = quarterRow?.id || null;
      if (!quarterId) {
        return res.status(200).json({ count: 0, data: [] });
      }
    }

    // Locate department by module
    const deptName = MODULE_TO_DEPARTMENT[moduleKey];
    const { data: deptRow } = await supabase
      .from('departments')
      .select('id')
      .eq('organization_id', orgId)
      .eq('name', deptName)
      .maybeSingle();
    const departmentId = deptRow?.id || null;
    if (!departmentId) {
      // No department found; return empty list
      return res.status(200).json({ count: 0, data: [] });
    }

    // Build query
    let query = supabase
      .from('objectives')
      .select('id, title, description, status, priority, progress, owner_id, department_id, quarter_id, created_at, updated_at')
      .eq('organization_id', orgId)
      .eq('department_id', departmentId)
      .order('updated_at', { ascending: false })
      .range(parsedOffset, parsedOffset + parsedLimit - 1);

    if (quarterId) query = query.eq('quarter_id', quarterId);
    if (status && VALID_STATUS.has(String(status))) query = query.eq('status', String(status));

    const { data, error } = await query;
    if (error) throw error;

    return res.status(200).json({ count: data?.length || 0, data: data || [] });
  } catch (error) {
    console.error('objectivesByModule error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}