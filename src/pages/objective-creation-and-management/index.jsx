import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { useSidebar } from '../../contexts/SidebarContext';
import { useOrganization } from '../../contexts/OrganizationContext';
import { supabase } from '../../utils/supabaseClient';

import Button from '../../components/ui/Button';
import ObjectivesList from './components/ObjectivesList';
import ObjectiveForm from './components/ObjectiveForm';
import ObjectiveDetails from './components/ObjectiveDetails';
import BulkActions from './components/BulkActions';

const ObjectiveCreationAndManagement = () => {
  const { isCollapsed } = useSidebar();
  const { currentOrg, isLoading: isOrgLoading } = useOrganization();
  const [objectives, setObjectives] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [selectedObjectives, setSelectedObjectives] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('split'); // 'split', 'list', 'details'
  
  // Use currentOrg.id from context instead of local orgId state
  const orgId = currentOrg?.id;

  useEffect(() => {
    const fetchObjectives = async () => {
      // Wait for org to load
      if (isOrgLoading) return;

      if (!orgId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch departments
        const { data: depts, error: deptError } = await supabase
          .from('departments')
          .select('id, name')
          .eq('organization_id', orgId);
        
        if (deptError) throw deptError;
        if (depts) setDepartments(depts);

        // Fetch objectives for current org
        const { data: objs, error } = await supabase
          .from('objectives')
          .select(`
            *,
            keyResults:key_results(*),
            owner:users!owner_id(name),
            department:departments!department_id(name),
            quarter:quarters!quarter_id(quarter, year)
          `)
          .eq('organization_id', orgId)
          .order('updated_at', { ascending: false });

        if (error) throw error;
        
        // Map DB structure to frontend structure
        const formattedObjectives = objs.map(obj => ({
          ...obj,
          owner: obj.owner?.name || 'Unassigned',
          team: obj.department?.name || 'Unassigned',
          module: obj.module || obj.department?.name || '',
          quarter: obj.quarter ? `Q${obj.quarter.quarter} ${obj.quarter.year}` : (obj.quarter_name || 'N/A'),
          status: obj.status === 'not_started' ? 'draft' : 
                  obj.status === 'in_progress' ? 'active' : 
                  obj.status,
          keyResults: obj.keyResults?.map(kr => ({
            ...kr,
            currentValue: kr.current,
            targetValue: kr.target,
            metricType: kr.metric_type
          })) || []
        }));
        
        setObjectives(formattedObjectives);
      } catch (error) {
        console.error('Error loading objectives:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchObjectives();
  }, [orgId, isOrgLoading]); // Re-fetch when orgId changes

  const handleSelectObjective = (objective) => {
    setSelectedObjective(objective);
    if (window.innerWidth < 1024) {
      setViewMode('details');
    }
  };

  const handleCreateNew = () => {
    setFormMode('create');
    setSelectedObjective(null);
    setIsFormOpen(true);
  };

  const handleEditObjective = (objective = selectedObjective) => {
    setFormMode('edit');
    setSelectedObjective(objective);
    setIsFormOpen(true);
  };

  const handleSaveObjective = async (objectiveData) => {
    console.log('Attempting to save objective...', objectiveData);
    console.log('Module:', objectiveData.module, 'Department ID:', objectiveData.departmentId);
    
    if (!orgId) {
      console.error('No organization ID found');
      alert('System Error: No Organization ID found. Please refresh the page or contact support.');
      return;
    }

    try {
      const { keyResults, ...objData } = objectiveData;
      
      // Map status from frontend to backend enum
      let dbStatus = 'not_started';
      if (objData.status === 'active') dbStatus = 'in_progress';
      else if (objData.status === 'draft') dbStatus = 'not_started';
      else if (objData.status) dbStatus = objData.status;

      // Map module to department
      let departmentId = null;
      if (objData.departmentId) {
        departmentId = objData.departmentId;
      } else if (objData.module) {
        const MODULE_TO_DEPT_MAP = {
          finance: 'Finance',
          sales: 'Sales',
          supply_chain: 'Supply Chain',
          production: 'Production',
          project: 'Projects',
          hr: 'Human Resources',
          it: 'IT',
          executive: 'Executive'
        };
        
        // Try to match module name directly or via map
        let deptName = objData.module;
        if (MODULE_TO_DEPT_MAP[objData.module.toLowerCase()]) {
            deptName = MODULE_TO_DEPT_MAP[objData.module.toLowerCase()];
        }
        
        if (deptName) {
          // Try to find existing department
          const { data: dept } = await supabase
            .from('departments')
            .select('id')
            .eq('organization_id', orgId)
            .ilike('name', deptName)
            .maybeSingle();
            
          if (dept) {
            departmentId = dept.id;
          } else {
            // Auto-create department if it doesn't exist to ensure consistency in System Settings
            console.log(`Auto-creating department: ${deptName}`);
            const { data: newDept, error: createErr } = await supabase
              .from('departments')
              .insert({
                organization_id: orgId,
                name: deptName
              })
              .select('id')
              .single();
            
            if (!createErr && newDept) {
               departmentId = newDept.id;
               // Trigger a refresh of departments context if possible, or assume it will happen on next fetch
            } else {
               console.error('Failed to auto-create department:', createErr);
            }
          }
        }
      }

      // Resolve Quarter
      let quarterId = null;
      if (objData.quarter) {
        // Parse "Q1 2025" or similar
        const parts = objData.quarter.split(' ');
        if (parts.length >= 2) {
          const qStr = parts[0]; // "Q1"
          const yStr = parts[1]; // "2025"
          const qNum = parseInt(qStr.replace('Q', ''));
          const yNum = parseInt(yStr);
          
          if (!isNaN(qNum) && !isNaN(yNum)) {
            const { data: qData } = await supabase
              .from('quarters')
              .select('id')
              .eq('quarter', qNum)
              .eq('year', yNum)
              .maybeSingle();
            if (qData) quarterId = qData.id;
          }
        }
      }

      // Resolve Owner (Best Effort)
      let ownerId = null;
      if (objData.owner) {
        // Try exact name match
        const { data: uData } = await supabase
          .from('users')
          .select('id')
          .ilike('name', objData.owner) // Case insensitive
          .maybeSingle();
        if (uData) ownerId = uData.id;
      }
      
      // Fallback owner to current user if not found
      if (!ownerId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Check if this auth user is in our public.users table
          const { data: publicUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', user.email)
            .maybeSingle();
          if (publicUser) ownerId = publicUser.id;
        }
      }

      // Resolve Team - Commented out as objectives table doesn't have team_id
      /*
      let teamId = null;
      if (objData.team) {
         const { data: tData } = await supabase
          .from('teams')
          .select('id')
          .eq('organization_id', orgId)
          .ilike('name', objData.team)
          .maybeSingle();
        if (tData) teamId = tData.id;
      }
      */

      const dbObjectiveData = {
        title: objData.title,
        description: objData.description,
        status: dbStatus,
        priority: objData.priority,
        organization_id: orgId,
        category: objData.category,
        module: objData.module,
        department_id: departmentId,
        owner_id: ownerId,
        // team_id: teamId, // Column does not exist in objectives table
        quarter_id: quarterId,
        strategic_theme_id: objData.strategicThemeId || null,
        updated_at: new Date().toISOString()
      };

      console.log('DB Objective Payload:', dbObjectiveData);

      let savedObjective;

      const performSave = async (payload) => {
        if (formMode === 'create') {
          return await supabase
            .from('objectives')
            .insert({
              ...payload,
              created_at: new Date().toISOString()
            })
            .select()
            .single();
        } else {
          return await supabase
            .from('objectives')
            .update(payload)
            .eq('id', selectedObjective.id)
            .select()
            .single();
        }
      };

      // First attempt with all data (including module)
      let { data, error } = await performSave(dbObjectiveData);

      // Retry without module if column missing error (42703 undefined_column)
      if (error && (error.code === '42703' || error.message?.includes('module'))) {
        console.warn('Module column missing in DB, retrying without module...');
        const { module, ...safeData } = dbObjectiveData;
        const retryResult = await performSave(safeData);
        data = retryResult.data;
        error = retryResult.error;
        
        if (!error) {
           alert('Objective saved, but "Module" could not be stored (Database update required).');
        }
      }

      if (error) {
         console.error('Supabase Save Error:', error);
         throw error;
      }
      savedObjective = data;

      if (formMode === 'create') {
        // Optimistic update
        // We include module in local state even if not saved to DB, so UI reflects it until refresh
        const optimisticObj = { ...savedObjective, module: dbObjectiveData.module };
        setObjectives(prev => [{ ...optimisticObj, keyResults: [] }, ...prev]);
        setSelectedObjective({ ...optimisticObj, keyResults: [] });

      } else {
        // Update local state
        const optimisticObj = { ...savedObjective, module: dbObjectiveData.module };
        setObjectives(prev => prev.map(obj => 
          obj.id === savedObjective.id ? { ...optimisticObj, keyResults: obj.keyResults } : obj
        ));
        setSelectedObjective(prev => ({ ...prev, ...optimisticObj }));
      }

      // Handle Key Results
      if (keyResults && keyResults.length > 0) {
        // Prepare KRs for upsert
        const krsToUpsert = keyResults.map(kr => ({
          objective_id: savedObjective.id,
          title: kr.title,
          metric_type: kr.metricType,
          target: kr.targetValue,
          current: kr.currentValue,
          unit: kr.unit,
          progress: kr.progress,
          status: kr.status || 'not_started',
          priority: kr.priority || 'medium',
          id: typeof kr.id === 'string' && kr.id.length > 10 ? kr.id : undefined // Only keep ID if it's a valid UUID (simple check)
        }));

        // Since upsert with undefined ID works for insert, but we have mixed numeric IDs from frontend mock
        // We should separate inserts and updates or just insert new ones.
        // For simplicity, let's delete existing KRs and insert new ones (easiest for full sync)
        // OR better: iterate and insert/update.
        
        // Strategy: Delete all KRs for this objective and re-insert (simplest for this prototype phase)
        await supabase.from('key_results').delete().eq('objective_id', savedObjective.id);
        
        const { data: savedKRs, error: krError } = await supabase
          .from('key_results')
          .insert(krsToUpsert.map(kr => {
             const { id, ...rest } = kr; // Remove mock IDs
             return rest;
          }))
          .select();

        if (krError) {
            console.error('Supabase Key Results Error:', krError);
            throw krError;
        }

        // Update local state with saved KRs
        const formattedKRs = savedKRs.map(kr => ({
          ...kr,
          currentValue: kr.current,
          targetValue: kr.target,
          metricType: kr.metric_type
        }));

        setObjectives(prev => prev.map(obj => 
          obj.id === savedObjective.id ? { ...savedObjective, keyResults: formattedKRs } : obj
        ));
        setSelectedObjective({ ...savedObjective, keyResults: formattedKRs });
      }

      // alert('Objective saved successfully!'); // Optional success message

    } catch (error) {
      console.error('Error saving objective:', error);
      alert('Failed to save objective: ' + (error.message || JSON.stringify(error)));
    }
    
    setIsFormOpen(false);
  };

  const handleBulkAction = (actionId, selectedIds) => {
    console.log('Bulk action:', actionId, 'for objectives:', selectedIds);
    
    switch (actionId) {
      case 'status_active':
        setObjectives(prev => prev?.map(obj => 
          selectedIds?.includes(obj?.id) ? { ...obj, status: 'active', updatedAt: 'just now' } : obj
        ));
        break;
      case 'status_draft':
        setObjectives(prev => prev?.map(obj => 
          selectedIds?.includes(obj?.id) ? { ...obj, status: 'draft', updatedAt: 'just now' } : obj
        ));
        break;
      case 'status_completed':
        setObjectives(prev => prev?.map(obj => 
          selectedIds?.includes(obj?.id) ? { ...obj, status: 'completed', progress: 100, updatedAt: 'just now' } : obj
        ));
        break;
      case 'status_archived':
        setObjectives(prev => prev?.map(obj => 
          selectedIds?.includes(obj?.id) ? { ...obj, status: 'archived', updatedAt: 'just now' } : obj
        ));
        break;
      case 'priority_high':
        setObjectives(prev => prev?.map(obj => 
          selectedIds?.includes(obj?.id) ? { ...obj, priority: 'high', updatedAt: 'just now' } : obj
        ));
        break;
      case 'priority_medium':
        setObjectives(prev => prev?.map(obj => 
          selectedIds?.includes(obj?.id) ? { ...obj, priority: 'medium', updatedAt: 'just now' } : obj
        ));
        break;
      case 'priority_low':
        setObjectives(prev => prev?.map(obj => 
          selectedIds?.includes(obj?.id) ? { ...obj, priority: 'low', updatedAt: 'just now' } : obj
        ));
        break;
      case 'export':
        // Simulate export
        const exportData = objectives?.filter(obj => selectedIds?.includes(obj?.id));
        console.log('Exporting objectives:', exportData);
        break;
      case 'duplicate':
        const duplicatedObjectives = objectives?.filter(obj => selectedIds?.includes(obj?.id))?.map(obj => ({
            ...obj,
            id: Date.now() + Math.random(),
            title: `${obj?.title} (Copy)`,
            status: 'draft',
            progress: 0,
            createdAt: new Date()?.toISOString()?.split('T')?.[0],
            updatedAt: 'just now'
          }));
        setObjectives(prev => [...duplicatedObjectives, ...prev]);
        break;
      case 'delete':
        setObjectives(prev => prev?.filter(obj => !selectedIds?.includes(obj?.id)));
        if (selectedObjective && selectedIds?.includes(selectedObjective?.id)) {
          setSelectedObjective(null);
        }
        break;
    }
    
    setSelectedObjectives([]);
  };

  const handleToggleSelection = (objectiveId) => {
    setSelectedObjectives(prev => 
      prev?.includes(objectiveId)
        ? prev?.filter(id => id !== objectiveId)
        : [...prev, objectiveId]
    );
  };

  const handleSelectAll = () => {
    if (selectedObjectives?.length === objectives?.length) {
      setSelectedObjectives([]);
    } else {
      setSelectedObjectives(objectives?.map(obj => obj?.id));
    }
  };

  if (isOrgLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar />
        <div className="md:ml-60 pt-16">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading organization...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar />
        <div className="md:ml-60 pt-16">
          <div className="flex items-center justify-center h-96">
            <div className="text-center p-8 max-w-md mx-auto">
              <div className="text-destructive mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Unable to Load Objectives</h3>
              <p className="text-muted-foreground mb-4 bg-destructive/10 p-3 rounded text-sm font-mono text-left overflow-auto max-h-32">
                {error}
              </p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar />
        <div className="md:ml-60 pt-16">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading objectives...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className={`transition-all duration-300 pt-16 pb-20 md:pb-4 overflow-x-hidden ${
        isCollapsed ? 'ml-0 md:ml-16' : 'ml-0 md:ml-60'
      }`}>
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
          {/* Mobile View Toggle */}
          <div className="lg:hidden fixed top-20 right-4 z-30">
            <div className="flex bg-card border border-border rounded-lg p-1">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                iconName="List"
              />
              <Button
                variant={viewMode === 'details' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('details')}
                iconName="Eye"
                disabled={!selectedObjective}
              />
            </div>
          </div>

          {/* Desktop Split View / Mobile Conditional View */}
          <div className={`${
            viewMode === 'details' ? 'hidden lg:block' : 'block'
          } w-full lg:w-2/5 lg:border-r border-border max-w-full overflow-y-auto p-4 sm:p-6`}> 
            
            <ObjectivesList
              objectives={objectives}
              onSelectObjective={handleSelectObjective}
              selectedObjectiveId={selectedObjective?.id}
              onCreateNew={handleCreateNew}
              selectedObjectives={selectedObjectives}
              onToggleSelection={handleToggleSelection}
              onSelectAll={handleSelectAll}
            />
          </div>

          <div className={`${
            viewMode === 'list' ? 'hidden lg:block' : 'block'
          } w-full lg:w-3/5 max-w-full overflow-y-auto p-4 sm:p-6`}>
            <ObjectiveDetails
              objective={selectedObjective}
              onEdit={handleEditObjective}
              onClose={() => {
                setSelectedObjective(null);
                if (window.innerWidth < 1024) {
                  setViewMode('list');
                }
              }}
            />
          </div>
        </div>
      </main>

      {/* Objective Form Modal */}
      <ObjectiveForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveObjective}
        objective={formMode === 'edit' ? selectedObjective : null}
        mode={formMode}
        prefetchedDepartments={departments}
      />

      {/* Bulk Actions */}
      <BulkActions
        selectedObjectives={selectedObjectives}
        onBulkAction={handleBulkAction}
        onClearSelection={() => setSelectedObjectives([])}
      />

      {/* Mobile Bottom Padding */}
      <div className="h-20 md:hidden"></div>
    </div>
  );
};

export default ObjectiveCreationAndManagement;