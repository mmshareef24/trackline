import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from './AuthContext';

const OrganizationContext = createContext();

export const useOrganization = () => useContext(OrganizationContext);

export const OrganizationProvider = ({ children }) => {
  const { user } = useAuth();
  const [currentOrg, setCurrentOrg] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [strategicThemes, setStrategicThemes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load orgs when user changes
  useEffect(() => {
    if (user?.id) {
      // Small delay to ensure Supabase client is ready
      const timer = setTimeout(() => {
        fetchOrganizations();
      }, 100);
      return () => clearTimeout(timer);
    } else if (!user) {
      setOrganizations([]);
      setCurrentOrg(null);
      setStrategicThemes([]);
      setDepartments([]);
      setIsLoading(false);
    }
  }, [user?.id]);

  // Fetch strategic themes and departments when current org changes
  useEffect(() => {
    if (currentOrg?.id) {
      fetchStrategicThemes(currentOrg.id);
      fetchDepartments(currentOrg.id);
    } else {
      setStrategicThemes([]);
      setDepartments([]);
    }
  }, [currentOrg?.id]);

  const fetchStrategicThemes = async (orgId) => {
    try {
      const { data, error } = await supabase
        .from('strategic_themes')
        .select('*')
        .eq('organization_id', orgId)
        .order('created_at', { ascending: true });
        
      if (error) {
        // If table doesn't exist yet (migration pending), ignore error
        if (error.code === '42P01') {
          console.warn('Strategic themes table not found');
          return;
        }
        throw error;
      }
      setStrategicThemes(data || []);
    } catch (err) {
      console.error('Error fetching strategic themes:', err);
    }
  };

  const fetchDepartments = async (orgId) => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .eq('organization_id', orgId)
        .order('name');
        
      if (error) throw error;
      setDepartments(data || []);
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  const fetchOrganizations = async () => {
    // If already loading or no user, skip
    // We check !user inside but here it's called from useEffect(user)
    
    setIsLoading(true);
    try {
      console.log('Fetching organizations...');
      // Add timeout to fetch
      const fetchPromise = supabase
        .from('organizations')
        .select('*')
        .order('name');
      
      // 10s timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Organization fetch timeout')), 10000)
      );

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);
      
      if (error) throw error;
      
      console.log('Organizations fetched:', data?.length);
      setOrganizations(data || []);

      // Restore selected org from local storage or default to first
      const storedOrgId = localStorage.getItem('trackline_selected_org_id');
      const foundOrg = data?.find(o => o.id === storedOrgId);
      
      if (foundOrg) {
        setCurrentOrg(foundOrg);
      } else if (data && data.length > 0) {
        setCurrentOrg(data[0]);
        localStorage.setItem('trackline_selected_org_id', data[0].id);
      } else {
        // No orgs exist, create default
        await createDefaultOrg();
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
      // Even on error, we should probably stop loading
    } finally {
      setIsLoading(false);
    }
  };

  const createDefaultOrg = async () => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .insert({ name: 'Default Organization' })
        .select()
        .single();
        
      if (error) throw error;
      
      setOrganizations([data]);
      setCurrentOrg(data);
      localStorage.setItem('trackline_selected_org_id', data.id);
    } catch (err) {
      console.error('Error creating default org:', err);
    }
  };

  const switchOrganization = (orgId) => {
    const org = organizations.find(o => o.id === orgId);
    if (org) {
      setCurrentOrg(org);
      localStorage.setItem('trackline_selected_org_id', org.id);
      // Optional: Refresh page to ensure all components reload data
      // window.location.reload(); 
      // Better: let components react to context change
    }
  };

  const createOrganization = async (name, parentId = null, type = 'company') => {
    try {
      const payload = { name, type };
      if (parentId) payload.parent_id = parentId;

      const { data, error } = await supabase
        .from('organizations')
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      setOrganizations(prev => [...prev, data]);
      return { success: true, data };
    } catch (error) {
      console.error('Error creating organization:', error);
      return { success: false, error };
    }
  };

  const updateOrganization = async (orgId, updates) => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .update(updates)
        .eq('id', orgId)
        .select()
        .single();

      if (error) throw error;

      setOrganizations(prev => prev.map(org => org.id === orgId ? data : org));
      if (currentOrg?.id === orgId) {
        setCurrentOrg(data);
      }
      return { success: true, data };
    } catch (error) {
      console.error('Error updating organization:', error);
      return { success: false, error };
    }
  };

  const addStrategicTheme = async (title, description) => {
    if (!currentOrg?.id) return;
    try {
      const { data, error } = await supabase
        .from('strategic_themes')
        .insert({
          organization_id: currentOrg.id,
          title,
          description
        })
        .select()
        .single();

      if (error) throw error;
      setStrategicThemes(prev => [...prev, data]);
      return { success: true, data };
    } catch (error) {
      console.error('Error adding strategic theme:', error);
      return { success: false, error };
    }
  };

  const deleteStrategicTheme = async (id) => {
    try {
      const { error } = await supabase
        .from('strategic_themes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setStrategicThemes(prev => prev.filter(t => t.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting strategic theme:', error);
      return { success: false, error };
    }
  };

  const addDepartment = async (name) => {
    if (!currentOrg?.id) return;
    try {
      const { data, error } = await supabase
        .from('departments')
        .insert({
          organization_id: currentOrg.id,
          name
        })
        .select()
        .single();

      if (error) throw error;
      setDepartments(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      return { success: true, data };
    } catch (error) {
      console.error('Error adding department:', error);
      return { success: false, error };
    }
  };

  const deleteDepartment = async (id) => {
    try {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setDepartments(prev => prev.filter(d => d.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting department:', error);
      return { success: false, error };
    }
  };

  const bulkDeleteDepartments = async (ids) => {
    if (!ids || ids.length === 0) return { success: true };
    try {
      const { error } = await supabase
        .from('departments')
        .delete()
        .in('id', ids);

      if (error) throw error;
      setDepartments(prev => prev.filter(d => !ids.includes(d.id)));
      return { success: true };
    } catch (error) {
      console.error('Error bulk deleting departments:', error);
      return { success: false, error };
    }
  };

  return (
    <OrganizationContext.Provider value={{
      currentOrg,
      organizations,
      strategicThemes,
      departments,
      isLoading,
      switchOrganization,
      createOrganization,
      updateOrganization,
      addStrategicTheme,
      deleteStrategicTheme,
      addDepartment,
      deleteDepartment,
      bulkDeleteDepartments,
      refreshOrganizations: fetchOrganizations
    }}>
      {children}
    </OrganizationContext.Provider>
  );
};
