import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { useSidebar } from '../../contexts/SidebarContext';
import { useOrganization } from '../../contexts/OrganizationContext';
import { supabase } from '../../utils/supabaseClient';
import ObjectivesList from './components/ObjectivesList';
import ProgressPanel from './components/ProgressPanel';
import QuickStatsBar from './components/QuickStatsBar';
import BulkUpdateModal from './components/BulkUpdateModal';
import EvidenceUploadModal from './components/EvidenceUploadModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ProgressTrackingAndUpdates = () => {
  const { isCollapsed } = useSidebar();
  const { currentOrg, isLoading: isOrgLoading } = useOrganization();
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [selectedKRForEvidence, setSelectedKRForEvidence] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all'
  });

  const [objectives, setObjectives] = useState([]);

  useEffect(() => {
    const fetchObjectives = async () => {
      if (isOrgLoading) return;
      
      if (!currentOrg?.id) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timed out')), 15000)
        );

        // Fetch objectives with timeout
        const objectivesPromise = supabase
          .from('objectives')
          .select(`
            *,
            keyResults:key_results(*)
          `)
          .eq('organization_id', currentOrg.id)
          .order('updated_at', { ascending: false });

        const { data: objs, error } = await Promise.race([objectivesPromise, timeoutPromise]);

        if (error) throw error;

        const formattedObjectives = objs.map(obj => ({
          ...obj,
          // Map DB fields to component state shape
          keyResultsData: obj.keyResults?.map(kr => ({
            ...kr,
            currentValue: kr.current,
            targetValue: kr.target,
            type: kr.metric_type ? (kr.metric_type.charAt(0).toUpperCase() + kr.metric_type.slice(1)) : 'Percentage' // Capitalize for UI
          })) || [],
          // Mock missing fields for UI compatibility
          daysLeft: obj.due_date ? Math.ceil((new Date(obj.due_date) - new Date()) / (1000 * 60 * 60 * 24)) : 30,
          lastUpdated: new Date(obj.updated_at).toLocaleDateString(),
          comments: [], // Mock comments for now
          recentActivity: [], // Mock activity
          history: [] // Mock history
        }));

        setObjectives(formattedObjectives);
        
        // Select first objective by default if none selected
        if (formattedObjectives.length > 0 && !selectedObjective) {
          setSelectedObjective(formattedObjectives[0]);
        }
      } catch (err) {
        console.error('Error fetching objectives:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchObjectives();
  }, [currentOrg?.id, isOrgLoading]);

  const handleObjectiveSelect = (objective) => {
    setSelectedObjective(objective);
  };

  const handleProgressUpdate = (objectiveId, krId, newProgress) => {
    setObjectives(prev => prev?.map(obj => {
      if (obj?.id === objectiveId) {
        const updatedKRs = obj?.keyResultsData?.map(kr => 
          kr?.id === krId ? { ...kr, progress: newProgress } : kr
        );
        const avgProgress = Math.round(
          updatedKRs?.reduce((sum, kr) => sum + kr?.progress, 0) / updatedKRs?.length
        );
        return {
          ...obj,
          keyResultsData: updatedKRs,
          progress: avgProgress,
          lastUpdated: "Just now"
        };
      }
      return obj;
    }));

    // Update selected objective if it's the one being updated
    if (selectedObjective?.id === objectiveId) {
      const updatedObjective = objectives?.find(obj => obj?.id === objectiveId);
      if (updatedObjective) {
        setSelectedObjective({
          ...updatedObjective,
          keyResultsData: updatedObjective?.keyResultsData?.map(kr => 
            kr?.id === krId ? { ...kr, progress: newProgress } : kr
          )
        });
      }
    }
  };

  const handleCommentAdd = (objectiveId, comment) => {
    const newComment = {
      id: Date.now(),
      author: "Current User",
      content: comment,
      timestamp: "Just now"
    };

    setObjectives(prev => prev?.map(obj => 
      obj?.id === objectiveId 
        ? { ...obj, comments: [newComment, ...(obj?.comments || [])] }
        : obj
    ));

    if (selectedObjective?.id === objectiveId) {
      setSelectedObjective(prev => ({
        ...prev,
        comments: [newComment, ...(prev?.comments || [])]
      }));
    }
  };

  const handleBulkUpdate = (selectedObjectiveIds) => {
    setShowBulkModal(true);
  };

  const handleBulkUpdateSubmit = (updateData) => {
    setObjectives(prev => prev?.map(obj => {
      if (updateData?.objectiveIds?.includes(obj?.id)) {
        switch (updateData?.type) {
          case 'progress':
            return { ...obj, progress: updateData?.value, lastUpdated: "Just now" };
          case 'status':
            return { ...obj, status: updateData?.value, lastUpdated: "Just now" };
          case 'comment':
            const newComment = {
              id: Date.now(),
              author: "Current User",
              content: updateData?.value,
              timestamp: "Just now"
            };
            return { 
              ...obj, 
              comments: [newComment, ...(obj?.comments || [])],
              lastUpdated: "Just now"
            };
          default:
            return obj;
        }
      }
      return obj;
    }));
  };

  const handleEvidenceUpload = (krId) => {
    setSelectedKRForEvidence(krId);
    setShowEvidenceModal(true);
  };

  const handleEvidenceUploadSubmit = (evidenceData) => {
    console.log('Evidence uploaded:', evidenceData);
    // In a real app, this would upload to a server
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar />
        <div className={`transition-all duration-300 pt-16 ${isCollapsed ? 'ml-0 md:ml-16' : 'ml-0 md:ml-60'}`}>
          <div className="flex items-center justify-center h-[calc(100vh-64px)]">
            <div className="text-center p-8 max-w-md mx-auto">
              <div className="text-destructive mb-4">
                <Icon name="AlertCircle" size={48} className="mx-auto" />
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

  if (isOrgLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar />
        <div className={`transition-all duration-300 pt-16 ${isCollapsed ? 'ml-0 md:ml-16' : 'ml-0 md:ml-60'}`}>
          <div className="flex items-center justify-center h-[calc(100vh-64px)]">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">{isOrgLoading ? 'Loading organization...' : 'Loading objectives...'}</p>
              <button 
                onClick={() => window.location.reload()}
                className="text-xs text-primary mt-4 hover:underline"
              >
                Taking too long? Reload
              </button>
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
      
      <main className={`transition-all duration-300 pt-16 pb-20 md:pb-4 ${
        isCollapsed ? 'ml-0 md:ml-16' : 'ml-0 md:ml-60'
      }`}>
        {/* Quick Stats Bar */}
        <QuickStatsBar objectives={objectives} />

        {/* Main Content */}
        <div className="flex h-[calc(100vh-140px)] relative">
          {/* Objectives List - 30% width on desktop, full width on mobile if no selection */}
          <div className={`w-full md:w-[30%] border-r border-border ${selectedObjective ? 'hidden md:block' : 'block'}`}>
            <ObjectivesList
              objectives={objectives}
              selectedObjective={selectedObjective}
              onObjectiveSelect={handleObjectiveSelect}
              onBulkUpdate={handleBulkUpdate}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>

          {/* Progress Panel - 70% width on desktop, full width on mobile if selection active */}
          <div className={`w-full md:w-[70%] ${selectedObjective ? 'block' : 'hidden md:block'}`}>
            {selectedObjective ? (
              <div className="h-full flex flex-col">
                {/* Mobile Back Button */}
                <div className="md:hidden p-4 border-b border-border flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="ArrowLeft"
                    onClick={() => setSelectedObjective(null)}
                  >
                    Back to List
                  </Button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <ProgressPanel
                    objective={selectedObjective}
                    onProgressUpdate={handleProgressUpdate}
                    onCommentAdd={handleCommentAdd}
                    onEvidenceUpload={handleEvidenceUpload}
                  />
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center bg-muted/10">
                <div className="text-center p-6">
                  <Icon name="Target" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Select an Objective</h3>
                  <p className="text-muted-foreground">Choose an objective from the list to track progress</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Floating Action Button - Mobile (only visible on list view) */}
        {!selectedObjective && (
          <div className="fixed bottom-20 right-4 md:hidden">
            <Button
              variant="default"
              size="icon"
              className="w-14 h-14 rounded-full shadow-lg"
              onClick={() => setShowBulkModal(true)}
            >
              <Icon name="Edit" size={24} />
            </Button>
          </div>
        )}
      </main>

      {/* Modals */}
      <BulkUpdateModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        selectedObjectives={[]} // This would come from ObjectivesList component
        objectives={objectives}
        onBulkUpdate={handleBulkUpdateSubmit}
      />

      <EvidenceUploadModal
        isOpen={showEvidenceModal}
        onClose={() => setShowEvidenceModal(false)}
        keyResultId={selectedKRForEvidence}
        onEvidenceUpload={handleEvidenceUploadSubmit}
      />

      {/* Keyboard Shortcuts Help */}
      <div className="fixed bottom-4 left-4 hidden lg:block">
        <div className="bg-card border border-border rounded-lg p-3 shadow-sm">
          <div className="text-xs text-muted-foreground space-y-1">
            <div><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Tab</kbd> Navigate fields</div>
            <div><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+U</kbd> Bulk update</div>
            <div><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+E</kbd> Add evidence</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTrackingAndUpdates;