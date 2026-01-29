import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { useSidebar } from '../../contexts/SidebarContext';
import { supabase } from '../../utils/supabaseClient';

import Button from '../../components/ui/Button';
import ObjectivesList from './components/ObjectivesList';
import ObjectiveForm from './components/ObjectiveForm';
import ObjectiveDetails from './components/ObjectiveDetails';
import BulkActions from './components/BulkActions';

const ObjectiveCreationAndManagement = () => {
  const { isCollapsed } = useSidebar();
  const [objectives, setObjectives] = useState([]);
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [selectedObjectives, setSelectedObjectives] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('split'); // 'split', 'list', 'details'
  const [orgId, setOrgId] = useState(null);

  useEffect(() => {
    const fetchOrgAndObjectives = async () => {
      setIsLoading(true);
      try {
        // Fetch organization (defaulting to the first one found if not authenticated user-org context)
        const { data: orgs } = await supabase.from('organizations').select('id').limit(1);
        const organizationId = orgs?.[0]?.id;
        setOrgId(organizationId);

        if (organizationId) {
          // Fetch objectives
          const { data: objs, error } = await supabase
            .from('objectives')
            .select(`
              *,
              keyResults:key_results(*)
            `)
            .eq('organization_id', organizationId)
            .order('updated_at', { ascending: false });

          if (error) throw error;
          
          // Map DB structure to frontend structure
          const formattedObjectives = objs.map(obj => ({
            ...obj,
            owner: obj.owner_name,
            team: obj.team_name,
            keyResults: obj.keyResults?.map(kr => ({
              ...kr,
              currentValue: kr.current,
              targetValue: kr.target,
              metricType: kr.metric_type
            })) || []
          }));
          
          setObjectives(formattedObjectives);
        }
      } catch (error) {
        console.error('Error loading objectives:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrgAndObjectives();
  }, []);

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
    if (!orgId) {
      console.error('No organization ID found');
      return;
    }

    try {
      const { keyResults, ...objData } = objectiveData;
      
      const dbObjectiveData = {
        title: objData.title,
        description: objData.description,
        status: objData.status || 'not_started',
        priority: objData.priority,
        organization_id: orgId,
        category: objData.category,
        owner_name: objData.owner,
        team_name: objData.team,
        // Map other fields as needed
        updated_at: new Date().toISOString()
      };

      let savedObjective;

      if (formMode === 'create') {
        const { data, error } = await supabase
          .from('objectives')
          .insert({
            ...dbObjectiveData,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;
        savedObjective = data;
        
        // Optimistic update
        setObjectives(prev => [{ ...savedObjective, keyResults: [] }, ...prev]);
        setSelectedObjective({ ...savedObjective, keyResults: [] });

      } else {
        const { data, error } = await supabase
          .from('objectives')
          .update(dbObjectiveData)
          .eq('id', selectedObjective.id)
          .select()
          .single();

        if (error) throw error;
        savedObjective = data;

        setObjectives(prev => prev.map(obj => 
          obj.id === savedObjective.id ? { ...savedObjective, keyResults: obj.keyResults } : obj
        ));
        setSelectedObjective(prev => ({ ...prev, ...savedObjective }));
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

        if (krError) throw krError;

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

    } catch (error) {
      console.error('Error saving objective:', error);
      alert('Failed to save objective: ' + error.message);
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