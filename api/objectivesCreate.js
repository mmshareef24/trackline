/**
 * Create an Objective for a given module (mapped to a department).
 * Authenticated via Supabase JWT; resolves app user and organization.
 * If the department for the module does not exist, it will be created.
 *
 * POST body: {
 *   title: string,
 *   description?: string,
 *   status?: 'not_started'|'in_progress'|'at_risk'|'completed'|'archived',
 *   priority?: 'low'|'medium'|'high',
 *   year?: number,
 *   quarter?: 1|2|3|4,
 *   moduleKey: 'production'|'project'|'finance'|'sales'|'supply_chain'|'hr'|'it'
 * }
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
const VALID_PRIORITY = new Set(['low','medium','high']);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
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

  const body = req.body || {};
  const { title, description = '', status = 'not_started', priority = 'medium', year, quarter, moduleKey } = body;

  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing title' });
  }
  if (!moduleKey || !MODULE_TO_DEPARTMENT[moduleKey]) {
    return res.status(400).json({ error: 'Invalid or missing moduleKey' });
  }
  const statusNorm = String(status);
  const priorityNorm = String(priority);
  if (!VALID_STATUS.has(statusNorm)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  if (!VALID_PRIORITY.has(priorityNorm)) {
    return res.status(400).json({ error: 'Invalid priority' });
  }

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
    if (year && quarter) {
      const { data: quarterRow } = await supabase
        .from('quarters')
        .select('id')
        .eq('year', year)
        .eq('quarter', quarter)
        .maybeSingle();
      quarterId = quarterRow?.id || null;
    }

    // Ensure department exists for module
    const deptName = MODULE_TO_DEPARTMENT[moduleKey];
    let departmentId = null;
    const { data: deptRow } = await supabase
      .from('departments')
      .select('id')
      .eq('organization_id', orgId)
      .eq('name', deptName)
      .maybeSingle();
    departmentId = deptRow?.id || null;
    if (!departmentId) {
      const { data: insertedDept, error: deptErr } = await supabase
        .from('departments')
        .insert({ organization_id: orgId, name: deptName })
        .select('id')
        .single();
      if (deptErr) throw deptErr;
      departmentId = insertedDept?.id;
    }

    // Insert objective
    const insertPayload = {
      organization_id: orgId,
      title,
      description,
      owner_id: appUser.id,
      department_id: departmentId,
      status: statusNorm,
      priority: priorityNorm,
      quarter_id: quarterId,
      progress: 0,
      updated_at: new Date().toISOString(),
    };

    const { data: objRow, error: objErr } = await supabase
      .from('objectives')
      .insert(insertPayload)
      .select('id, title, status, priority, department_id, quarter_id, progress, updated_at')
      .single();
    if (objErr) throw objErr;

    return res.status(200).json({ ok: true, objective: objRow });
  } catch (error) {
    console.error('objectivesCreate error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}