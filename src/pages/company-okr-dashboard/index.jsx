import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { useSidebar } from '../../contexts/SidebarContext';
import { useOrganization } from '../../contexts/OrganizationContext';
import { supabase } from '../../utils/supabaseClient';


import DashboardHeader from './components/DashboardHeader';
import FilterSidebar from './components/FilterSidebar';
import ObjectiveCard from './components/ObjectiveCard';
import KeyResultCard from './components/KeyResultCard';
import ProgressCard from './components/ProgressCard';
import InitiativeCard from './components/InitiativeCard';
import BoardColumn from './components/BoardColumn';
import BulkActionToolbar from './components/BulkActionToolbar';

const CompanyOKRDashboard = () => {
  const { isCollapsed } = useSidebar();
  const { currentOrg, organizations } = useOrganization();
  const [selectedQuarter, setSelectedQuarter] = useState('Q4');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  
  const [viewMode, setViewMode] = useState('company'); // 'company' or 'group'

  const [objectives, setObjectives] = useState([]);
  const [keyResults, setKeyResults] = useState([]);
  const [initiatives, setInitiatives] = useState([]);
  const [progressUpdates, setProgressUpdates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [availableDepartments, setAvailableDepartments] = useState([]);

  // Helper to get all descendant IDs for group view
  const getDescendantIds = (orgId, allOrgs) => {
    const children = allOrgs.filter(o => o.parent_id === orgId);
    let ids = children.map(c => c.id);
    children.forEach(c => {
      ids = [...ids, ...getDescendantIds(c.id, allOrgs)];
    });
    return ids;
  };

  const hasChildrenOrgs = useMemo(() => {
    if (!currentOrg || !organizations) return false;
    return organizations.some(o => o.parent_id === currentOrg.id);
  }, [currentOrg, organizations]);

  useEffect(() => {
    if (currentOrg?.id) {
      fetchDashboardData();
      fetchFiltersData();
    }
  }, [currentOrg, viewMode, selectedQuarter]); // Refetch when org, view mode, or quarter changes

  const fetchFiltersData = async () => {
    if (!currentOrg?.id) return;
    
    // Fetch users
    const { data: users } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('organization_id', currentOrg.id);
    if (users) setAvailableUsers(users);

    // Fetch departments
    const { data: depts } = await supabase
      .from('departments')
      .select('id, name')
      .eq('organization_id', currentOrg.id);
    if (depts) setAvailableDepartments(depts);
  };

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      let orgIdsToFetch = [currentOrg.id];
      
      if (viewMode === 'group') {
        const descendants = getDescendantIds(currentOrg.id, organizations);
        orgIdsToFetch = [...orgIdsToFetch, ...descendants];
      }

      // 1. Fetch Objectives
      const { data: objectivesData, error: objError } = await supabase
        .from('objectives')
        .select(`
          *,
          owner:users(name),
          department:departments(name),
          strategic_theme:strategic_themes(title)
        `)
        .in('organization_id', orgIdsToFetch);
        // Add quarter filtering if needed: .eq('quarter_id', ...)

      if (objError) throw objError;

      // Transform objectives to match card props
      const formattedObjectives = (objectivesData || []).map(obj => ({
        id: obj.id,
        title: obj.title,
        description: obj.description,
        status: obj.status === 'in_progress' ? 'On Track' : (obj.status === 'not_started' ? 'Not Started' : obj.status), // Map status
        priority: obj.priority.charAt(0).toUpperCase() + obj.priority.slice(1),
        progress: obj.progress || 0,
        owner: obj.owner?.name || 'Unknown',
        team: obj.module || obj.department?.name || '—',
        quarter: 4, // Todo: map quarter_id
        keyResults: 0, // Will update later if needed
        type: 'objective',
        strategicTheme: obj.strategic_theme?.title
      }));
      setObjectives(formattedObjectives);

      if (objectivesData && objectivesData.length > 0) {
        const objIds = objectivesData.map(o => o.id);

        // 2. Fetch Key Results
        const { data: krsData, error: krError } = await supabase
          .from('key_results')
          .select(`
            *,
            objectives(title),
            owner:users(name)
          `)
          .in('objective_id', objIds);

        if (krError) throw krError;

        const formattedKRs = (krsData || []).map(kr => ({
          id: kr.id,
          title: kr.title,
          objectiveTitle: kr.objectives?.title,
          type: kr.type,
          current: kr.current_value,
          target: kr.target_value,
          progress: kr.progress,
          owner: kr.owner?.name || 'Unknown',
          lastUpdated: new Date(kr.updated_at).toLocaleDateString()
        }));
        setKeyResults(formattedKRs);

        // 3. Fetch Initiatives
        const { data: initiativesData, error: initError } = await supabase
          .from('initiatives')
          .select(`
            *,
            objectives(title),
            owner:users(name)
          `)
          .in('objective_id', objIds);

        if (initError) throw initError;

        const formattedInitiatives = (initiativesData || []).map(init => ({
          id: init.id,
          title: init.title,
          description: init.description || '', // init.description might be missing in some schemas?
          status: init.status,
          type: init.initiative_type,
          team: [init.owner?.name].filter(Boolean), // Mock team for now
          linkedObjectives: 1,
          dueDate: init.end_date,
          timeRemaining: init.end_date ? 'Unknown' : '', // Calc diff
        }));
        setInitiatives(formattedInitiatives);

        // 4. Fetch Updates (Progress)
        // Combine updates from objectives, KRs, initiatives
        const { data: objUpdates } = await supabase
          .from('objective_updates')
          .select('*, objectives(title), author:users(name)')
          .in('objective_id', objIds)
          .order('created_at', { ascending: false })
          .limit(10);
        
        const { data: krUpdates } = await supabase
          .from('key_result_updates')
          .select('*, key_results(title), author:users(name)')
          .in('key_result_id', krsData?.map(k => k.id) || [])
          .order('created_at', { ascending: false })
          .limit(10);

        // Merge and format updates
        const allUpdates = [
          ...(objUpdates || []).map(u => ({
            id: u.id,
            title: `Objective Update`,
            description: u.message,
            type: u.update_type === 'check_in' ? 'update' : u.update_type, // Map enum
            impact: 'Medium', // Default
            confidence: 0,
            metrics: { change: u.progress_delta, value: '' },
            linkedItem: u.objectives?.title,
            author: u.author?.name,
            timestamp: new Date(u.created_at).toLocaleDateString()
          })),
          ...(krUpdates || []).map(u => ({
            id: u.id,
            title: `Key Result Update`,
            description: u.message,
            type: u.update_type === 'check_in' ? 'update' : u.update_type,
            impact: 'Medium',
            confidence: 0,
            metrics: { change: u.progress_delta, value: '' },
            linkedItem: u.key_results?.title,
            author: u.author?.name,
            timestamp: new Date(u.created_at).toLocaleDateString()
          }))
        ];
        
        // Sort by date desc
        allUpdates.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setProgressUpdates(allUpdates);
      } else {
        setKeyResults([]);
        setInitiatives([]);
        setProgressUpdates([]);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const [filters, setFilters] = useState({
    quarter: 'all',
    status: 'all',
    priority: 'all',
    owner: 'all',
    department: 'all',
    progressMin: 0,
    progressMax: 100,
    search: '',
    showCompleted: true,
    showArchived: false
  });

  // Handle drag and drop
  const handleDragStart = (item, e) => {
    setDraggedItem(item);
    e?.dataTransfer?.setData('text/plain', JSON.stringify(item));
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDrop = (draggedData, targetColumn) => {
    console.log('Dropped item:', draggedData, 'to column:', targetColumn);
    // In a real app, this would update the item's status/column
  };

  // Handle card actions
  const handleCardEdit = (item) => {
    console.log('Edit item:', item);
    // In a real app, this would open an edit modal
  };

  const handleCardDelete = (itemId) => {
    console.log('Delete item:', itemId);
    // In a real app, this would delete the item
  };

  // Handle bulk actions
  const handleBulkAction = async (action, value, items) => {
    console.log('Bulk action:', action, value, items);
    // In a real app, this would perform the bulk operation
    return new Promise(resolve => setTimeout(resolve, 1000));
  };

  // Handle create new
  const handleCreateNew = (type) => {
    console.log('Create new:', type);
    // In a real app, this would open a creation modal
  };

  const handleAddNew = (columnType) => {
    console.log('Add new to column:', columnType);
    // In a real app, this would open a creation modal for that specific type
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className={`transition-all duration-300 pt-16 pb-20 md:pb-4 ${
        isCollapsed ? 'ml-0 md:ml-16' : 'ml-0 md:ml-60'
      }`}>
        <DashboardHeader
          onQuarterChange={setSelectedQuarter}
          onSearchChange={setSearchQuery}
          onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
          onCreateNew={handleCreateNew}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          hasChildrenOrgs={hasChildrenOrgs}
        />

        <div className="flex">
          {/* Filter Sidebar */}
          <FilterSidebar
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            filters={filters}
            onFiltersChange={setFilters}
            availableUsers={availableUsers}
            availableDepartments={availableDepartments}
          />

          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Bulk Action Toolbar */}
            <BulkActionToolbar
              selectedItems={selectedItems}
              onBulkAction={handleBulkAction}
              onClearSelection={() => setSelectedItems([])}
              availableUsers={availableUsers}
            />

            {isLoading ? (
               <div className="flex justify-center items-center h-64">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
               </div>
            ) : (
            /* Board Columns */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 sm:h-[calc(100vh-360px)] md:h-[calc(100vh-300px)] overflow-y-hidden">
              {/* Objectives Column */}
              <BoardColumn
                title="Objectives"
                items={objectives}
                icon="Target"
                color="bg-primary"
                onDrop={handleDrop}
                onCardEdit={handleCardEdit}
                onCardDelete={handleCardDelete}
                onAddNew={handleAddNew}
              >
                {objectives?.map((objective) => (
                  <ObjectiveCard
                    key={objective?.id}
                    objective={objective}
                    onEdit={handleCardEdit}
                    onDelete={handleCardDelete}
                    onDragStart={(e) => handleDragStart(objective, e)}
                    onDragEnd={handleDragEnd}
                    isDragging={draggedItem?.id === objective?.id}
                  />
                ))}
              </BoardColumn>

              {/* Key Results Column */}
              <BoardColumn
                title="Key Results"
                items={keyResults}
                icon="BarChart3"
                color="bg-accent"
                onDrop={handleDrop}
                onCardEdit={handleCardEdit}
                onCardDelete={handleCardDelete}
                onAddNew={handleAddNew}
              >
                {keyResults?.map((keyResult) => (
                  <KeyResultCard
                    key={keyResult?.id}
                    keyResult={keyResult}
                    onEdit={handleCardEdit}
                    onDelete={handleCardDelete}
                    onDragStart={(e) => handleDragStart(keyResult, e)}
                    onDragEnd={handleDragEnd}
                    isDragging={draggedItem?.id === keyResult?.id}
                  />
                ))}
              </BoardColumn>

              {/* Initiatives Column */}
              <BoardColumn
                title="Initiatives"
                items={initiatives}
                icon="Rocket"
                color="bg-warning"
                onDrop={handleDrop}
                onCardEdit={handleCardEdit}
                onCardDelete={handleCardDelete}
                onAddNew={handleAddNew}
              >
                {initiatives?.map((initiative) => (
                  <InitiativeCard
                    key={initiative?.id}
                    initiative={initiative}
                    onEdit={handleCardEdit}
                    onDelete={handleCardDelete}
                    onDragStart={(e) => handleDragStart(initiative, e)}
                    onDragEnd={handleDragEnd}
                    isDragging={draggedItem?.id === initiative?.id}
                  />
                ))}
              </BoardColumn>

              {/* Progress Column */}
              <BoardColumn
                title="Progress"
                items={progressUpdates}
                icon="TrendingUp"
                color="bg-success"
                onDrop={handleDrop}
                onCardEdit={handleCardEdit}
                onCardDelete={handleCardDelete}
                onAddNew={handleAddNew}
              >
                {progressUpdates?.map((progress) => (
                  <ProgressCard
                    key={progress?.id}
                    progress={progress}
                    onEdit={handleCardEdit}
                    onDelete={handleCardDelete}
                    onDragStart={(e) => handleDragStart(progress, e)}
                    onDragEnd={handleDragEnd}
                    isDragging={draggedItem?.id === progress?.id}
                  />
                ))}
              </BoardColumn>
            </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyOKRDashboard;
