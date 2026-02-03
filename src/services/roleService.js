
import { supabase } from '../utils/supabaseClient';

export const listRoles = async (orgId) => {
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .eq('organization_id', orgId)
    .order('name');
  
  if (error) throw error;
  return data;
};

export const createRole = async (roleData) => {
  const { data, error } = await supabase
    .from('roles')
    .insert([roleData])
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const updateRole = async (roleId, updates) => {
  const { data, error } = await supabase
    .from('roles')
    .update(updates)
    .eq('id', roleId)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const deleteRole = async (roleId) => {
  const { error } = await supabase
    .from('roles')
    .delete()
    .eq('id', roleId);
    
  if (error) throw error;
  return true;
};
