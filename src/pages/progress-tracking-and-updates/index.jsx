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
        const { data: objs, error } = await supabase
          .from('objectives')
          .select(`
            *,
            keyResults:key_results(*)
          `)
          .eq('organization_id', currentOrg.id)
          .order('updated_at', { ascending: false });

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
        <div className="flex h-[calc(100vh-140px)]">
          {/* Objectives List - 30% width */}
          <div className="w-full md:w-[30%] border-r border-border">
            <ObjectivesList
              objectives={objectives}
              selectedObjective={selectedObjective}
              onObjectiveSelect={handleObjectiveSelect}
              onBulkUpdate={handleBulkUpdate}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>

          {/* Progress Panel - 70% width */}
          <div className="hidden md:block w-[70%]">
            <ProgressPanel
              objective={selectedObjective}
              onProgressUpdate={handleProgressUpdate}
              onCommentAdd={handleCommentAdd}
              onEvidenceUpload={handleEvidenceUpload}
            />
          </div>
        </div>

        {/* Mobile Progress Panel */}
        {selectedObjective && (
          <div className="md:hidden">
            <div className="p-4 border-t border-border bg-card">
              <Button
                variant="outline"
                fullWidth
                iconName="ChevronUp"
                iconPosition="left"
                onClick={() => {
                  // In a real app, this would open a modal or slide-up panel
                  console.log('Open mobile progress panel');
                }}
              >
                View Progress Details
              </Button>
            </div>
          </div>
        )}

        {/* Floating Action Button - Mobile */}
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