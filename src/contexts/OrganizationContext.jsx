import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const OrganizationContext = createContext();

export const useOrganization = () => useContext(OrganizationContext);

export const OrganizationProvider = ({ children }) => {
  const [currentOrg, setCurrentOrg] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load orgs on mount
  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
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

  const createOrganization = async (name) => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .insert({ name })
        .select()
        .single();

      if (error) throw error;

      setOrganizations(prev => [...prev, data]);
      // Switch to new org? Optional.
      // switchOrganization(data.id);
      return { success: true, data };
    } catch (error) {
      console.error('Error creating organization:', error);
      return { success: false, error };
    }
  };

  return (
    <OrganizationContext.Provider value={{
      currentOrg,
      organizations,
      isLoading,
      switchOrganization,
      createOrganization,
      refreshOrganizations: fetchOrganizations
    }}>
      {children}
    </OrganizationContext.Provider>
  );
};
