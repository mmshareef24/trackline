import { supabase } from '../utils/supabaseClient';

// Map frontend roles to DB enum (editor -> contributor)
const mapRole = (role) => {
  if (!role) return 'contributor';
  const r = String(role).toLowerCase();
  if (r === 'editor') return 'contributor';
  if (['admin', 'manager', 'contributor', 'viewer'].includes(r)) return r;
  return 'contributor';
};

// Resolve an organization id to attach users to
export const getDefaultOrganizationId = async () => {
  if (!supabase) throw new Error('Supabase not configured');
  const orgName = import.meta.env.VITE_DEFAULT_ORG_NAME || 'Default Org';

  // Try by name first
  let { data, error } = await supabase
    .from('organizations')
    .select('id, name')
    .eq('name', orgName)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (data?.id) return data.id;

  // Fallback: pick the first org
  const fallback = await supabase
    .from('organizations')
    .select('id, name')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();
  if (fallback.error) throw fallback.error;
  if (!fallback.data?.id) throw new Error('No organization found. Seed or create one.');
  return fallback.data.id;
};

// Create a user record in the application users table
export const createUser = async ({ name, email, role, status, organization_id, role_id }) => {
  if (!supabase) throw new Error('Supabase not configured');
  const finalOrgId = organization_id || await getDefaultOrganizationId();
  const is_active = String(status).toLowerCase() === 'active';
  const dbRole = mapRole(role);

  const payload = { 
    organization_id: finalOrgId, 
    email, 
    name, 
    role: dbRole, 
    is_active 
  };

  if (role_id) {
    payload.role_id = role_id;
  }

  const { data, error } = await supabase
    .from('users')
    .insert([payload])
    .select()
    .single();
  if (error) throw error;
  return data;
};

// Upsert the auth user into the users table on login
export const upsertAuthUserOnLogin = async (sessionUser) => {
  if (!supabase || !sessionUser) return;

  const email = sessionUser.email;
  const meta = sessionUser.user_metadata || {};
  const nameFallback = email?.split('@')[0] || 'User';
  const name = meta.full_name || meta.name || nameFallback;
  
  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (existingUser) {
    // User exists, just update metadata if needed (e.g. name), but preserve org/role
    // For now, we skip updating to avoid overwriting admin-assigned roles/orgs
    return;
  }

  // New user: assign to default org
  const organization_id = await getDefaultOrganizationId();
  // Default role for OAuth sign-ins
  const role = 'contributor';

  const { error } = await supabase
    .from('users')
    .insert([{ organization_id, email, name, role, is_active: true }]);

  if (error) {
    // Log but do not block auth flow
    console.warn('[Auth] Failed to create user record:', error?.message || error);
  }
};

export { mapRole };

// Fetch users from Supabase and map to UI-friendly shape
export const listUsers = async () => {
  if (!supabase) throw new Error('Supabase not configured');

  const [{ data: users, error: usersErr }, { data: departments, error: deptErr }, { data: roles, error: rolesErr }] = await Promise.all([
    supabase
      .from('users')
      .select('id,email,name,role,is_active,department_id,created_at,role_id')
      .order('created_at', { ascending: true }),
    supabase
      .from('departments')
      .select('id,name'),
    supabase
      .from('roles')
      .select('id,name')
  ]);

  if (usersErr) throw usersErr;
  if (deptErr) throw deptErr;
  // Ignore rolesErr as the table might not exist yet if migration failed

  const deptMap = new Map((departments || []).map((d) => [d.id, d.name]));
  const roleMap = new Map((roles || []).map((r) => [r.id, r.name]));

  const toUiRole = (dbRole) => {
    const r = String(dbRole || '').toLowerCase();
    if (r === 'contributor') return 'editor';
    if (['admin', 'manager', 'viewer'].includes(r)) return r;
    return 'viewer';
  };

  return (users || []).map((u) => {
    // If user has a custom role_id, use that name, otherwise fallback to standard enum role
    const customRoleName = u.role_id ? roleMap.get(u.role_id) : null;
    
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      department: deptMap.get(u.department_id) || '',
      role: customRoleName || toUiRole(u.role),
      role_id: u.role_id, // Expose for UI
      status: u.is_active ? 'active' : 'inactive',
      avatar: null,
      lastLogin: 'Never',
      permissions: {},
      activityLog: [],
    };
  });
};

export const updateUserStatus = async (id, status) => {
  if (!supabase) throw new Error('Supabase not configured');
  const is_active = String(status).toLowerCase() === 'active';
  const { data, error } = await supabase
    .from('users')
    .update({ is_active })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateUserRole = async (id, uiRole) => {
  if (!supabase) throw new Error('Supabase not configured');
  const role = mapRole(uiRole);
  const { data, error } = await supabase
    .from('users')
    .update({ role })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};