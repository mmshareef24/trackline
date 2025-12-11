/**
 * Vercel serverless function to purge demo data for a specified organization.
 * Requires service role key due to RLS. Secured via Supabase JWT and admin role check.
 *
 * Env vars required:
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 * - CLEANUP_ADMIN_TOKEN (used to authorize the cleanup route)
 * - DEFAULT_ORG_NAME (optional; defaults to 'Default Org')
 */
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Enforce authenticated request via Supabase JWT in Authorization header
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

  const { orgName } = req.body || {};
  const targetOrgName = orgName || process.env.DEFAULT_ORG_NAME || 'Default Org';

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
    if (appUser.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: admin role required' });
    }

    // Resolve org id
    const { data: orgRow, error: orgErr } = await supabase
      .from('organizations')
      .select('id, name')
      .eq('name', targetOrgName)
      .single();
    if (orgErr) throw orgErr;
    if (!orgRow?.id) {
      return res.status(404).json({ error: `Organization '${targetOrgName}' not found` });
    }

    const orgId = orgRow.id;

    // Prevent cross-organization cleanup: requester must belong to target org
    if (appUser.organization_id !== orgId) {
      return res.status(403).json({ error: 'Forbidden: cross-organization cleanup not allowed' });
    }

    // Delete objectives first; cascades will remove key_results, initiatives, updates, and attachment links
    const { error: objDelErr, count: objCount } = await supabase
      .from('objectives')
      .delete({ count: 'exact' })
      .eq('organization_id', orgId);
    if (objDelErr) throw objDelErr;

    // Delete users for org
    const { error: usersDelErr, count: usersCount } = await supabase
      .from('users')
      .delete({ count: 'exact' })
      .eq('organization_id', orgId);
    if (usersDelErr) throw usersDelErr;

    // Delete teams for org
    const { error: teamsDelErr, count: teamsCount } = await supabase
      .from('teams')
      .delete({ count: 'exact' })
      .eq('organization_id', orgId);
    if (teamsDelErr) throw teamsDelErr;

    // Delete departments for org
    const { error: deptsDelErr, count: deptsCount } = await supabase
      .from('departments')
      .delete({ count: 'exact' })
      .eq('organization_id', orgId);
    if (deptsDelErr) throw deptsDelErr;

    return res.status(200).json({
      ok: true,
      organization: targetOrgName,
      deleted: {
        objectives: objCount ?? null,
        users: usersCount ?? null,
        teams: teamsCount ?? null,
        departments: deptsCount ?? null,
      },
    });
  } catch (error) {
    console.error('cleanupDemo error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}