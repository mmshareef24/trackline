import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { useSidebar } from '../../contexts/SidebarContext';
import { useOrganization } from '../../contexts/OrganizationContext';
import { supabase } from '../../utils/supabaseClient';
import TimelineHeader from './components/TimelineHeader';
import TimelineView from './components/TimelineView';
import MilestoneDetails from './components/MilestoneDetails';
import DependencyMap from './components/DependencyMap';
import QuickActions from './components/QuickActions';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const TimelineAndMilestoneManagement = () => {
  const { isCollapsed } = useSidebar();
  const { currentOrg, isLoading: isOrgLoading } = useOrganization();
  const [currentView, setCurrentView] = useState('quarterly');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuarter, setSelectedQuarter] = useState('all');
  const [selectedOwner, setSelectedOwner] = useState('all');
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [activeTab, setActiveTab] = useState('timeline');
  const [objectives, setObjectives] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimelineData = async () => {
      if (isOrgLoading) return;
      
      if (!currentOrg?.id) {
        setIsLoading(false);
        setObjectives([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timed out')), 15000)
        );

        // Fetch objectives with key results (serving as milestones)
        const queryPromise = supabase
          .from('objectives')
          .select(`
            *,
            owner:users!owner_id(id, name),
            department:departments!department_id(name),
            keyResults:key_results(
              *,
              owner:users(id, name)
            )
          `)
          .eq('organization_id', currentOrg.id)
          .order('created_at', { ascending: false });

        const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

        if (error) throw error;

        // Transform data to match component expectations
        const formattedObjectives = (data || []).map(obj => ({
          id: obj.id,
          title: obj.title,
          description: obj.description,
          department: obj.department?.name || 'Unassigned',
          priority: obj.priority || 'medium',
          status: obj.status === 'not_started' ? 'pending' : (obj.status === 'in_progress' ? 'in-progress' : obj.status),
          progress: obj.progress || 0,
          owners: obj.owner ? [obj.owner] : [],
          dependencies: [], // Dependencies not yet implemented in DB
          milestones: (obj.keyResults || []).map(kr => ({
            id: kr.id,
            title: kr.title,
            description: kr.description || '',
            quarter: 'Q' + (obj.quarter_id || '1') + ' 2025', // Mock quarter for now
            dueDate: kr.due_date || obj.due_date || new Date().toISOString().split('T')[0],
            status: kr.status === 'not_started' ? 'pending' : (kr.status === 'in_progress' ? 'in-progress' : kr.status),
            priority: 'medium',
            assignee: kr.owner?.id,
            assigneeName: kr.owner?.name || 'Unassigned',
            completionCriteria: 'Target: ' + kr.target_value,
            dependencies: [],
            comments: []
          }))
        }));

        setObjectives(formattedObjectives);
      } catch (err) {
        console.error('Error fetching timeline data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimelineData();
  }, [currentOrg?.id, isOrgLoading]);

  // Filter objectives based on search and filters
  const filteredObjectives = useMemo(() => {
    return (objectives || []).filter(objective => {
      const matchesSearch = searchQuery === '' || 
        objective?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        objective?.department?.toLowerCase()?.includes(searchQuery?.toLowerCase());
      
      const matchesQuarter = selectedQuarter === 'all' || 
        objective?.milestones?.some(milestone => milestone?.quarter === selectedQuarter);
      
      const matchesOwner = selectedOwner === 'all' || 
        objective?.owners?.some(owner => owner?.id === selectedOwner);

      return matchesSearch && matchesQuarter && matchesOwner;
    });
  }, [objectives, searchQuery, selectedQuarter, selectedOwner]);

  const handleMilestoneUpdate = (objectiveId, milestoneId, updates) => {
    setObjectives(prev => prev?.map(obj => {
      if (obj?.id === objectiveId) {
        return {
          ...obj,
          milestones: obj?.milestones?.map(milestone => 
            milestone?.id === milestoneId ? { ...milestone, ...updates } : milestone
          )
        };
      }
      return obj;
    }));
  };

  const handleDependencyUpdate = (fromObjectiveId, toObjectiveId) => {
    setObjectives(prev => prev?.map(obj => {
      if (obj?.id === toObjectiveId) {
        const newDependencies = obj?.dependencies || [];
        if (!newDependencies?.includes(fromObjectiveId)) {
          return { ...obj, dependencies: [...newDependencies, fromObjectiveId] };
        }
      }
      return obj;
    }));
  };

  const handleExport = (format) => {
    console.log('Exporting timeline data in format:', format);
    // Implementation would generate and download the requested format
  };

  const handleBulkOperations = (data) => {
    console.log('Performing bulk operation:', data);
    // Implementation would apply bulk changes to selected milestones
  };

  const handleTemplateApply = (template) => {
    console.log('Applying template:', template);
    // Implementation would apply predefined milestone templates
  };

  const tabs = [
    { id: 'timeline', label: 'Timeline View', icon: 'Calendar' },
    { id: 'dependencies', label: 'Dependency Map', icon: 'GitBranch' },
    { id: 'actions', label: 'Quick Actions', icon: 'Zap' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className={`transition-all duration-300 pt-16 pb-20 md:pb-4 ${
        isCollapsed ? 'ml-0 md:ml-16' : 'ml-0 md:ml-60'
      }`}>
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <TimelineHeader
            currentView={currentView}
            onViewChange={setCurrentView}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedQuarter={selectedQuarter}
            onQuarterChange={setSelectedQuarter}
            selectedOwner={selectedOwner}
            onOwnerChange={setSelectedOwner}
          />

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-4 border-b border-border">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Icon name="AlertCircle" className="w-4 h-4" />
                {error}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.location.reload()}
                className="text-destructive border-destructive hover:bg-destructive/10"
              >
                Reload
              </Button>
            </div>
          )}

          {/* Content Area */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {activeTab === 'timeline' && (
                <TimelineView
                  objectives={filteredObjectives}
                  currentView={currentView}
                  onMilestoneClick={setSelectedMilestone}
                />
              )}

              {activeTab === 'dependencies' && (
                <DependencyMap
                  objectives={filteredObjectives}
                  onDependencyAdd={handleDependencyUpdate}
                />
              )}

              {activeTab === 'actions' && (
                <QuickActions
                  onExport={handleExport}
                  onBulkAction={handleBulkOperations}
                  onTemplateApply={handleTemplateApply}
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* Milestone Details Modal */}
      {selectedMilestone && (
        <MilestoneDetails
          milestone={selectedMilestone}
          onClose={() => setSelectedMilestone(null)}
          onUpdate={(updates) => {
            // Find objective containing this milestone
            const objective = objectives.find(obj => 
              obj.milestones.some(m => m.id === selectedMilestone.id)
            );
            if (objective) {
              handleMilestoneUpdate(objective.id, selectedMilestone.id, updates);
            }
          }}
        />
      )}
    </div>
  );
};

export default TimelineAndMilestoneManagement;
